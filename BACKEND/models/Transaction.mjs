import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define the Transaction schema
const transactionSchema = new Schema({
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    maxlength: 3
  },
  senderAccount: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 20
  },
  receiverAccount: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 20
  },
  receiverSWIFTCode: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 11
  },
  status: {
    type: String,
    enum: ['Pending', 'In-Progress', 'Completed', 'Failed'],
    default: 'Pending'
  },
  customerId: {  // New field to link to the Customer model
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer', // Assuming you have a Customer model
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  verified: { 
    type: Boolean, 
    default: false },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware to automatically update the updatedAt field before saving
transactionSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create the Transaction model
const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
