import mongoose from "mongoose";

// const TodoSchema = new mongoose.Schema({
//   title: String,
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//   },
// }, { timestamps: true });

// export default mongoose.model("Todo", TodoSchema);
const TodoSchema = new mongoose.Schema({
  title: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  deadline: Date,
  reminderSent: {
    type: Boolean,
    default: false,
  },
});
 export default mongoose.model("Todo", TodoSchema);