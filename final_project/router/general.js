const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body; // Retrieve username and password from request body
  
    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    // Check if the username already exists
    if (users[username]) {
      return res.status(409).json({ message: "Username already exists" });
    }
  
    // Register the new user
    users[username] = { password };
    return res.status(201).json({ message: "User registered successfully" });
  });  

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
      // Make an Axios GET request to the server to get the list of books
      const response = await axios.get('https://damisiodumos-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/');
      const books = response.data; // Get the books from the response
      return res.status(200).json(books); // Send the list of books in the response
    } catch (error) {
      // Handle any errors
      return res.status(500).json({ message: 'Error fetching books', error: error.message });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
      const isbn = req.params.isbn;  // Get ISBN from URL parameters
  
      const response = await axios.get(`https://damisiodumos-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/${isbn}`);
      const bookDetails = response.data;  // Assuming the API returns the book details object
  
      // If the book with the given ISBN is not found, handle the error
      if (!bookDetails) {
        return res.status(404).json({ message: "Book not found" });
      }
  
      // Send the book details as a response
      return res.status(200).json(bookDetails);
    } catch (error) {
      console.error("Error fetching book details:", error);
      return res.status(500).json({ message: "Error fetching book details" });
    }
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    try {
      const author = req.params.author;  // Get author from URL parameters
  
      const response = await axios.get(`https://damisiodumos-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/${author}`);
      const booksByAuthor = response.data;  // Assuming the API returns an array of books by the author
  
      // If no books by the given author are found, handle the error
      if (booksByAuthor.length === 0) {
        return res.status(404).json({ message: "No books found by this author" });
      }
  
      // Send the books by the author as a response
      return res.status(200).json(booksByAuthor);
    } catch (error) {
      console.error("Error fetching books by author:", error);
      return res.status(500).json({ message: "Error fetching books by author" });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title; // Retrieve title from request parameters
    let booksByTitle = [];
  
    // Iterate through the 'books' object and find books matching the title
    Object.keys(books).forEach((isbn) => {
      if (books[isbn].title.toLowerCase() === title.toLowerCase()) {
        booksByTitle.push(books[isbn]);
      }
    });
  
    if (booksByTitle.length > 0) {
      return res.status(200).json(booksByTitle); // Return list of books with the given title
    } else {
      return res.status(404).json({ message: "No books found with this title" }); // Error if no books match
    }
});  

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn; // Retrieve ISBN from request parameters
  
    if (books[isbn]) {
      return res.status(200).json({ reviews: books[isbn].review }); // Return the book's reviews
    } else {
      return res.status(404).json({ message: "Book not found" }); // Error if ISBN does not exist
    }
});  

module.exports.general = public_users;
