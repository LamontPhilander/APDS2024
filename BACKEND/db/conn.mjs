import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.ATLAS_URI || "";
const dbName = process.env.DB_NAME || "users"; // Use environment variable for DB name

// MongoDB client instance
const client = new MongoClient(connectionString);

// Initialize `db` to null for safer error handling
let db = null;

try {
    // Attempt to connect to the MongoDB server
    await client.connect();
    console.log("MongoDB is CONNECTED!! :)");
    
    // Connect to the specified database
    db = client.db(dbName);
} catch (error) {
    console.error("Couldn't connect to the MongoDB database :( \n\n", error);
    process.exit(1); // Exit the application if the connection fails
}

export default db;
