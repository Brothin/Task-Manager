const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  updatedDate: {
    type: Date,
    default: Date.now,
  },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" }, // Reference to the Project
});

const Todo = mongoose.model("Todo", todoSchema);
module.exports = Todo;
