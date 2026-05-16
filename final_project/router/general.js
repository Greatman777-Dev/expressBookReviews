const express = require('express');
let books = require('./booksdb.js');
let { isValid, users } = require('./auth_users.js');
const public_users = express.Router();
const axios = require('axios');

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (isValid(username)) {
    return res.status(409).json({ message: "User already exists" });
  }
  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered. Now you can login." });
});

// Task 1 - Get all books using Promise
public_users.get('/', function (req, res) {
  new Promise((resolve, reject) => {
    if (books) { resolve(books); }
    else { reject("No books found"); }
  })
  .then((data) => res.status(200).json(data))
  .catch((err) => res.status(500).json({ message: err }));
});

// Task 2 - Get book by ISBN using async/await
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const book = await new Promise((resolve, reject) => {
      if (books[isbn]) { resolve(books[isbn]); }
      else { reject("Book not found"); }
    });
    return res.status(200).json(book);
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

// Task 3 - Get books by author using async/await
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const result = await new Promise((resolve, reject) => {
      const found = Object.entries(books)
        .filter(([, book]) => book.author.toLowerCase() === author.toLowerCase())
        .map(([isbn, book]) => ({ isbn, ...book }));
      if (found.length > 0) { resolve(found); }
      else { reject("No books found for this author"); }
    });
    return res.status(200).json(result);
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

// Task 4 - Get books by title using async/await
public_users.get('/tit
