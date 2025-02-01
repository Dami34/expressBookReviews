const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { 
  return users.some(user => user.username === username); // Returns true if username exists
};

const authenticatedUser = (username, password) => { 
  const user = users.find(user => user.username === username); 
  return user && user.password === password; // Returns true if username and password match
};

// only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body; // Extract username and password from request body

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!isValid(username)) {
    return res.status(404).json({ message: "Username not found" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(403).json({ message: "Invalid password" });
  }

  // If authentication is successful, generate a JWT
  const token = jwt.sign({ username }, 'your_jwt_secret_key', { expiresIn: '1h' });

  // Save the token in the session or send it back in the response
  return res.status(200).json({
    message: "Login successful",
    token: token
  });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  // Write your code here to add the review
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
