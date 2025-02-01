const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  // Returning the list of books as a JSON response
  return res.json(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn; // Retrieve ISBN from request parameters
  
  if (books[isbn]) {
    return res.status(200).json(books[isbn]); // Return book details if found
  } else {
    return res.status(404).json({ message: "Book not found" }); // Handle invalid ISBN
  }
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author; // Retrieve author from request parameters
    let booksByAuthor = [];
  
    // Iterate through the 'books' object and find books matching the author
    Object.keys(books).forEach((isbn) => {
      if (books[isbn].author === author) {
        booksByAuthor.push(books[isbn]);
      }
    });
  
    if (booksByAuthor.length > 0) {
      return res.status(200).json(booksByAuthor); // Return list of books by the author
    } else {
      return res.status(404).json({ message: "No books found by this author" }); // Error if no books match
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
