const mongoose = require("mongoose");
const Task = require("../models/task.model");

// Helper: checks owner or admin
const canAccess = (reqUser, resourceUserId) => {
  if (!reqUser) return false;
  if (reqUser.role === "admin") return true;
  return String(resourceUserId) === String(reqUser.id);
};

const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "title and description are required" });
    }

    const task = await Task.create({
      title,
      description,
      user: req.user.id,
    });

    return res.status(201).json(task);
  } catch (err) {
    console.error("createTask error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllTasks = async (req, res) => {
  try {
    // admin can see all, user sees only their own
    const filter = req.user.role === "admin" ? {} : { user: req.user.id };

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    return res.json(tasks);
  } catch (err) {
    console.error("getAllTasks error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (!canAccess(req.user, task.user)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return res.json(task);
  } catch (err) {
    console.error("getTaskById error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (!canAccess(req.user, task.user)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { title, description } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;

    await task.save();
    return res.json(task);
  } catch (err) {
    console.error("updateTask error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (!canAccess(req.user, task.user)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await task.deleteOne();
    return res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("deleteTask error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
