const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticate = require('../auth');

function filterProjectResponse(targetProject, requestingUser) {
    // All current project fields are safe for authorized viewers,
    // but this ensures we don't accidentally leak future sensitive fields.
    const safeProject = {
        id: targetProject.id,
        tenant_id: targetProject.tenant_id,
        name: targetProject.name,
        description: targetProject.description,
        status: targetProject.status,
        budget: targetProject.budget
    };

    // Example logic: maybe only Admin/Manager can see the budget, but instructions say:
    // Admin - sees all projects
    // Manager - sees team projects (all tenant projects in our model)
    // User - sees assigned projects
    // We will strip out budget for User role as an extra safety measure, or keep it. Let's keep it as is, budget is not marked sensitive.
    return safeProject;
}

// List projects across the entire system -> Scoped to tenant
router.get('/', authenticate, async (req, res) => {
  try {
    let query = 'SELECT * FROM projects WHERE tenant_id = $1';
    let params = [req.user.tenant_id];

    if (req.user.role === 'user') {
        // Users can only see projects they are assigned to
        query = `
            SELECT p.* FROM projects p
            JOIN project_assignments pa ON p.id = pa.project_id
            WHERE p.tenant_id = $1 AND pa.user_id = $2
        `;
        params.push(req.user.id);
    }

    const { rows } = await db.query(query, params);
    const filteredRows = rows.map(row => filterProjectResponse(row, req.user));
    res.json(filteredRows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to find projects.' });
  }
});

// Specific project details
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Ensure tenant isolation
    const { rows } = await db.query('SELECT * FROM projects WHERE id = $1 AND tenant_id = $2', [id, req.user.tenant_id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Project not found.' });
    }
    
    // RBAC: Check if User has access
    if (req.user.role === 'user') {
        const { rows: assignment } = await db.query(
            'SELECT * FROM project_assignments WHERE project_id = $1 AND user_id = $2 AND tenant_id = $3',
            [id, req.user.id, req.user.tenant_id]
        );
        if (assignment.length === 0) {
            return res.status(403).json({ error: 'Access denied. You are not assigned to this project.' });
        }
    }

    res.json(filterProjectResponse(rows[0], req.user));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve project info.' });
  }
});

module.exports = router;
