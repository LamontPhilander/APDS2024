import express from 'express';
import db from '../db/conn.mjs';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ExpressBrute from 'express-brute';

const router = express.Router();

var store = new ExpressBrute.MemoryStore();
var bruteforce = new ExpressBrute(store);

// Utility function for RegEx validation
const validateInput = (input, pattern) => pattern.test(input);

// Signup
router.post("/signup", async (req, res) => {
  const namePattern = /^[a-zA-Z0-9]{3,30}$/;
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  if (!validateInput(req.body.name, namePattern)) {
    return res.status(400).json({ message: "Invalid name format" });
  }
  if (!validateInput(req.body.password, passwordPattern)) {
    return res.status(400).json({ message: "Password must be at least 8 characters, contain letters and numbers" });
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    let newDocument = {
      name: req.body.name,
      password: hashedPassword,
    };
    let collection = await db.collection("users");
    let result = await collection.insertOne(newDocument);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error during signup", error });
  }
});

// login
router.post('/login', bruteforce.prevent, async (req, res) => {
    const { name, password } = req.body;
    console.log(name, " ", password)

    try {
        const collection = await db.collection('users');
        const user = await collection.findOne({ name });

        if (!user) {
            return res.status(401).json('Authentication failed');
        }

        // compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json('Authentication failed');
        }
        else{
            // Authentication successful
            const token = jwt.sign({ username: req.body.username, password: req.body.password }, "this_secret_should_be_longer_than_it_is", { expiresIn: "1h" })
            res.status(200).json({ message: "Authentication Successful", token: token, name: req.body.name });
            console.log("your new token is: ", token)
            }
        } catch (error) {
            console.error("Login error: ", error);
            res.status(500).json({ message: "Login failed" });
        }
    });

export default router