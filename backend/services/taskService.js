const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createTask = async (data) => {
  return await prisma.tasks.create({
    data: {
      TaskTitle: data.title,
      ProjectID: data.projectId,
      DueDate: new Date(data.due),
      AssignedEmail: data.assignedEmail,
      Location: data.location || null,
      Status: 'Pending'
    }
  });
};

const getTasks = async (filters) => {
  const { projectId, status, sortBy = 'DueDate', order = 'asc' } = filters;
  
  return await prisma.tasks.findMany({
    where: {
      ProjectID: projectId,
      Status: status,
      DeletedAt: null // Exclude soft-deleted
    },
    orderBy: {
      [sortBy]: order
    },
    include: {
      Project: { select: { ProjectName: true } }
    }
  });
};

const updateTask = async (id, updates) => {
  const currentTask = await prisma.tasks.findUnique({ where: { TaskID: id } });

  // Edge Case: If DueDate changes, reset notification flags
  if (updates.due && new Date(updates.due).getTime() !== currentTask.DueDate.getTime()) {
    updates.NotifiedUpcomingAt = null;
    updates.NotifiedOverdueAt = null;
  }

  // If Status is set to Completed, we could potentially clear EventID here
  if (updates.status === 'Completed') {
    updates.NotifiedUpcomingAt = new Date(); // Effectively silence upcoming alerts
  }

  return await prisma.tasks.update({
    where: { TaskID: id },
    data: {
      TaskTitle: updates.title,
      DueDate: updates.due ? new Date(updates.due) : undefined,
      Status: updates.status,
      Location: updates.location,
      AssignedEmail: updates.assignedEmail,
      NotifiedUpcomingAt: updates.NotifiedUpcomingAt,
      NotifiedOverdueAt: updates.NotifiedOverdueAt
    }
  });
};

const softDeleteTask = async (id) => {
  return await prisma.tasks.update({
    where: { TaskID: id },
    data: { DeletedAt: new Date() }
  });
};

const completeTask = async (id) => {
  return await prisma.tasks.update({
    where: { TaskID: id },
    data: { 
      Status: 'Completed',
      // We set this to "now" so the worker knows a notification 
      // check has effectively 'passed' for upcoming alerts.
      NotifiedUpcomingAt: new Date() 
    }
  });
};

module.exports = { createTask, getTasks, updateTask, softDeleteTask, completeTask };