import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  ref: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "authorModel",
    required: true,
  },
  dateref: {
    type: Date,
    required: false,
  },
  NumofBook: {
    type: Number,
    required: true,
  },
  available: {
    type: Boolean,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "categoryModel",
    required: true,
  },
});

const authorSchema = new mongoose.Schema({
  lastName: {
    type: String,
  },
  firstName: {
    type: String,
  },
  nationality: {
    type: String,
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "bookModel",
    required: true,
  },
});

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    enum: ["Horror", "Mystery"],
    required: true,
  },
});

const authorModel = mongoose.model("author", authorSchema);
const bookModel = mongoose.model("book", bookSchema);
const categoryModel = mongoose.model("category", categorySchema);

export { categoryModel, authorModel, bookModel };
