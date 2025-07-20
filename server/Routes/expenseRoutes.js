const express = require('express');
const router = express.Router();
const {
    getAllExpenses,
    addExpense,
    deleteExpense,
    getExpenseByMonth,
    getExpenseByCategory
} = require('../controllers/expenseController');

router.get('/', getAllExpenses);
router.get('/month', getExpenseByMonth);
router.get('/category', getExpenseByCategory);
router.post('/', addExpense);
router.delete('/:id', deleteExpense);

module.exports = router;
