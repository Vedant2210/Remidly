// import express from "express";
// import Todo from "../models/Todo.js";
// import authMiddleware from "../middleware/authMiddleware.js";

// const router = express.Router();

// // Add todo
// router.post("/", authMiddleware, async (req, res) => {
//   const todo = new Todo({
//     title: req.body.title,
//     userId: req.userId,
//   });
//   await todo.save();
//   res.json(todo);
// });

// // Get user's todos
// router.get("/", authMiddleware, async (req, res) => {
//   const todos = await Todo.find({ userId: req.userId });
//   res.json(todos);
// });

// // Delete todo
// router.delete("/:id", authMiddleware, async (req, res) => {
//   const todo = await Todo.findOne({
//     _id: req.params.id,
//     userId: req.userId,
//   });
//   if (!todo) return res.status(404).json("Not found");

//   await todo.deleteOne();
//   res.json("Deleted");
// });

// export default router;


import express from "express";
import Todo from "../models/Todo.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ➕ Add Todo (with deadline)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, deadline } = req.body;

    if (!title || !deadline) {
      return res.status(400).json("Title and deadline are required");
    }

    const todo = new Todo({
      title,
      deadline: new Date(deadline),
      userId: req.userId,
      reminderSent: false,
    });

    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json("Failed to add todo");
  }
});

// 📥 Get user's todos (sorted by deadline)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.userId })
      .sort({ deadline: 1 }); // earliest deadline first

    res.json(todos);
  } catch (err) {
    res.status(500).json("Failed to fetch todos");
  }
});

// ❌ Delete todo (only own)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!todo) {
      return res.status(404).json("Todo not found");
    }

    await todo.deleteOne();
    res.json("Deleted successfully");
  } catch (err) {
    res.status(500).json("Failed to delete todo");
  }
});

export default router;
