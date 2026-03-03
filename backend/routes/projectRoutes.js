const express = require('express');
const router = express.Router();
const { createProject } = require('../services/projectService');

router.post('/', async (req, res) => {
  try {
    const { ownerEmail, projectName } = req.body;

    if (!ownerEmail || !projectName) {
      return res.status(400).json({ error: "Missing email or project name" });
    }

    const project = await createProject(ownerEmail, projectName);
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/projects/:email
router.get('/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    const projects = await prisma.projects.findMany({
      where: { Owner: { OwnerEmail: email } },
      include: {
        _count: {
          select: { Tasks: true } // This gives us the 'total'
        },
        Tasks: {
          select: { Status: true } // This allows us to filter 'completed' on the frontend
        }
      }
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/v1/projects/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    // This deletes the project. 
    // Note: If tasks aren't set to cascade, you'll need to delete them first.
    await prisma.projects.delete({
      where: { ProjectID: id }
    });

    res.status(204).send(); // 204 means "No Content" (Success)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;