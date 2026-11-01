-- Database: bookStore.db
-- Table: book

CREATE TABLE IF NOT EXISTS book (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  price INTEGER NOT NULL,
  pages INTEGER NOT NULL
);

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
