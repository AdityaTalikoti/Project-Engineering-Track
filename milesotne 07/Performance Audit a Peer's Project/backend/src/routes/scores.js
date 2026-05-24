const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Issue B1: No Pagination
// Issue B2: Over-fetching (includes strategyNote)
router.get('/', async (req, res) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : null;
    const limit = req.query.limit ? parseInt(req.query.limit) : null;

    if (page && limit) {
      const skip = (page - 1) * limit;
      const take = limit;

      const total = await prisma.score.count();
      const scores = await prisma.score.findMany({
        skip,
        take,
        orderBy: { date: 'desc' }
      });

      const totalPages = Math.ceil(total / limit);

      return res.json({
        data: scores,
        meta: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      });
    } else {
      const scores = await prisma.score.findMany({
        orderBy: { date: 'desc' }
      });
      return res.json(scores);
    }
  } catch (error) {
    console.error('Error fetching scores:', error);
    res.status(500).json({ error: 'Failed to fetch scores' });
  }
});

module.exports = router;
