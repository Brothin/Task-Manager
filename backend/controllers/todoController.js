const Todo = require("../models/Todo");
const Project = require("../models/Project");

exports.createTodo = async (req, res) => {
  try {
    const { projectId, description } = req.body;
    const newTodo = new Todo({ description, project: projectId });
    await newTodo.save();

    await Project.findByIdAndUpdate(projectId, {
      $push: { todos: newTodo._id },
    });

    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTodosForProject = async (req, res) => {
  try {
    const todos = await Todo.find({ project: req.params.projectId });
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, status } = req.body;
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      {
        description,
        status,
        updatedDate: Date.now(),
      },
      { new: true }
    );
    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findByIdAndDelete(id);

    await Project.findByIdAndUpdate(todo.project, { $pull: { todos: id } });

    res.status(204).json();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.completeTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      {
        status: "completed",
        updatedDate: Date.now(),
      },
      { new: true }
    );
    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
