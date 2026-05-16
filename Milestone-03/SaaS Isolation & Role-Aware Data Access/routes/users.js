const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticate = require('../auth');

// Filter sensitive fields based on the requesting user's role
function filterUserResponse(targetUser, requestingUser) {
    const safeUser = {
        id: targetUser.id,
        tenant_id: targetUser.tenant_id,
        full_name: targetUser.full_name,
        email: targetUser.email,
        role: targetUser.role
    };

    // Admin sees all sensitive fields (except password hash which is never exposed)
    if (requestingUser.role === 'admin') {
        safeUser.salary = targetUser.salary;
    }

    return safeUser;
}

// List all users within the same tenant
router.get('/', authenticate, async (req, res) => {
  try {
    let query = 'SELECT * FROM users WHERE tenant_id = $1';
    let params = [req.user.tenant_id];

    // User role can only see their own profile
    if (req.user.role === 'user') {
        query += ' AND id = $2';
        params.push(req.user.id);
    }

    const { rows } = await db.query(query, params);
    
    // Map response to safe objects
    const filteredRows = rows.map(row => filterUserResponse(row, req.user));
    res.json(filteredRows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve users.' });
  }
});

// Single user profile view
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Ensure tenant isolation
    const { rows } = await db.query('SELECT * FROM users WHERE id = $1 AND tenant_id = $2', [id, req.user.tenant_id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    
    const targetUser = rows[0];

    // Role-Based Access Control
    if (req.user.role === 'user' && targetUser.id !== req.user.id) {
        return res.status(403).json({ error: 'Access denied. You can only view your own profile.' });
    }

    res.json(filterUserResponse(targetUser, req.user));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to find user.' });
  }
});

module.exports = router;
