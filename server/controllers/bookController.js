const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors.js");
const Book = require("../models/bookModel.js");
const User = require("../models/userModel.js");
const { ErrorHandler } = require("../middlewares/errorMiddlewares.js");

const addBook = catchAsyncErrors(async (req, res, next) => {
    const { title, author, description, price, quantity } = req.body;
    
    if (!title || !author || !description || !price || !quantity) {
        return next(new ErrorHandler("All fields are required to add a book.", 400));
    }

    const book = await Book.create({
        title,
        author,
        description,
        price,
        quantity,
        availability: quantity > 0
    });
    res.status(201).json({
        success: true,
        message: "Book added successfully",
        book
    });
});

const deleteBook = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const book = await Book.findById(id);

    if (!book) {
        return next(new ErrorHandler("Book not found.", 404));
    }
    await book.deleteOne();
    res.status(200).json({
        success: true,
        message: "Book deleted successfully"
    });
});

const getAllBooks = catchAsyncErrors(async (req, res, next) => {
    const books = await Book.find();
    res.status(200).json({
        success: true,
        books
    });
});


module.exports = { addBook, deleteBook, getAllBooks };