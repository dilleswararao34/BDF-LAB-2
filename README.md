# Lab 2 – SQLite Database and CRUD Routes

## Student Details
- **Name:** Potnuru Dilleswara Rao
- **Registration Number:** 252U1R1198
- **Section:** CSE-2D
- **Course:** Backend Development Fundamentals

---

## Live Deployment
- **Deployment URL:** `https://<your-service-name>.onrender.com` *(To be updated after deployment)*
- **Health Check Endpoint:** `https://<your-service-name>.onrender.com/`

---

## Project Overview
This project implements a complete RESTful API for a Book Store management system built using **Node.js**, **Express**, and **SQLite**. It demonstrates core backend engineering fundamentals including:
- Asynchronous database connection handling before starting the HTTP server.
- Safe execution of SQL queries using parameterized placeholders (`?`) to prevent SQL Injection vulnerabilities.
- Complete CRUD (Create, Read, Update, Delete) routes for book management.
- Robust error handling with appropriate HTTP status codes (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`, and `500 Internal Server Error`).
- Production-readiness with environment variable configuration for dynamic port binding and persistent SQLite database storage.

---

## Technologies Used
- **Runtime Environment:** Node.js (v18+)
- **Web Framework:** Express.js (`^5.3.0`)
- **Database Engine:** SQLite3 (`^6.0.1`)
- **Database Wrapper:** `sqlite` (`^5.1.1`) (Promise-based client for async/await)
- **Development Tool:** Nodemon (`^3.1.14`) (Auto-restarts server on file changes)

---

## Environment Variables

The application can be configured locally and in cloud environments using the following environment variables:

| Variable | Description | Default Value | Example (Cloud / Deployment) |
| :--- | :--- | :--- | :--- |
| `PORT` | Port number on which the Express server listens | `3000` | Injected dynamically by hosting providers (e.g., Render, Railway) |
| `DB_PATH` | File path to the SQLite database | `./bookStore.db` (in project directory) | `/var/data/bookStore.db` (persistent disk mount) |

---

## Database and Table Structure

The project uses a SQLite database file named `bookStore.db` containing the `book` table.

### Schema: `book` Table

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INTEGER` | `PRIMARY KEY AUTOINCREMENT` | Unique identifier for each book |
| `title` | `TEXT` | `NOT NULL` | Title of the book |
| `author` | `TEXT` | `NOT NULL` | Author's name |
| `price` | `INTEGER` | `NOT NULL` | Price of the book in INR |
| `pages` | `INTEGER` | `NOT NULL` | Total number of pages |

### How to Initialize the SQLite Database

You can initialize and populate the database using any of the following methods:

#### Method 1: Using the Automated Initialization Script (Recommended)
Run the built-in npm script from the project root:
```bash
npm run init-db
```
This runs `initDb.js`, which automatically connects to `bookStore.db` (or the path set in `DB_PATH`), creates the `book` table if it doesn't already exist, and inserts 10 sample records.

#### Method 2: Using the SQLite CLI
Execute the SQL commands in `setup.sql` via the SQLite CLI:
```bash
sqlite3 bookStore.db < setup.sql
```

#### SQL Commands Reference (`setup.sql`)
```sql
-- 1. Create table 'book'
CREATE TABLE IF NOT EXISTS book (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  price INTEGER NOT NULL,
  pages INTEGER NOT NULL
);

-- 2. Insert 10 realistic sample records
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
```

---

## Installation and Execution Instructions

### Local Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/dilleswararao34/BDF-LAB-2.git
   cd BDF-LAB-2
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Verify / Initialize the database:**
   ```bash
   npm run init-db
   ```

4. **Run the server:**
   - **Production Mode:**
     ```bash
     npm start
     ```
     *(Runs `node index.js`)*
   - **Development Mode (with auto-reload):**
     ```bash
     npm run dev
     ```
     *(Runs `nodemon index.js`)*

   *Server will listen at:* `http://localhost:3000/`

5. **Run the automated API test suite:**
   - Local:
     ```bash
     node testEndpoints.js
     ```
   - Against Deployed URL:
     ```bash
     BASE_URL=https://<your-service-name>.onrender.com node testEndpoints.js
     ```

---

## API Endpoints and Expected Status Codes

| HTTP Method | Route Path | Description | Success Code | Error Codes |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/books/` | Returns an array of all books | `200 OK` | `500 Internal Server Error` |
| `GET` | `/books/:bookId/` | Returns a single book matching the ID | `200 OK` | `400 Bad Request`, `404 Not Found`, `500 Internal Server Error` |
| `POST` | `/books/` | Inserts a new book into the database | `201 Created` | `400 Bad Request`, `500 Internal Server Error` |
| `PUT` | `/books/:bookId/` | Updates an existing book's details | `200 OK` | `400 Bad Request`, `404 Not Found`, `500 Internal Server Error` |
| `DELETE` | `/books/:bookId/` | Deletes a specified book from the database | `200 OK` | `400 Bad Request`, `404 Not Found`, `500 Internal Server Error` |

---

## Example Request and Response Bodies

### 1. `POST /books/`
- **Method:** `POST`
- **URL:** `http://localhost:3000/books/`
- **Header:** `Content-Type: application/json`

**Request Body:**
```json
{
  "title": "Clean Architecture",
  "author": "Robert C. Martin",
  "price": 899,
  "pages": 352
}
```

**Success Response (`201 Created`):**
```json
{
  "message": "Book Added Successfully",
  "bookId": 13
}
```

---

### 2. `PUT /books/:bookId/`
- **Method:** `PUT`
- **URL:** `http://localhost:3000/books/13/`
- **Header:** `Content-Type: application/json`

**Request Body:**
```json
{
  "title": "Clean Architecture: A Craftsman's Guide",
  "author": "Robert C. Martin",
  "price": 950,
  "pages": 360
}
```

**Success Response (`200 OK`):**
```json
{
  "message": "Book Details Updated Successfully"
}
```

---

## SQL Safety & Security

To protect against **SQL Injection** attacks, no user-supplied input is ever concatenated directly into SQL queries. Every route strictly uses parameterized SQL statements with `?` placeholders:

```javascript
// SAFE: Parameterized query prevents SQL Injection
const getBookQuery = `SELECT * FROM book WHERE id = ?;`;
const book = await db.get(getBookQuery, [bookId]);

const addBookQuery = `
  INSERT INTO book (title, author, price, pages)
  VALUES (?, ?, ?, ?);
`;
await db.run(addBookQuery, [title, author, price, pages]);
```

---

## Screenshots

### Part A: Local Testing Screenshots

#### 1. Database View (`bookStore.db`)
![Database View](screenshots/local/database-view.png)

---

#### 2. GET All Books (`GET /books/`)
![GET All Books](screenshots/local/get-all-books.png.png)

---

#### 3. GET Single Book by ID (`GET /books/1/`)
![GET Single Book](screenshots/local/get-book.png.png)

---

#### 4. POST Create Book (`POST /books/`)
![POST Book](screenshots/local/post-book.png.png)

---

#### 5. PUT Update Book (`PUT /books/:bookId/`)
![PUT Book](screenshots/local/put-book.png.png)

---

#### 6. DELETE Book (`DELETE /books/:bookId/`)
![DELETE Book](screenshots/local/delete-book.png.png)

---

#### 7. Non-Existent Book - 404 Not Found (`GET /books/13/` After Deletion)
![404 Not Found](screenshots/local/not-found.png.png)

---

### Part B: Deployed Testing Screenshots
*Note: Postman screenshots against the live deployed URL will be captured and placed into `screenshots/deployed/` once deployment to the hosting platform is complete.*

- `screenshots/deployed/database-view.png` (To be added after deployment)
- `screenshots/deployed/get-all-books.png` (To be added after deployment)
- `screenshots/deployed/get-book.png` (To be added after deployment)
- `screenshots/deployed/post-book.png` (To be added after deployment)
- `screenshots/deployed/put-book.png` (To be added after deployment)
- `screenshots/deployed/delete-book.png` (To be added after deployment)
- `screenshots/deployed/not-found.png` (To be added after deployment)

---

## Problems Faced and Solutions

### 1. Asynchronous Database Connection vs Server Startup Race Condition
- **Problem:** If Express begins listening for incoming HTTP requests before the SQLite database connection (`open()`) finishes resolving, incoming requests fail with a `TypeError: Cannot read properties of null (reading 'all')`.
- **Solution:** Encapsulated connection logic inside an `async initializeDBAndServer()` function. Used `await open(...)` to ensure the database connection succeeds before calling `app.listen(PORT, ...)`.

### 2. SQL Injection Vulnerability in User Input
- **Problem:** Directly concatenating request parameters or body values into SQL strings (e.g. `WHERE id = ${bookId}`) exposes the database to SQL injection attacks and syntax errors from unexpected input.
- **Solution:** Strictly enforced parameterized SQL queries using `?` placeholders across all queries (`db.all()`, `db.get()`, and `db.run()`).

### 3. Handling Non-Existent Records on Update and Delete
- **Problem:** In SQLite, running `UPDATE` or `DELETE` on a non-existent ID does not throw an error; it simply affects 0 rows, which could falsely indicate success.
- **Solution:** Performed an initial `SELECT * FROM book WHERE id = ?;` check before executing update or delete operations. If the record does not exist, an immediate `404 Not Found` response (`{ "error": "Book Not Found" }`) is returned.

### 4. Handling Invalid or Non-Numeric Route Parameters
- **Problem:** If a client passes an invalid non-integer route parameter (such as `/books/abc/`), the query might execute unexpectedly.
- **Solution:** Added parameter validation using `isNaN(bookId)` to immediately reject invalid IDs with `400 Bad Request` (`{ "error": "Invalid Book ID. ID must be an integer." }`).

### 5. Cloud Platform Port and Persistent Storage Configuration
- **Problem:** Hardcoding `port = 3000` causes deployment failure on platforms like Render or Railway, which assign dynamic ports via `process.env.PORT`. Additionally, SQLite default local paths are ephemeral in containers without persistent volume mounts.
- **Solution:** Configured `process.env.PORT || 3000` and `process.env.DB_PATH || path.join(__dirname, "bookStore.db")`, ensuring dynamic port binding and persistent database disk support.
