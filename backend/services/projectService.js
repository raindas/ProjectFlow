const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createProject = async (ownerEmail, projectName) => {
  // First, find or create the owner settings (acting as our 'user' for now)
  const owner = await prisma.settings.upsert({
    where: { OwnerEmail: ownerEmail },
    update: {},
    create: { OwnerEmail: ownerEmail },
  });

  return await prisma.projects.create({
    data: {
      ProjectName: projectName,
      OwnerID: owner.OwnerID,
    },
    include: {
      _count: { select: { Tasks: true } } // Returns task count automatically
    }
  });
};

module.exports = { createProject };