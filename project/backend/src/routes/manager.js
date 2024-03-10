const express = require("express");
const routes = express.Router();
const Admin = require("../models/manager");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const router = require("./userauthenticate");
const Expense = require("../models/Expense");
dotenv.config();

routes.post("/createadmin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const existingEmail = await Admin.findOne({ email });
    if (existingEmail) {
      return res.status(400).send({ message: "Email already exists!" });
    }
    const admin = await Admin.create({
      email,
      password: hashPassword,
    });

    const data = {
      admin: {
        id: admin.id,
      },
    };
    const authToken = jwt.sign(data, process.env.SECRET_KEY);
    if (!admin) {
      return res.status(400).json({ message: "Admin" });
    }
    admin.token = authToken;
    await admin.save();
    res.status(200).json({ message: "Success Login", authToken });
  } catch (error) {
    res.status(500).send({ message: "Internal server error!" });
    console.error(error.message);
  }
});

routes.post("/loginmanager", async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(405).send({ message: "Invalid Authenticate" });
    }
    res.status(200).send({ message: "Lets explore" });
  } catch (error) {
    res.status(500).send({ message: "Internal server error!" });
    console.error(error.message);
  }
});

router.put("/expenses/:expenseId", async (req, res) => {
  try {
    const { expenseId } = req.params;
    console.log(expenseId);
    const { status } = req.body;
    const expense = await Expense.findById(expenseId);
    if (!expense) return res.status(404).json({ error: "Expense not found" });
    expense.status = status;
    await expense.save();
    res.status(200).json({ message: "Expense request updated successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal server error!" });
    console.error(error.message);
  }
});

module.exports = routes;
