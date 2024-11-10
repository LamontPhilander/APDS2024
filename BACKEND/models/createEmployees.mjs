import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from "dotenv";
import Employee from './Employee.mjs';  // Adjust the path if needed

dotenv.config();

// MongoDB connection
const connectionString = "mongodb+srv://lamont_llp:KMqGYY1eHB1PmEgW@cluster0.eaymm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbName = process.env.DB_NAME || "users"; // Use environment variable for DB name
await mongoose.connect(connectionString, { dbName });

// Define employee creation function
const createEmployees = async () => {
  try {
    // Define employee details
    const employees = [
      {
        name: "employee1",
        password: "password123", // This will be hashed
        role: "employee"
      },
      {
        name: "employee2",
        password: "password456", // This will be hashed
        role: "employee"
      }
    ];

    // Hash passwords and create employee records
    for (let employee of employees) {
      const hashedPassword = await bcrypt.hash(employee.password, 10);
      await Employee.create({ 
        name: employee.name,
        password: hashedPassword,
        role: employee.role
      });
      console.log(`Employee created: ${employee.name}`);
    }

    console.log("Employees successfully created.");
  } catch (error) {
    console.error("Error creating employees:", error);
  } finally {
    mongoose.connection.close(); // Close connection after operation
  }
};

// Run the employee creation function
createEmployees();
