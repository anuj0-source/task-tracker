const mongoose = require("mongoose");
const Task = require("../models/task.model");
const asyncHandler = require("../utils/asyncHandler");

function parseDate(value, fieldName) {
  if (value === undefined) {
    return undefined;
  }
  if (value === null || value === "") {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    const error = new Error(`${fieldName} must be a valid date.`);
    error.statusCode = 400;
    throw error;
  }

  return parsed;
}

exports.createTask = asyncHandler(async (req, res) => {
  const { title, description = "", dueDate, category = "General" } = req.body;

  if (typeof title !== "string" || title.trim().length === 0) {
    return res.status(400).json({ message: "Task title cannot be empty." });
  }

  const task = await Task.create({
    title: title.trim(),
    description,
    dueDate: parseDate(dueDate, "dueDate"),
    category,
  });

  return res.status(201).json({
    message: "Task created successfully.",
    data: task,
  });
});

exports.getTasks = asyncHandler(async (_req, res) => {
  const tasks = await Task.find().sort({ createdAt: -1 });
  return res.status(200).json({
    count: tasks.length,
    data: tasks,
  });
});

exports.updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid task id." });
  }

  const task = await Task.findById(id);
  if (!task) {
    return res.status(404).json({ message: "Task not found." });
  }

  const { title, description, dueDate, category } = req.body;

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim().length === 0) {
      return res.status(400).json({ message: "Task title cannot be empty." });
    }
    task.title = title.trim();
  }

  if (description !== undefined) {
    task.description = description;
  }

  if (category !== undefined) {
    task.category = category;
  }

  if (dueDate !== undefined) {
    task.dueDate = parseDate(dueDate, "dueDate");
  }

  await task.save();

  return res.status(200).json({
    message: "Task updated successfully.",
    data: task,
  });
});

exports.completeTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid task id." });
  }

  const task = await Task.findById(id);
  if (!task) {
    return res.status(404).json({ message: "Task not found." });
  }

  if (task.completed) {
    return res.status(409).json({
      message: "Task is already marked as completed.",
    });
  }

  task.completed = true;
  await task.save();

  return res.status(200).json({
    message: "Task marked as completed.",
    data: task,
  });
});

exports.deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid task id." });
  }

  const deletedTask = await Task.findByIdAndDelete(id);
  if (!deletedTask) {
    return res.status(404).json({ message: "Task not found." });
  }

  return res.status(200).json({
    message: "Task deleted successfully.",
  });
});
