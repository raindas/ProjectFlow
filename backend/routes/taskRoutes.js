const express = require('express');
const router = express.Router();
const taskService = require('../services/taskService');

// POST /api/v1/tasks - Create a task
router.post('/', async (req, res) => {
  try {
    const task = await taskService.createTask(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/v1/tasks - List tasks (with query filters)
router.get('/', async (req, res) => {
  try {
    const tasks = await taskService.getTasks(req.query);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/v1/tasks/:id - Update task
router.put('/:id', async (req, res) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.body);
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/v1/tasks/:id - Soft delete
router.delete('/:id', async (req, res) => {
  try {
    await taskService.softDeleteTask(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/complete', async (req, res) => {
  try {
    const task = await taskService.completeTask(req.params.id);
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;