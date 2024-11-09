import Transaction from '../models/Transaction.mjs';
import Employee from '../models/Employee.mjs';

// Function to create a new payment transaction
export const createTransaction = async (req, res) => {
  try {
    // Check if the user has the correct role
    if (req.user.role !== 'employee') {
      return res.status(403).json({ message: 'Access denied. Only employees are authorized to create transactions.' });
    }

    // Create a new transaction with data from the request body
    const newTransaction = new Transaction({
      amount: req.body.amount,
      currency: req.body.currency,
      senderAccount: req.body.senderAccount,
      receiverAccount: req.body.receiverAccount,
      receiverSWIFTCode: req.body.receiverSWIFTCode,
      status: req.body.status || 'Pending',  // Default status to "Pending" if not provided
    });

    // Save the transaction to the database
    const savedTransaction = await newTransaction.save();
    res.status(201).json({ message: 'Transaction created successfully', transaction: savedTransaction });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ message: 'An error occurred while creating the transaction', error });
  }
};

// Function to retrieve all payment transactions
export const getTransactions = async (req, res) => {
  try {
    // Check if the user has the correct role
    if (req.user.role !== 'employee') {
      return res.status(403).json({ message: 'Access denied. Only employees are authorized.' });
    }

    // Fetch all transactions from the database
    const transactions = await Transaction.find();
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error retrieving transactions:', error);
    res.status(500).json({ message: 'An error occurred while fetching transactions' });
  }
};

// Function to retrieve a specific transaction by ID
export const getTransactionById = async (req, res) => {
  try {
    // Check if the user has the correct role
    if (req.user.role !== 'employee') {
      return res.status(403).json({ message: 'Access denied. Only employees are authorized.' });
    }

    // Find the transaction by ID
    const transaction = await Transaction.findById(req.params.id);

    // If the transaction is not found
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.status(200).json(transaction);
  } catch (error) {
    console.error('Error retrieving transaction:', error);
    res.status(500).json({ message: 'An error occurred while fetching the transaction' });
  }
};

// Function to update the status of a payment transaction
export const updateTransactionStatus = async (req, res) => {
  try {
    // Check if the user has the correct role
    if (req.user.role !== 'employee') {
      return res.status(403).json({ message: 'Access denied. Only employees are authorized.' });
    }

    // Find the transaction by ID and update the status
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    // If the transaction is not found
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.status(200).json({ message: 'Transaction status updated successfully', transaction });
  } catch (error) {
    console.error('Error updating transaction status:', error);
    res.status(500).json({ message: 'An error occurred while updating the transaction status' });
  }
};
