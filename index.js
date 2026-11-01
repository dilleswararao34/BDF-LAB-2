const express = require("express");
const path = require("path");
const fs = require("fs");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Configurable Port and Database Path for local development and cloud deployment
const PORT = process.env.PORT || 3000;
const dbPath = process.env.DB_PATH || path.join(__dirname, "bookStore.db");

let db = null;

// Asynchronous function to initialize the Database and start the Express Server
const initializeDBAndServer = async () => {
  try {
    // Ensure parent directory exists for custom DB paths (e.g. persistent volumes in deployment)
    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    // Open SQLite database connection
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    // Ensure the book table exists
    await db.run(`
      CREATE TABLE IF NOT EXISTS book (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        price INTEGER NOT NULL,
        pages INTEGER NOT NULL
      );
    `);

    // Ensure initial 10 records exist if database is fresh (e.g. on clean deployment volume)
    const countResult = await db.get("SELECT COUNT(*) AS count FROM book;");
    if (countResult && countResult.count === 0) {
      const seedQuery = `
        INSERT INTO book (id, title, author, price, pages)
        VALUES
          (1, 'The Great Gatsby', 'F. Scott Fitzgerald', 450, 180),
          (2, 'To Kill a Mockingbird', 'Harper Lee', 520, 281),
          (3, '1984', 'George Orwell', 399, 328),
          (4, 'Pride and Prejudice', 'Jane Austen', 350, 279),
          (5, 'The Catcher in the Rye', 'J.D. Salinger', 420, 234),
          (6, 'The Hobbit', 'J.R.R. Tolkien', 599, 310),
          (7, 'Crime and Punishment', 'Fyodor Dostoevsky', 650, 671),
          (8, 'The Alchemist', 'Paulo Coelho', 320, 208),
          (9, 'Clean Code', 'Robert C. Martin', 1150, 464),
          (10, 'Atomic Habits', 'James Clear', 699, 320);
      `;
      await db.run(seedQuery);
    }

    // Start server only after database connection succeeds
    app.listen(PORT, () => {
      console.log(`Server Running at http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.error(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

// Root route for health/sanity check
app.get("/", (request, response) => {
  response.status(200).json({
    message: "Welcome to Book Store API - Backend Development Fundamentals Lab 2",
    student: {
      name: "Potnuru Dilleswara Rao",
      registrationNumber: "252U1R1198",
      section: "CSE-2D",
    },
    endpoints: [
      "GET /books/",
      "GET /books/:bookId/",
      "POST /books/",
      "PUT /books/:bookId/",
      "DELETE /books/:bookId/",
    ],
  });
});

// 1. GET /books/ - Return all books
app.get("/books/", async (request, response) => {
  try {
    const getBooksQuery = `
      SELECT * FROM book ORDER BY id;
    `;
    const booksArray = await db.all(getBooksQuery);
    response.status(200).json(booksArray);
  } catch (error) {
    console.error("Error retrieving books:", error.message);
    response.status(500).json({ error: "Internal Server Error" });
  }
});

// 2. GET /books/:bookId/ - Return the book matching the given ID
app.get("/books/:bookId/", async (request, response) => {
  try {
    const { bookId } = request.params;

    // Validate that bookId is a number
    if (isNaN(bookId)) {
      return response.status(400).json({ error: "Invalid Book ID. ID must be an integer." });
    }

    // Parameterized SQL query for security
    const getBookQuery = `
      SELECT * FROM book WHERE id = ?;
    `;
    const book = await db.get(getBookQuery, [bookId]);

    if (!book) {
      return response.status(404).json({ error: "Book Not Found" });
    }

    response.status(200).json(book);
  } catch (error) {
    console.error("Error retrieving book:", error.message);
    response.status(500).json({ error: "Internal Server Error" });
  }
});

// 3. POST /books/ - Accept title, author, price, and pages; insert new book
app.post("/books/", async (request, response) => {
  try {
    const { title, author, price, pages } = request.body;

    // Validate required fields
    if (!title || !author || price === undefined || pages === undefined) {
      return response.status(400).json({
        error: "Missing required fields: title, author, price, and pages are required.",
      });
    }

    // Parameterized SQL query for safe insertion
    const addBookQuery = `
      INSERT INTO book (title, author, price, pages)
      VALUES (?, ?, ?, ?);
    `;

    const dbResponse = await db.run(addBookQuery, [title, author, price, pages]);
    const bookId = dbResponse.lastID;

    response.status(201).json({
      message: "Book Added Successfully",
      bookId: bookId,
    });
  } catch (error) {
    console.error("Error adding book:", error.message);
    response.status(500).json({ error: "Internal Server Error" });
  }
});

// 4. PUT /books/:bookId/ - Update existing book's details
app.put("/books/:bookId/", async (request, response) => {
  try {
    const { bookId } = request.params;

    // Validate that bookId is a number
    if (isNaN(bookId)) {
      return response.status(400).json({ error: "Invalid Book ID. ID must be an integer." });
    }

    // Check if the book exists
    const checkBookQuery = `
      SELECT * FROM book WHERE id = ?;
    `;
    const existingBook = await db.get(checkBookQuery, [bookId]);

    if (!existingBook) {
      return response.status(404).json({ error: "Book Not Found" });
    }

    const { title, author, price, pages } = request.body;

    const updatedTitle = title !== undefined ? title : existingBook.title;
    const updatedAuthor = author !== undefined ? author : existingBook.author;
    const updatedPrice = price !== undefined ? price : existingBook.price;
    const updatedPages = pages !== undefined ? pages : existingBook.pages;

    // Parameterized SQL query for update
    const updateBookQuery = `
      UPDATE book
      SET
        title = ?,
        author = ?,
        price = ?,
        pages = ?
      WHERE id = ?;
    `;

    await db.run(updateBookQuery, [
      updatedTitle,
      updatedAuthor,
      updatedPrice,
      updatedPages,
      bookId,
    ]);

    response.status(200).json({
      message: "Book Details Updated Successfully",
    });
  } catch (error) {
    console.error("Error updating book:", error.message);
    response.status(500).json({ error: "Internal Server Error" });
  }
});

// 5. DELETE /books/:bookId/ - Delete the specified book
app.delete("/books/:bookId/", async (request, response) => {
  try {
    const { bookId } = request.params;

    // Validate that bookId is a number
    if (isNaN(bookId)) {
      return response.status(400).json({ error: "Invalid Book ID. ID must be an integer." });
    }

    // Check if the book exists before attempting deletion
    const checkBookQuery = `
      SELECT * FROM book WHERE id = ?;
    `;
    const existingBook = await db.get(checkBookQuery, [bookId]);

    if (!existingBook) {
      return response.status(404).json({ error: "Book Not Found" });
    }

    // Parameterized SQL query for deletion
    const deleteBookQuery = `
      DELETE FROM book WHERE id = ?;
    `;
    await db.run(deleteBookQuery, [bookId]);

    response.status(200).json({
      message: "Book Deleted Successfully",
    });
  } catch (error) {
    console.error("Error deleting book:", error.message);
    response.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = app;
