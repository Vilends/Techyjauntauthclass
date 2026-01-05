const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controller/task.controller");

// Protect ALL task routes
router.use(auth);

router.post("/", createTask);
router.get("/", getAllTasks);
router.get("/:id", getTaskById);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
