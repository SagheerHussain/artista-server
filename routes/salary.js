const express = require('express');
const router = express.Router();

const { getAllSalaries, getSalaryById, createSalary, updateSalary, deleteSalary, searchSalariesByEmployee } = require('../controllers/Salary');

const { authenticateToken, admin } = require('../middlewares/authorization');

router.get('/', authenticateToken, admin, getAllSalaries);
router.get('/salary/:id', authenticateToken, admin, getSalaryById);
router.get('/search/:employeeId', authenticateToken, admin, searchSalariesByEmployee);
router.post("/", authenticateToken, admin, createSalary);
router.put('/update/:id', authenticateToken, admin, updateSalary);
router.delete('/delete/:id', authenticateToken, admin, deleteSalary);

module.exports = router;
