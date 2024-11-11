import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import Staff from './Staff.mjs';
import Customer from './Customer.mjs';
import Transaction from './Transaction.mjs';

dotenv.config();

// MongoDB connection
const connectionString = process.env.ATLAS_URI || "mongodb+srv://lamont_llp:KMqGYY1eHB1PmEgW@cluster0.eaymm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbName = process.env.DB_NAME || "users"; // Use a test database for testing

await mongoose.connect(connectionString, { dbName });

// Define data population function
const populateTestData = async () => {
  try {
    // Sample Staff Members
    const staffMembers = [
      { username: "staff1", password: "password123" },
      { username: "staff2", password: "password456" }
    ];

    // Sample Customers
    const customers = [
      { fullName: "John Doe", idNumber: "123456789", accountNumber: "ACC1234566", password: "custpassword1" },
      { fullName: "Jane Smith", idNumber: "987654321", accountNumber: "ACC6543211", password: "custpassword2" }
    ];

    // Sample Transactions
    const transactions = [
      { amount: 1500, currency: "USD", senderAccount: "ACC1234566", receiverAccount: "ACC6543211", receiverSWIFTCode:"ABC1234567", status: "Pending" },
      { amount: 3000, currency: "EUR", senderAccount: "ACC6543211", receiverAccount: "ACC1234566", receiverSWIFTCode:"BAC1234567", status: "Completed" }
    ];

    // Clear existing data
    await Staff.deleteMany({});
    await Customer.deleteMany({});
    await Transaction.deleteMany({});

    // Insert staff members
    for (let staff of staffMembers) {
      const hashedPassword = await bcrypt.hash(staff.password, 10);
      await Staff.create({ username: staff.username, password: hashedPassword });
      console.log(`Staff member created: ${staff.username}`);
    }

    // Insert customers
    const customerIds = []; // To store customer IDs for later reference in transactions
    for (let customer of customers) {
      const hashedPassword = await bcrypt.hash(customer.password, 10);
      const newCustomer = await Customer.create({
        fullName: customer.fullName,
        idNumber: customer.idNumber,
        accountNumber: customer.accountNumber,
        password: hashedPassword
      });
      customerIds.push(newCustomer._id); // Save the customer's ID for transaction association
      console.log(`Customer created: ${customer.fullName}`);
    }

    // Insert Transactions and associate with customer
    for (let transaction of transactions) {
      // Find the sender and receiver customers by account number
      const senderCustomer = await Customer.findOne({ accountNumber: transaction.senderAccount });
      const receiverCustomer = await Customer.findOne({ accountNumber: transaction.receiverAccount });

      // Associate the transaction with the corresponding customers
      if (senderCustomer && receiverCustomer) {
        await Transaction.create({
          ...transaction,
          customerId: senderCustomer._id  // Link transaction to sender's customer ID
        });
        console.log(`Transaction created with amount: ${transaction.amount} ${transaction.currency}`);
      } else {
        console.log(`Error: One or more customers not found for transaction with amount ${transaction.amount} ${transaction.currency}`);
      }
    }

    console.log("Test data successfully populated.");
  } catch (error) {
    console.error("Error populating test data:", error);
  } finally {
    mongoose.connection.close(); // Close connection after operation
  }
};

// Run the data population function
populateTestData();
