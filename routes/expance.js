const express = require('express');
const router = express.Router();

const { getAllExpenses, getTotalExpenses, getExpanceById, createExpense, updateExpense, deleteExpense } = require('../controllers/expance');

const { authenticateToken, admin } = require('../middlewares/authorization');

router.get('/', authenticateToken, admin, getAllExpenses);
router.get('/expense/:id', authenticateToken, admin, getExpanceById);
router.get('/expense/total-expance', authenticateToken, admin, getTotalExpenses);
router.post("/", authenticateToken, admin, createExpense);
router.put('/update/:id', authenticateToken, admin, updateExpense);
router.delete('/delete/:id', authenticateToken, admin, deleteExpense);

module.exports = router;
