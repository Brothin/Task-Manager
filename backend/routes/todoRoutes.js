const express = require("express");
const {
  createTodo,
  getTodosForProject,
  updateTodo,
  deleteTodo,
  completeTodo,
} = require("../controllers/todoController");

const router = express.Router();

router.post("/", createTodo); 
router.get("/:projectId", getTodosForProject);
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo); 
router.patch("/:id/complete", completeTodo); 

module.exports = router;
