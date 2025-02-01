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
    const { review } = req.query; // Review text passed as a query parameter
    const { username } = req.body; // Username is expected to be in the body
  
    // Ensure review and username are provided
    if (!review || !username) {
      return res.status(400).json({ message: "Review text and username are required" });
    }
  
    // Find the book based on ISBN
    const book = books.find(b => b.isbn === req.params.isbn);
  
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // Check if the user already has a review for this ISBN
    const existingReview = book.reviews.find(r => r.username === username);
  
    if (existingReview) {
      // If a review already exists, update it
      existingReview.review = review;
      return res.status(200).json({ message: "Review updated successfully" });
    } else {
      // If it's a new review, add it to the reviews array
      book.reviews.push({ username, review });
      return res.status(200).json({ message: "Review added successfully" });
    }
  });

  // Delete a book review by ISBN
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { username } = req.body; // Username is expected to be in the body (can be retrieved from session)
    
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }
  
    // Find the book by ISBN
    const book = books.find(b => b.isbn === req.params.isbn);
  
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // Check if the review for the current ISBN exists for this username
    const reviewIndex = book.reviews.findIndex(r => r.username === username);
  
    if (reviewIndex === -1) {
      return res.status(404).json({ message: "Review not found for this user" });
    }
  
    // Delete the review if found
    book.reviews.splice(reviewIndex, 1);
  
    return res.status(200).json({ message: "Review deleted successfully" });
  });
  
  module.exports.authenticated = regd_users;

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
