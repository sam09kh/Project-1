const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator"); // validation on form
const User = require("../models/userauth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const fetchuser = require("../middleware/fetchuser");
const forgotEmail = require("../mailing/forgotmailer");
dotenv.config();

// Generate a random code
const generateResetToken = () => {
  const min = 10000;
  const max = 99999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Add an User using "POST" /api/auth/signup : NO Login required:
router.post(
  "/signup",
  [
    body("firstname", "Enter Maximum 4 characters").isLength({ min: 4 }),
    body("lastname", "Enter Maximum 4 characters").isLength({ min: 4 }),
    body("email", "Please Enter valid email").isEmail().trim(),
    body("password", "Password must be 5 characters at least").isLength({
      min: 5,
    }),
    body("confirmpassword", "Password must be 5 characters at least").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    // if there a error, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    // success if ture is anywhere
    let success = false;
    try {
      const { firstname, lastname, email, password, confirmpassword, picture } =
        req.body;

      // Check if password and confirm password match
      if (password !== confirmpassword) {
        return res
          .status(400)
          .send({ message: "Password and confirm password do not match" });
      }

      // check if an existing email
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        success = false;
        return res
          .status(400)
          .json({ message: "Email already exists!", success });
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      const hashConfirmPassword = await bcrypt.hash(confirmpassword, salt);
      const user = await User.create({
        firstname,
        lastname,
        email,
        password: hashPassword,
        confirmpassword: hashConfirmPassword,
        picture,
        verified: false,
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, process.env.SECRET_KEY);
      if (!user) {
        return res.status(404).send({ message: "Account not created" });
      }
      res.status(200).json({
        message: "Successfully registered account",
        authToken,
      });
    } catch (error) {
      res.status(500).send({ message: "Internal server error!" });
      console.error(error.message);
    }
  }
);

// Login an User using "POST" /api/auth/login : Login required:
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    // success if ture is anywhere
    let success = false;
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          error: "please try to login with correct credentials",
          success,
        });
      }

      const comparepassword = await bcrypt.compare(password, user.password);
      if (!comparepassword) {
        return res
          .status(400)
          .json({ message: "please try to login with correct credential" });
      }
      // if user is not avaiable
      if (!user) {
        success = false;
        return res.status(404).json({ message: "Invalid Details", success });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(data, process.env.SECRET_KEY);
      // Update lastToken in the database
      user.lastToken = token;
      await user.save();
      res.status(200).json({
        authToken: token,
        message: "You have SuccessFully Login",
      });
    } catch (error) {
      res.status(500).send({ message: "Internal server error!" });
      console.error(error.message);
    }
  }
);

// Fetch an user data using POST "/api/auth/getuser". login required.
router.get("/getuser", fetchuser, async (req, res) => {
  try {
    let userId = req.user.id;
    const user = await User.findById(userId)
      .select("-password")
      .select("-confirmpassword");
    res.send({ user });
  } catch (error) {
    res.status(500).send({ message: "Internal server error!" });
    console.error(error.message);
  }
});

// forgot-password Using "POST" "/api/auth/forgot-password". Login required
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    if (user.resetToken && user.resetTokenExpires > Date.now()) {
      return res.status(400).send("Password reset email already sent.");
    }

    const resetToken = generateResetToken();
    const resetTokenExpires = Date.now() + 3600000;

    user.resetToken = resetToken;
    user.resetTokenExpires = resetTokenExpires;
    await user.save();
    forgotEmail(email, resetToken);
    res.status(200).send({
      message: "Password reset email sent. Check your email for instructions.",
    });
  } catch (error) {
    res.status(500).send("Internal server error!");
    console.error(error.message);
  }
});

// resetpassword Using "POST" "/api/auth/reset-password". Login required
router.post(
  "/reset-password",
  [
    body("password", "Password must be 5 characters at least")
      .isLength({
        min: 5,
      })
      .notEmpty(),
    body("confirmpassword", "Password must be 5 characters at least")
      .isLength({
        min: 5,
      })
      .notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    try {
      const { randomKey, password, confirmpassword } = req.body;

      if (password !== confirmpassword) {
        return res
          .status(400)
          .send({ message: "Password and confirm password do not match" });
      }

      const user = await User.findOne({
        resetToken: randomKey,
        resetTokenExpires: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).send("User Not Availabe");
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      const hashConfirmPassword = await bcrypt.hash(confirmpassword, salt);

      // Update user's password and clear reset token fields
      user.password = hashPassword;
      user.confirmpassword = hashConfirmPassword;
      user.resetToken = null;
      user.resetTokenExpires = null;
      await user.save();

      res.status(200).send({ message: "Password reset successfully" });
    } catch (error) {
      res.status(500).send("Internal server error!");
      console.error(error.message);
    }
  }
);

module.exports = router;
