const express = require("express");
const Task = require("../models/Task");
const router = express.Router();

function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/auth/login");
}

// List Tasks
router.get("/", ensureAuth, async (req, res) => {
  const tasks = await Task.find({ user: req.user._id }).sort({ dueDate: 1 });
  res.render("tasks/list", { tasks });
});

// Add Task
router.get("/add", ensureAuth, (req, res) => res.render("tasks/add"));

router.post("/add", ensureAuth, async (req, res) => {
  await Task.create({ ...req.body, user: req.user._id });
  res.redirect("/tasks");
});

// Edit Task
router.get("/edit/:id", ensureAuth, async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
  res.render("tasks/edit", { task });
});

router.post("/edit/:id", ensureAuth, async (req, res) => {
  req.body.completed = req.body.completed === "on";
  await Task.updateOne({ _id: req.params.id, user: req.user._id }, req.body);
  res.redirect("/tasks");
});

// Delete Task
router.post("/delete/:id", ensureAuth, async (req, res) => {
  await Task.deleteOne({ _id: req.params.id, user: req.user._id });
  res.redirect("/tasks");
});

module.exports = router;
