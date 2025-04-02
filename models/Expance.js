const mongoose = require("mongoose");

const expanceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    month: { type: String },
    year: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'ExpanceCategory', required: true },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true }
});

module.exports = mongoose.model('Expance', expanceSchema);
