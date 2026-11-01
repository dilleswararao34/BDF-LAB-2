const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");
const fs = require("fs");

const dbPath = process.env.DB_PATH || path.join(__dirname, "bookStore.db");

const initializeDatabase = async () => {
  try {
    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    console.log(`Connected to SQLite database at: ${dbPath}`);

    // Create table 'book'
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS book (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        price INTEGER NOT NULL,
        pages INTEGER NOT NULL
      );
    `;
    await db.run(createTableQuery);
    console.log("Table 'book' verified/created.");

    // Check existing count
    const countResult = await db.get("SELECT COUNT(*) AS count FROM book;");
    if (countResult.count === 0) {
      console.log("Inserting 10 sample book records...");
      const insertBooksQuery = `
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
      await db.run(insertBooksQuery);
      console.log("10 sample records inserted successfully.");
    } else {
      console.log(`Database already contains ${countResult.count} records.`);
    }

    await db.close();
    console.log("Database initialization completed successfully.");
  } catch (error) {
    console.error("Database initialization failed:", error.message);
    process.exit(1);
  }
};

initializeDatabase();
