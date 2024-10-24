const Project = require("../models/Project");

exports.createProject = async (req, res) => {
  try {
    const { title } = req.body;
    const newProject = new Project({ title });
    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("todos"); // Populate todos
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("todos");
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
