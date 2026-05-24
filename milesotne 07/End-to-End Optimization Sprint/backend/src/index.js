const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// BROKEN ENDPOINT: N+1 Query, No Pagination, Over-fetching, No Compression
app.get('/api/missions', async (req, res) => {
  console.log('--- GET /api/missions called ---');
  let queryCount = 0;

  try {
    const page = req.query.page ? parseInt(req.query.page) : null;
    const limit = req.query.limit ? parseInt(req.query.limit) : null;

    if (page && limit) {
      const skip = (page - 1) * limit;
      const take = limit;

      const total = await prisma.mission.count();
      queryCount++;

      const detailedMissions = await prisma.mission.findMany({
        skip,
        take,
        select: {
          id: true,
          name: true,
          launchDate: true,
          rocket: true,
          crew: {
            select: {
              id: true,
              name: true,
              role: true,
              nationality: true
            }
          }
        }
      });
      queryCount++;

      const totalPages = Math.ceil(total / limit);
      console.log(`Executed ${queryCount} database queries for this request.`);

      return res.json({
        data: detailedMissions,
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
      const detailedMissions = await prisma.mission.findMany({
        select: {
          id: true,
          name: true,
          launchDate: true,
          rocket: true,
          crew: {
            select: {
              id: true,
              name: true,
              role: true,
              nationality: true
            }
          }
        }
      });
      queryCount++;
      console.log(`Executed ${queryCount} database queries for this request.`);
      return res.json(detailedMissions);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch missions' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
