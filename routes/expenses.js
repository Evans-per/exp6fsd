const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

// Utility to convert React frontend format -> MongoDB Schema format
const formatToSchema = (body) => {
    // If the frontend sends type="expense", store amount as negative so we know what it is logically using only 3 fields!
    // Front-end might send "description" instead of "category"
    let finalAmount = Number(body.amount);
    if (body.type === 'expense' && finalAmount > 0) {
        finalAmount = -Math.abs(finalAmount);
    } else if (body.type === 'income' && finalAmount < 0) {
        finalAmount = Math.abs(finalAmount);
    }
    
    return {
        amount: finalAmount,
        category: body.category || body.description || 'Unknown', 
        date: body.date ? new Date(body.date) : new Date()
    };
};

// Utility to convert MongoDB Schema format -> React frontend format
const formatToFrontend = (doc) => {
    const isExpense = doc.amount < 0;
    return {
        _id: doc._id,
        id: doc._id, // React uses id
        amount: Math.abs(doc.amount), // React UI expects positive amounts combined with 'type'
        type: isExpense ? 'expense' : 'income',
        description: doc.category, // React uses description for the text
        category: doc.category,
        date: doc.date
    };
};

// @route   POST /api/expenses
// @desc    Add a new expense
router.post('/', async (req, res) => {
    try {
        const schemaData = formatToSchema(req.body);

        // Validation mapping strictly to 3 fields based on practical
        if (schemaData.amount === undefined || !schemaData.category) {
            return res.status(400).json({ error: 'Amount and category must not be empty' });
        }

        const newExpense = new Expense(schemaData);
        const savedExpense = await newExpense.save();
        
        console.log('✅ SUPER SUCCESS! Inserted into Database:', savedExpense);

        res.status(201).json(formatToFrontend(savedExpense));
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});

// @route   GET /api/expenses
// @desc    Get all expenses sorted by latest date
router.get('/', async (req, res) => {
    try {
        const expenses = await Expense.find().sort({ date: -1 });

        // Format sending back to react so UI doesn't break
        const formattedExpenses = expenses.map(formatToFrontend);

        res.status(200).json({ 
            count: formattedExpenses.length,
            expenses: formattedExpenses 
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});

// @route   PUT /api/expenses/:id
// @desc    Update an expense
router.put('/:id', async (req, res) => {
    try {
        const schemaData = formatToSchema(req.body);
        const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, schemaData, { new: true });
        
        if (!updatedExpense) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        res.status(200).json(formatToFrontend(updatedExpense));
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});

// @route   DELETE /api/expenses/:id
// @desc    Delete an expense
router.delete('/:id', async (req, res) => {
    try {
        const deletedExpense = await Expense.findByIdAndDelete(req.params.id);

        if (!deletedExpense) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        res.status(200).json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});

module.exports = router;
