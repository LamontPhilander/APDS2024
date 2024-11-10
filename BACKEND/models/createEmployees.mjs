import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import Staff from './Staff.mjs';  // Adjust the path to your Staff model

dotenv.config();

// MongoDB connection
const connectionString = process.env.ATLAS_URI || "mongodb+srv://lamont_llp:KMqGYY1eHB1PmEgW@cluster0.eaymm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbName = process.env.DB_NAME || "users"; // Use environment variable for DB name

await mongoose.connect(connectionString, { dbName });

// Define staff creation function
const createStaff = async () => {
  try {
    // Define staff details
    const staffMembers = [
      {
        username: "staff1",
        password: "password123", // This will be hashed
      },
      {
        username: "staff2",
        password: "password456", // This will be hashed
      }
    ];

    // Hash passwords and create staff records
    for (let staff of staffMembers) {
      const hashedPassword = await bcrypt.hash(staff.password, 10);
      await Staff.create({
        username: staff.username,
        password: hashedPassword,
        role: staff.role
      });
      console.log(`Staff member created: ${staff.username}`);
    }

    console.log("Staff members successfully created.");
  } catch (error) {
    console.error("Error creating staff members:", error);
  } finally {
    mongoose.connection.close(); // Close connection after operation
  }
};

// Run the staff creation function
createStaff();
