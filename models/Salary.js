const mongoose = require("mongoose");

const salarySchema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
    paidDate: { type: Date, required: true },
    bonus: { type: Number, default: 0 },
    totalAmount: { type: Number, default: function() { return this.amount + this.bonus } },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true }
});

module.exports = mongoose.model('Salary', salarySchema); 
