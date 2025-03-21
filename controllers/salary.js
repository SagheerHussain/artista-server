const Salary = require("../models/Salary");
const User = require("../models/User");

// Get all salaries
const getAllSalaries = async (req, res) => {
  try {
    const salaries = await Salary.find().populate("employee");
    res.status(200).json({
      success: true,
      salaries,
      message: "Salaries fetched successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Get salary by id
const getSalaryById = async (req, res) => {
  try {
    const salary = await Salary.findById(req.params.id).populate("employee");
    if (!salary)
      return res.status(404).json({ success: false, message: "Salary record not found" });
    res.status(200).json({
      success: true,
      salary,
      message: "Salary fetched successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Create new salary
const createSalary = async (req, res) => {
  try {
    const { employee, amount, bonus, status, paidDate, totalAmount } = req.body;
    if (!employee || !amount || !bonus || !status || !paidDate || !totalAmount) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const user = await User.findById({ _id: employee });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const newSalary = await Salary.create({
      employee: user._id,
      amount: parseInt(amount),
      bonus: parseInt(bonus),
      status,
      paidDate,
      totalAmount: parseInt(totalAmount)
    });
    res.status(200).json({
      success: true,
      message: "Salary record created successfully",
      salary: newSalary,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Update salary
const updateSalary = async (req, res) => {
  try {
    const { id } = req.params;
    const { employee, amount, bonus, status, paidDate } = req.body;
    const updatedSalary = await Salary.findByIdAndUpdate(
      { _id: id },
      { employee, amount, bonus, status, paidDate },
      { new: true }
    );
    if (!updatedSalary)
      return res
        .status(404)
        .json({ success: false, message: "Salary record not found" });
    res.status(200).json({
      success: true,
      message: "Salary record updated successfully",
      salary: updatedSalary,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Delete salary
const deleteSalary = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSalary = await Salary.findByIdAndDelete({ _id: id });
    if (!deletedSalary)
      return res
        .status(404)
        .json({ success: false, message: "Salary record not found" });
    res.status(200).json({
      success: true,
      message: "Salary record deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Search salaries by employee
const searchSalariesByEmployee = async (req, res) => {
    try {
        
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
};

module.exports = {
  getAllSalaries,
  getSalaryById,
  createSalary,
  updateSalary,
  deleteSalary,
  searchSalariesByEmployee
};
