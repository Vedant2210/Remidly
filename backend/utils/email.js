import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
// 🔍 DEBUG: check env variables at runtime
console.log("DEBUG EMAIL:", process.env.EMAIL);
console.log(
  "DEBUG EMAIL_PASS:",
  process.env.EMAIL_PASS ? "LOADED" : "MISSING"
);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

// Optional: verify SMTP connection once
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP VERIFY ERROR:", error.message);
  } else {
    console.log("SMTP SERVER READY");
  }
});

export const sendReminderEmail = async (to, task, deadline) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject: "⏰ Task Reminder",
    text: `Time is getting up!
Please complete your task: "${task}"

Deadline: ${deadline}`,
  });
};
