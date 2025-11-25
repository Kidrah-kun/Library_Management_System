const {isAuthenticated, isAuthorized} = require("../middlewares/authMiddleware");
const { addBook, deleteBook, getAllBooks } = require("../controllers/bookController");
const express = require("express");
const router = express.Router();

router.post("/admin/add", isAuthenticated, isAuthorized("Admin"), addBook);
router.delete("/admin/delete/:id", isAuthenticated, isAuthorized("Admin"), deleteBook);
router.get("/all", isAuthenticated, getAllBooks);

module.exports = router;
