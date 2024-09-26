import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const connectionString = process.env.ATLAS_URI || "";

console.log(connectionString);

const client = new MongoClient(connectionString);

let conn;
try {
    conn = await client.connect();
    console.log("MongoDB is CONNECTED!! :)");
} catch (e) {
    console.error("Couldn't connnect to the MongoDB database :( \n\n",e);
}

let db = client.db('users');

export default db;