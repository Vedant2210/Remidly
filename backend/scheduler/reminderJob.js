import cron from "node-cron";
import Todo from "../models/Todo.js";
import User from "../models/User.js";
import { sendReminderEmail } from "../utils/email.js";

cron.schedule("*/1 * * * *", async () => {
  const now = new Date();
  const reminderTime = new Date(now.getTime() + 10 * 60000);

  const todos = await Todo.find({
    deadline: { $lte: reminderTime, $gt: now },
    reminderSent: false,
  }).populate("userId");

  for (let todo of todos) {
    await sendReminderEmail(
      todo.userId.email,
      todo.title,
      new Date(todo.deadline).toLocaleString()
    );

    todo.reminderSent = true;
    await todo.save();
  }
});
