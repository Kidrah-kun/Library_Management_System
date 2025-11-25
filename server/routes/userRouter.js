const express = require("express");
const router = express.Router();
const { getAllUsers, registerNewAdmin } = require("../controllers/userController.js");
const { isAuthenticated, isAuthorized } = require("../middlewares/authMiddleware.js");


router.get("/all", isAuthenticated, isAuthorized("Admin"), getAllUsers);
router.post("/add/new-admin", isAuthenticated, isAuthorized("Admin"), registerNewAdmin);

module.exports = router;