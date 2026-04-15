const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required."],
      trim: true,
      validate: {
        validator(value) {
          return typeof value === "string" && value.trim().length > 0;
        },
        message: "Task title cannot be empty.",
      },
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    dueDate: {
      type: Date,
      default: null,
    },
    category: {
      type: String,
      default: "General",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

taskSchema.pre("save", function setCompletionDate(next) {
  if (this.isModified("completed")) {
    this.completedAt = this.completed ? new Date() : null;
  }
  next();
});

module.exports = mongoose.model("Task", taskSchema);
