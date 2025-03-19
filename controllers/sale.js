const Sale = require("../models/Sale");
const mongoose = require("mongoose");

const getSales = async (req, res) => {
  try {
    const sales = await Sale.find().populate("user paymentMethod");
    res
      .status(200)
      .json({ success: true, sales, message: "Sales fetched successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getRevenue = async (req, res) => {
  try {
    const result = await Sale.aggregate([
      {
        $group: {
          _id: null, // Group all documents
          totalSalesAmount: { $sum: "$totalAmount" } // Sum of totalAmount field
        }
      }
    ]);
    const totalAmount = result[0]?.totalSalesAmount || 0;
    res
      .status(200)
      .json({ success: true, totalAmount, message: "Revenue fetched successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getPendingAmount = async (req, res) => {
  try {
    const pendingAmount = await Sale.aggregate([
      {
        $group: {
          _id: null,
          pendingAmount: { $sum: "$remainingAmount" },
        },
      },
    ]);
    const totalAmount = pendingAmount[0]?.pendingAmount || 0;
    res
      .status(200)
      .json({ success: true, totalAmount, message: "Pending Amount fetched successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

const getTotalReceivedAmount = async (req, res) => {
  try {
    const result = await Sale.aggregate([
      {
        $project: {
          totalReceived: { $add: ["$upfrontAmount", "$receivedAmount"] } // Add both fields per sale
        }
      },
      {
        $group: {
          _id: null,
          totalReceivedAmount: { $sum: "$totalReceived" } // Sum of all
        }
      }
    ]);

    const totalReceivedAmount = result[0]?.totalReceivedAmount || 0;

    res.status(200).json({
      success: true,
      totalReceivedAmount,
      message: "Total Received Amount (Upfront + Received) calculated successfully"
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUniqueClients = async (req, res) => {
  try {
    // Get distinct client names
    const uniqueClients = await Sale.distinct('clientName');

    res.status(200).json({
      success: true,
      totalClients: uniqueClients.length,
      uniqueClients,
      message: "Unique client names fetched successfully"
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id).populate(
      "user paymentMethod"
    );
    res
      .status(200)
      .json({ success: true, sale, message: "Sale fetched successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getSalesByEmployeeId = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const sales = await Sale.find({ user: employeeId }).populate(
      "user paymentMethod"
    );
    res.status(200).json({
      success: true,
      sales,
      message: "Employee Sales fetched successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const getRevenueByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const sales = await Sale.find({ user: employeeId }).populate(
      "user paymentMethod"
    );
    const totalAmount = sales.reduce((acc, sale) => acc + sale.totalAmount, 0);
    res.status(200).json({
      success: true,
      totalAmount,
      message: "Employee Revenue fetched successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

const getPendingAmountByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const sales = await Sale.find({ user: employeeId }).populate(
      "user paymentMethod"
    );
    const totalAmount = sales.reduce((acc, sale) => acc + sale.remainingAmount, 0);
    res.status(200).json({
      success: true,
      totalAmount,
      message: "Employee Pending Amount fetched successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

const getRecieveAmountByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const sales = await Sale.find({ user: employeeId }).populate(
      "user paymentMethod"
    );
    const totalAmount = sales.reduce((acc, sale) => acc + (sale.receivedAmount + sale.upfrontAmount), 0);
    res.status(200).json({
      success: true,
      totalAmount,
      message: "Employee Received Amount fetched successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

const getClientsByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const sales = await Sale.find({ user: employeeId }).populate(
      "user paymentMethod"
    );
    const clients = sales.map(sale => sale.clientName);
    const uniqueClients = [...new Set(clients)];
    res.status(200).json({
      success: true,
      clients: uniqueClients,
      message: "Employee Clients fetched successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

const getEmployeeCurrentSalesAmount = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const now = new Date();

    // Current month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59
    );

    // Current year
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59);

    // Monthly Sales
    const monthlySales = await Sale.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(employeeId),
          leadDate: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalMonthlySales = monthlySales[0]?.totalSales || 0;

    // Yearly Sales
    const yearlySales = await Sale.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(employeeId),
          leadDate: { $gte: startOfYear, $lte: endOfYear },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalYearlySales = yearlySales[0]?.totalSales || 0;

    // Final Response
    res.status(200).json({
      success: true,
      totalMonthlySales,
      totalYearlySales,
      message: "Employee Current Sales Amount fetched successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const getEmployeeSalesByMonthYear = async (req, res) => {
  try {
    let { employeeId, month, year } = req.params;

    // Normalize input - month lowercase, year as string
    month = month.toLowerCase();
    year = year.toString();

    const sales = await Sale.find({
      user: employeeId,
      month: { $regex: new RegExp(`^${month}$`, "i") }, // Case-insensitive regex
      year: year,
    }).populate("paymentMethod user");

    if (sales.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No sales found for the specified month and year",
      });
    }

    res.status(200).json({
      success: true,
      sales,
      message: "Employee Sales by Month and Year fetched successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getSalesByMonthYear = async (req, res) => {
  try {
    const { month, year } = req.query;

    const sales = await Sale.find({
      month: month,
      year: year,
    }).populate("user paymentMethod");

    res.status(200).json({
      success: true,
      sales,
      message: "Sales by Month and Year fetched successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const createSale = async (req, res) => {
  try {
    const {
      clientName,
      projectTitle,
      summary,
      totalAmount,
      upfrontAmount,
      status,
      paymentMethod,
      month,
      year,
      startDate,
      endDate,
      deadline,
      leadDate,
      user,
    } = req.body;
    const sale = await Sale.create({
      clientName,
      projectTitle,
      summary,
      totalAmount,
      upfrontAmount,
      status,
      paymentMethod,
      month,
      year,
      startDate,
      endDate,
      deadline,
      leadDate,
      user,
    });
    res.status(201).json({
      success: true,
      message: "Sale created successfully",
      sale,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

const updateSale = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      clientName,
      projectTitle,
      summary,
      totalAmount,
      receivedAmount,
      status,
      paymentMethod,
      month,
      year,
      startDate,
      endDate,
      deadline,
      leadDate,
      user,
    } = req.body;

    const sale = await Sale.findById({ _id: id });
    if (!sale) {
      return res.status(404).json({
        success: false,
        message: "Sale not found",
      });
    }

    const updateSale = await Sale.findByIdAndUpdate(
      { _id: id },
      {
        clientName,
        projectTitle,
        summary,
        totalAmount,
        receivedAmount,
        remainingAmount: totalAmount - (receivedAmount + sale.upfrontAmount),
        status,
        paymentMethod,
        month,
        year,
        startDate,
        endDate,
        deadline,
        leadDate,
        user,
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Sale updated successfully",
      sale: updateSale,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

const deleteSale = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await Sale.findByIdAndDelete({ _id: id });
    res.status(200).json({
      success: true,
      message: "Sale deleted successfully",
      sale,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

module.exports = {
  getSales,
  getRevenue,
  getUniqueClients,
  getPendingAmount,
  getTotalReceivedAmount,
  getSaleById,
  getSalesByEmployeeId,
  getClientsByEmployee,
  getRevenueByEmployee,
  getPendingAmountByEmployee,
  getRecieveAmountByEmployee,
  getClientsByEmployee,
  getEmployeeCurrentSalesAmount,
  getEmployeeSalesByMonthYear,
  getSalesByMonthYear,
  createSale,
  updateSale,
  deleteSale,
};
