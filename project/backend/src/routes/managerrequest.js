const express = require("express");
const routes = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Expense = require("../models/Expense");

// send message user to manager to accept the request or niether reject request. Using Post "/api/auth/request"
routes.post("/expenses", fetchuser, async (req, res) => {
  try {
    const { description, amount } = req.body;
    const newExpense = new Expense({
      user: req.user.id,
      description,
      amount,
    });
    await newExpense.save();
    if (!newExpense) {
      return res.status(402).send({ message: "something went wrong!" });
    }
    res.json(newExpense);
  } catch (error) {
    res.status(500).send({ message: "Internal server error!" });
    console.error(error.message);
  }
});

// see the message Using get
routes.get("/expenses/:employeesId", fetchuser, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    if (!expenses) {
      res.status(404).send({ message: "Not found" });
    }
    res.status(200).send(expenses);
  } catch (error) {
    res.status(500).send({ message: "Internal server error!" });
    console.error(error.message);
  }
});

module.exports = routes;
