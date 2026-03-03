const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { startOfDay, endOfDay, subDays } = require('date-fns');

const getOwnerDigestStats = async (ownerId) => {
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);
  const last24h = subDays(now, 1);

  const [total, dueToday, overdue, completed] = await Promise.all([
    // Total Active Tasks
    prisma.tasks.count({
      where: { Project: { OwnerID: ownerId }, Status: { not: 'Completed' }, DeletedAt: null }
    }),
    // Due Today
    prisma.tasks.count({
      where: { 
        Project: { OwnerID: ownerId }, 
        DueDate: { gte: todayStart, lte: todayEnd },
        Status: { not: 'Completed' }
      }
    }),
    // Overdue
    prisma.tasks.count({
      where: { 
        Project: { OwnerID: ownerId }, 
        DueDate: { lt: now },
        Status: { not: 'Completed' }
      }
    }),
    // Completed in last 24h
    prisma.tasks.count({
      where: { 
        Project: { OwnerID: ownerId }, 
        Status: 'Completed',
        UpdatedAt: { gte: last24h }
      }
    })
  ]);

  return { total, dueToday, overdue, completed };
};

module.exports = { getOwnerDigestStats };
