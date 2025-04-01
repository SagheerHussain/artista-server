const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("../cloudinary");

// Register account
const createAccount = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Cloudinary pr dono images upload karni hain
    let profilePicturePath = '';
    if (req.file) {
      profilePicturePath = await cloudinary.uploader.upload(req.file.path); // ✅ Cloudinary URL
    }

    console.log(profilePicturePath, name, email, password);
    const user = await User.findOne({ email });
    if (user) res.json({ message: "A user with this email is already exist" });

    await bcrypt.genSalt(10, async (err, salt) => {
      await bcrypt.hash(password, salt, async (err, hash) => {
        const newUser = await User.create({
          name,
          email,
          password: hash,
          profilePicture: profilePicturePath.url,
        });
        res.status(200).json({ success: true, user: newUser, message: "Successfully registered" });
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Login account
const loginAccount = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(201).json({ success: false, message: "User with this email not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(201)
        .json({ success: false, message: "Your Password is Incorrect password" });
    }

    const token = await jwt.sign({ email: user.email }, process.env.JWT_KEY, {
      expiresIn: "1d",
    });

    res
      .status(200)
      .json({ success: true, token, user, message: "Successfully logged in" });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { createAccount, loginAccount };
