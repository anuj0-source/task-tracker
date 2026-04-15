const express = require("express");
const {
  createTask,
  getTasks,
  updateTask,
  completeTask,
  deleteTask,
} = require("../controllers/task.controller");

const router = express.Router();

router.post("/", createTask);
router.get("/", getTasks);
router.patch("/:id", updateTask);
router.patch("/:id/complete", completeTask);
router.delete("/:id", deleteTask);

module.exports = router;
