const express = require("express");

const { authenticateToken, admin } = require("../middlewares/authorization");

const {
  getSales,
  getRevenue,
  getTotalReceivedAmount,
  getUniqueClients,
  getPendingAmount,
  getSaleById,
  getSalesByEmployeeId,
  getEmployeeCurrentSalesAmount,
  // getEmployeeSalesByMonthYear,
  getSalesByMonthYear,
  getRevenueByEmployee,
  getRecieveAmountByEmployee,
  getPendingAmountByEmployee,
  getClientsByEmployee,
  createSale,
  updateSale,
  deleteSale,
  getFilteredSalesByEmployee,
} = require("../controllers/sale");

const router = express.Router();

router.get("/", authenticateToken,  getSales);
router.get("/revenue", authenticateToken,  getRevenue);
router.get("/total-received-amount", authenticateToken,  getTotalReceivedAmount);
router.get("/pending-amount", authenticateToken,  getPendingAmount);
router.get("/unique-clients", authenticateToken,  getUniqueClients);
router.get("/sale/:id", authenticateToken,  getSaleById);
router.get("/employee/:employeeId", authenticateToken, getSalesByEmployeeId);
router.get("/employee/revenue/:employeeId", authenticateToken, getRevenueByEmployee);
router.get("/employee/total-received-amount/:employeeId", authenticateToken, getRecieveAmountByEmployee);
router.get("/employee/pending-amount/:employeeId", authenticateToken, getPendingAmountByEmployee);
router.get("/employee/unique-clients/:employeeId", authenticateToken, getClientsByEmployee);
router.get("/employee/current-sales-amount/:employeeId", authenticateToken, getEmployeeCurrentSalesAmount);
// router.get("/employee/past-sales/:employeeId/:month/:year", authenticateToken, getEmployeeSalesByMonthYear);
router.get("/employee/filter-sales/:employeeId", authenticateToken, getFilteredSalesByEmployee);
router.get("/past-sales", authenticateToken,  getSalesByMonthYear);
router.post("/", authenticateToken, createSale);
router.put("/update/:id", authenticateToken, updateSale);
router.delete("/delete/:id", authenticateToken,  deleteSale);

module.exports = router;
