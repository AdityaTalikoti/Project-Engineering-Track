const db = require('./db');

async function authenticate(req, res, next) {
    // For this simulation, we expect the requesting user ID to be provided in the X-User-Id header.
    // If not provided, we default to returning a 400 Bad Request since we can't perform RBAC.
    const userId = req.headers['x-user-id'];
    if (!userId) {
        return res.status(400).json({ error: 'Missing X-User-Id header for authentication.' });
    }

    try {
        const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid user.' });
        }
        
        req.user = rows[0];
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Authentication failed.' });
    }
}

module.exports = authenticate;
