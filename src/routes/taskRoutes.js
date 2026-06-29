const express = require("express");
const router = express.Router();
const { createTaskSchema, updateTaskSchema } = require("../schemas/taskSchema");
const validate = require("../middleware/validate");

const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  testDB,
} = require("../controllers/taskController");

router.get("/", getTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

router.get("/test", testDB);

router.post("/", validate(createTaskSchema), createTask);

router.put("/:id", validate(updateTaskSchema), updateTask);

module.exports = router;
