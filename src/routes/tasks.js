const express = require("express");
const prisma = require("../config/db");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

// Create a new task
router.post("/", authenticate, async (req, res) => {
  try {
    const { title, description, deadline, priority } = req.body;
    const task = await prisma.task.create({
      data: {
        title,
        description,
        createDate: new Date(),
        deadline,
        priority,
        status: "TODO",
        userId: req.user.userId,
      },
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to create task" });
  }
});

// Get all tasks for the authenticated user
router.get("/", authenticate, async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.user.userId },
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Update a task
router.put("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, deadline, priority, status } = req.body;
    const task = await prisma.task.update({
      where: { id: parseInt(id), userId: req.user.userId },
      data: { title, description, deadline, priority, status },
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to update task" });
  }
});

// Delete a task (Only if status is TODO)
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const task = await prisma.task.findUnique({
      where: { id: parseInt(id), userId: req.user.userId },
    });

    if (!task || task.status !== "TODO") {
      return res.status(400).json({ error: "Only TODO tasks can be deleted" });
    }

    await prisma.task.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task" });
  }
});

module.exports = router;
