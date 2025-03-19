const Expance = require("../models/Expance");
const User = require("../models/User");

// Get all expenses
const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expance.find()
      .populate("admin")
      .populate("category");
    res.status(200).json({
      success: true,
      expenses,
      message: "Expances fetched successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Total Expance
const getTotalExpenses = async (req, res) => {
  try {
    const result = await Expense.aggregate([
      {
        $group: {
          _id: null,
          totalExpenseAmount: { $sum: "$amount" } // Sum of all expense amounts
        }
      }
    ]);

    const totalExpense = result[0]?.totalExpenseAmount || 0;

    res.status(200).json({
      success: true,
      totalExpense,
      message: "Total Expense Amount calculated successfully"
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get expense by id
const getExpanceById = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expance.findById(id)
      .populate("admin")
      .populate("category");
    if (!expense)
      return res
        .status(404)
        .json({ success: false, message: "Expense record not found" });
    res.status(200).json({
      success: true,
      expense,
      message: "Expense fetched successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Create new expense
const createExpense = async (req, res) => {
  try {
    const { title, description, amount, category, month, year, admin } = req.body;
    if (!title || !description || !amount || !category || !month || !year || !admin) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const user = await User.findById({ _id: admin });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const newExpance = await Expance.create({
      title,
      description,
      amount,
      category,
      month,
      year,
      admin: user._id,
    });
    res.status(200).json({
      success: true,
      message: "Expense record created successfully",
      expense: newExpance,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Update expense
const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, amount, category, month, year, admin } = req.body;
    const updatedExpense = await Expance.findByIdAndUpdate(
      { _id: id },
      { title, description, amount, category, month, year, admin },
      { new: true }
    ); 
    if (!updatedExpense)
      return res
        .status(404)
        .json({ success: false, message: "Expense record not found" });
    res.status(200).json({
      success: true,
      message: "Expense record updated successfully",
      expense: updatedExpense,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Delete expense
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedExpense = await Expance.findByIdAndDelete({ _id: id });
    if (!deletedExpense)
      return res
        .status(404)
        .json({ success: false, message: "Expense record not found" });
    res.status(200).json({
      success: true,
      message: "Expense record deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
}; 

module.exports = {
  getAllExpenses,
  getTotalExpenses,
  getExpanceById,
  createExpense,
  updateExpense,
  deleteExpense,
};
