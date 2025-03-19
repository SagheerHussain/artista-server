const express = require("express");
const router = express.Router();
const upload = require("../upload");

const {
  createAccount,
  loginAccount,
  registerAdmin,
} = require("../controllers/auth");

router.post("/login", loginAccount);
router.post("/register", upload.single("profilePicture"), createAccount);

module.exports = router;
