const {ErrorHandler} = require("../middlewares/errorMiddlewares.js");
const {catchAsyncErrors} = require("../middlewares/catchAsyncErrors");
const Borrow = require("../models/borrowModel");
const Book = require("../models/bookModel");
const User = require("../models/userModel");
const { calculateFine} = require("../utils/fineCalculator.js");

const recordBorrowedBook = catchAsyncErrors(
    async (req, res, next) => {
        const { id } = req.params;
        const { email } = req.body;
        const book = await Book.findById(id);

        if (!book) {
            return next(new ErrorHandler("Book not found", 404));
        }
        const user = await User.findOne({ email, role: "User", accountVerified: true });
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }
        if(book.quantity < 1){
            return next(new ErrorHandler("Book is out of stock", 400));
        }

        const isAlreadyBorrowed = user.borrowedBooks.find(
            (b)=> b.bookId.toString() === id && b.returned === false
        );
        if(isAlreadyBorrowed){
            return next(new ErrorHandler("User has already borrowed this book", 400));
        }

        book.quantity -= 1;
        book.availability = book.quantity > 0;
        await book.save();

        user.borrowedBooks.push({
            bookId: book._id,
            bookTitle: book.title,
            borrowedDate: new Date(),
            dueDate: new Date(Date.now() + 7*24*60*60*1000), // 1 weeks from now
            returned: false,
        });
        await user.save();
        await Borrow.create({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            
            book: book._id,
            dueDate: new Date(Date.now() + 7*24*60*60*1000), // 1 weeks from now
            price: book.price,

        });
        res.status(200).json({
            success: true,
            message: "Borrowed Book Recorded successfully",
        });
    }
);

const returnBorrowedBook = catchAsyncErrors(
    async (req, res, next) => {
        const {bookId} = req.params;
        const {email} = req.body;
        const book = await Book.findById(bookId);

        if (!book) {
            return next(new ErrorHandler("Book not found", 404));
        }
        const user = await User.findOne({ email, role: "User", accountVerified: true });
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        const borrowedBook = user.borrowedBooks.find(
            (b) => b.bookId.toString() === bookId && b.returned === false
        );
        if (!borrowedBook) {
            return next(new ErrorHandler("This book is not borrowed by the user", 400));
        }

        borrowedBook.returned = true;
        borrowedBook.returnedDate = new Date();
        await user.save();
        
        book.quantity += 1;
        book.availability = book.quantity > 0;
        await book.save();

        const borrow = await Borrow.findOne({
            book: bookId,
            "user.email": email,
            returnDate: null,
        });
        if (!borrow) {
            return next(new ErrorHandler("Borrow record not found", 404));
        }
        
        borrow.returnDate = new Date();
        const fine = calculateFine(borrow.dueDate); // Implement this function based on your fine policy
        borrow.fine = fine;
        await borrow.save();
        res.status(200).json({
            success: true,
            message: fine > 0 ? `Book has been returned successfully! your total charges including ${fine} are $${book.price + fine} .` : `Book has been returned successfully! your total charges are $${book.price} .`,
        });
    });

const borrowedBooks = catchAsyncErrors(
    async (req, res, next) => {
        const { borrowedBooks} = req.user;
        res.status(200).json({
            success: true,
            borrowedBooks,
        });
    }
);
 
const getBorrowedBooksForAdmin = catchAsyncErrors(
    async (req, res, next) => {
        const borrowedBooks = await Borrow.find() ;
        res.status(200).json({
            success: true,
            borrowedBooks,
        });
    }
);

module.exports = {
    borrowedBooks,
    recordBorrowedBook,
    getBorrowedBooksForAdmin,
    returnBorrowedBook,
}