import { categoryModel, authorModel, bookModel } from "../models/book.js";
import mongoose from "mongoose";
import { ObjectId } from "mongoose";


export const addBook = async (req, res) => {
  try {
    const existingBook = await bookModel.findOne({ ref: req.body.ref });

    if (!existingBook) {
      const author = await authorModel.findOneAndUpdate(
        {
          lastName: req.body.author.lastName,
          firstName: req.body.author.firstName,
          nationality: req.body.author.nationality,
        },
        {},
        { upsert: true, new: true }
      );

      const category = await categoryModel.findOneAndUpdate(
        { title: req.body.category.title },
        { title: req.body.category.title },
        { upsert: true, new: true }
      );

      const newBook = await bookModel.create({
        title: req.body.title,
        ref: req.body.ref,
        author: author._id,
        dateref: req.body.dateref,
        NumofBook: req.body.NumofBook,
        available: req.body.available,
        category: category._id,
      });

      return res.status(201).json({
        bookData: newBook,
        message: 'Book added successfully',
      });
    }

    res.status(201).json({ message: 'Book already exists' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




export const getBook = async (req, res) => {
  try {
    const bookData = await bookModel.findOne({ ref: req.body.ref }).populate('author category');
    if (!bookData) {
      return res.status(401).json({ message: 'Book not found' });
    }

    res.status(200).json(bookData);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const updateBook = async (req, res) => {
  const { ref } = req.params;
  const updatedBookData = req.body;
  try {
    const updatedBook = await bookModel.findOneAndUpdate({ ref }, updatedBookData, { new: true }).populate('author category');
    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json(updatedBook);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const deleteBook = async (req, res) => {
  const { ref } = req.params;
  try {
    const deletedBook = await bookModel.findOneAndDelete({ ref }).populate('author category');
    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Delete the associated author as well
    await authorModel.findOneAndDelete({ book: deletedBook._id });

    // Remove the book from the category's books array
    await categoryModel.findOneAndUpdate(
      { _id: deletedBook.category }, // Assuming category is identified by _id
      { $pull: { books: deletedBook._id } } // Remove the deleted book's ID from the books array of the category
    );

    res.status(200).json({ message: 'Book, Author, and Category deleted successfully' });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
