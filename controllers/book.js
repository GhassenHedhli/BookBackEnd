import { categoryModel, authorModel, bookModel } from "../models/book.js";

export const addBook = async (req, res) => {
  try {
    const existingBook = await bookModel.findOne({ ref: req.body.ref });
    if (!existingBook) {
      const newBook = await bookModel.create(req.body);

      // Create an author and associate it with the book
      const newAuthor = await authorModel.create({
        book: newBook._id,
        lastName: req.body.lastName,
        firstName: req.body.firstName,
        nationality: req.body.nationality,
        // You can add other author fields here
      });

      // Update the book with the author reference
      await bookModel.findByIdAndUpdate(newBook._id, { author: newAuthor._id });

      // Associate the book with the category
      const category = await categoryModel.findOneAndUpdate(
        { title: req.body.category }, // Assuming category is identified by title
        { $push: { books: newBook._id } }, // Add the new book to the category's books array
        { new: true }
      );

      return res.status(201).json({
        bookData: newBook,
        authorData: newAuthor,
        categoryData: category,
        message: 'Book, Author, and Category added successfully',
      });
    }

    res.status(201).json({ message: 'Book already exists' });
  } catch (err) {
    res.status(404).json({ message: err.message });
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
      { title: deletedBook.category }, // Assuming category is identified by title
      { $pull: { books: deletedBook._id } } //to remove the deleted book's ID from the books array of the category
    );

    res.status(200).json({ message: 'Book, Author, and Category deleted successfully' });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
