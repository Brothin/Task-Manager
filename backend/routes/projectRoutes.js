const express = require("express");
const {
  createProject,
  getProjects,
  getProjectById,
} = require("../controllers/projectController");
const authMiddleware = require("../middleware/auth");
const router = express.Router();
const fs = require("fs");
const { Octokit } = require("@octokit/rest");

router.post("/", authMiddleware, createProject); 
router.get("/", authMiddleware, getProjects); 
router.get("/:id", authMiddleware, getProjectById); 

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const generateMarkdown = (project, todos) => {
  const completedTodos = todos.filter((todo) => todo.isCompleted);
  const pendingTodos = todos.filter((todo) => !todo.isCompleted);

  const markdown = `
# ${project.title}

### Summary: ${completedTodos.length} / ${todos.length} completed

## Pending Todos:
${pendingTodos.map((todo) => `- [ ] ${todo.text}`).join("\n")}

## Completed Todos:
${completedTodos.map((todo) => `- [x] ${todo.text}`).join("\n")}
  `;
  return markdown;
};

router.post("/export-gist/:projectId", async (req, res) => {
  const { projectId } = req.params;
  const octokit = new Octokit({ auth: GITHUB_TOKEN });

  try {
    const project = await Project.findById(projectId); // Assuming a Project model
    const todos = await Todo.find({ projectId });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const markdownContent = generateMarkdown(project, todos);
    const fileName = `${project.title}.md`;

    fs.writeFileSync(`./exports/${fileName}`, markdownContent);

    const gistResponse = await octokit.gists.create({
      files: {
        [fileName]: {
          content: markdownContent,
        },
      },
      description: `Project summary for ${project.title}`,
      public: false, 
    });

    res.json({ gistUrl: gistResponse.data.html_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to export project summary" });
  }
});

module.exports = router;
