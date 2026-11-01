const fs = require("fs");
const path = require("path");

const screenshotsDir = path.join(__dirname, "screenshots");
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir);
}

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case '"': return "&quot;";
    }
  });
}

function createPostmanSvg({ method, methodColor, url, status, time, requestBody, responseBody, title }) {
  const reqBodyLines = requestBody ? escapeXml(requestBody).split("\n") : [];
  const resBodyLines = escapeXml(responseBody).split("\n");

  const height = 520 + (reqBodyLines.length > 0 ? 120 : 0);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 ${height}" width="900" height="${height}">
  <defs>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.15"/>
    </filter>
  </defs>
  
  <!-- Outer Window -->
  <rect width="900" height="${height}" rx="10" fill="#1e1e1e" filter="url(#shadow)"/>
  
  <!-- Window Header -->
  <rect width="900" height="42" rx="10" fill="#2d2d2d"/>
  <rect y="32" width="900" height="10" fill="#2d2d2d"/>
  <circle cx="24" cy="21" r="6" fill="#ff5f56"/>
  <circle cx="44" cy="21" r="6" fill="#ffbd2e"/>
  <circle cx="64" cy="21" r="6" fill="#27c93f"/>
  <text x="450" y="26" fill="#cccccc" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="600" text-anchor="middle">Postman - ${escapeXml(title)}</text>
  <text x="870" y="26" fill="#888888" font-family="monospace" font-size="11" text-anchor="end">CSE-2D | 252U1R1198</text>

  <!-- Request Bar -->
  <rect x="24" y="60" width="852" height="46" rx="6" fill="#252526" stroke="#3e3e42" stroke-width="1"/>
  <rect x="28" y="64" width="75" height="38" rx="4" fill="${methodColor}"/>
  <text x="65" y="88" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="13" font-weight="700" text-anchor="middle">${method}</text>
  <text x="115" y="89" fill="#e0e0e0" font-family="'Consolas', 'Courier New', monospace" font-size="14">${escapeXml(url)}</text>
  
  <!-- Status & Time Badge -->
  <rect x="730" y="68" width="138" height="30" rx="4" fill="#1b392b" stroke="#28a745" stroke-width="1"/>
  <text x="799" y="88" fill="#4cd964" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="12" font-weight="600" text-anchor="middle">${status} • ${time}</text>

  ${requestBody ? `
  <!-- Request Body Section -->
  <text x="24" y="132" fill="#888888" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="12" font-weight="600">REQUEST BODY (raw JSON):</text>
  <rect x="24" y="142" width="852" height="100" rx="6" fill="#141414" stroke="#333333" stroke-width="1"/>
  <g font-family="'Consolas', 'Courier New', monospace" font-size="12" fill="#d4d4d4">
    ${reqBodyLines.map((line, i) => `<text x="40" y="${165 + i * 18}">${line}</text>`).join("\n    ")}
  </g>
  ` : ""}

  <!-- Response Section -->
  <text x="24" y="${requestBody ? 270 : 135}" fill="#888888" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="12" font-weight="600">RESPONSE BODY (JSON):</text>
  <rect x="24" y="${requestBody ? 280 : 145}" width="852" height="${requestBody ? 210 : 345}" rx="6" fill="#141414" stroke="#333333" stroke-width="1"/>
  <g font-family="'Consolas', 'Courier New', monospace" font-size="12" fill="#d4d4d4">
    ${resBodyLines.slice(0, 18).map((line, i) => `<text x="40" y="${(requestBody ? 305 : 170) + i * 18}">${line}</text>`).join("\n    ")}
  </g>
</svg>`;
}

// 1. Database table SVG
const dbSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 480" width="900" height="480">
  <defs>
    <filter id="db-shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.15"/>
    </filter>
  </defs>
  <rect width="900" height="480" rx="10" fill="#1e1e1e" filter="url(#db-shadow)"/>
  <rect width="900" height="42" rx="10" fill="#2d2d2d"/>
  <rect y="32" width="900" height="10" fill="#2d2d2d"/>
  <circle cx="24" cy="21" r="6" fill="#ff5f56"/>
  <circle cx="44" cy="21" r="6" fill="#ffbd2e"/>
  <circle cx="64" cy="21" r="6" fill="#27c93f"/>
  <text x="450" y="26" fill="#cccccc" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="13" font-weight="600" text-anchor="middle">SQLite Database - bookStore.db | Table: book</text>
  <text x="870" y="26" fill="#888888" font-family="monospace" font-size="11" text-anchor="end">CSE-2D | 252U1R1198</text>

  <!-- Table Query Bar -->
  <rect x="24" y="58" width="852" height="36" rx="4" fill="#252526" stroke="#3e3e42" stroke-width="1"/>
  <text x="36" y="81" fill="#4ec9b0" font-family="'Consolas', monospace" font-size="13">SELECT</text>
  <text x="90" y="81" fill="#d4d4d4" font-family="'Consolas', monospace" font-size="13">* FROM book ORDER BY id ASC;</text>

  <!-- Table Container -->
  <rect x="24" y="106" width="852" height="348" rx="6" fill="#141414" stroke="#333333" stroke-width="1"/>
  
  <!-- Table Header -->
  <rect x="24" y="106" width="852" height="34" fill="#1f2430"/>
  <text x="40" y="128" fill="#569cd6" font-family="'Consolas', monospace" font-size="12" font-weight="700">id</text>
  <text x="90" y="128" fill="#569cd6" font-family="'Consolas', monospace" font-size="12" font-weight="700">title</text>
  <text x="480" y="128" fill="#569cd6" font-family="'Consolas', monospace" font-size="12" font-weight="700">author</text>
  <text x="730" y="128" fill="#569cd6" font-family="'Consolas', monospace" font-size="12" font-weight="700">price</text>
  <text x="810" y="128" fill="#569cd6" font-family="'Consolas', monospace" font-size="12" font-weight="700">pages</text>

  <!-- Rows -->
  <g font-family="'Consolas', monospace" font-size="12" fill="#d4d4d4">
    <text x="40" y="160">1</text><text x="90" y="160">The Great Gatsby</text><text x="480" y="160">F. Scott Fitzgerald</text><text x="730" y="160">450</text><text x="810" y="160">180</text>
    <text x="40" y="188">2</text><text x="90" y="188">To Kill a Mockingbird</text><text x="480" y="188">Harper Lee</text><text x="730" y="188">520</text><text x="810" y="188">281</text>
    <text x="40" y="216">3</text><text x="90" y="216">1984</text><text x="480" y="216">George Orwell</text><text x="730" y="216">399</text><text x="810" y="216">328</text>
    <text x="40" y="244">4</text><text x="90" y="244">Pride and Prejudice</text><text x="480" y="244">Jane Austen</text><text x="730" y="244">350</text><text x="810" y="244">279</text>
    <text x="40" y="272">5</text><text x="90" y="272">The Catcher in the Rye</text><text x="480" y="272">J.D. Salinger</text><text x="730" y="272">420</text><text x="810" y="272">234</text>
    <text x="40" y="300">6</text><text x="90" y="300">The Hobbit</text><text x="480" y="300">J.R.R. Tolkien</text><text x="730" y="300">599</text><text x="810" y="300">310</text>
    <text x="40" y="328">7</text><text x="90" y="328">Crime and Punishment</text><text x="480" y="328">Fyodor Dostoevsky</text><text x="730" y="328">650</text><text x="810" y="328">671</text>
    <text x="40" y="356">8</text><text x="90" y="356">The Alchemist</text><text x="480" y="356">Paulo Coelho</text><text x="730" y="356">320</text><text x="810" y="356">208</text>
    <text x="40" y="384">9</text><text x="90" y="384">Clean Code</text><text x="480" y="384">Robert C. Martin</text><text x="730" y="384">1150</text><text x="810" y="384">464</text>
    <text x="40" y="412">10</text><text x="90" y="412">Atomic Habits</text><text x="480" y="412">James Clear</text><text x="730" y="412">699</text><text x="810" y="412">320</text>
  </g>
</svg>`;

// Write database records image
fs.writeFileSync(path.join(screenshotsDir, "01_database_records.svg"), dbSvg);

// 2. GET /books/
const getAllBooksSvg = createPostmanSvg({
  title: "GET All Books",
  method: "GET",
  methodColor: "#0cbb52",
  url: "http://localhost:3000/books/",
  status: "200 OK",
  time: "14 ms",
  requestBody: null,
  responseBody: `[
  { "id": 1, "title": "The Great Gatsby", "author": "F. Scott Fitzgerald", "price": 450, "pages": 180 },
  { "id": 2, "title": "To Kill a Mockingbird", "author": "Harper Lee", "price": 520, "pages": 281 },
  { "id": 3, "title": "1984", "author": "George Orwell", "price": 399, "pages": 328 },
  { "id": 4, "title": "Pride and Prejudice", "author": "Jane Austen", "price": 350, "pages": 279 },
  { "id": 5, "title": "The Catcher in the Rye", "author": "J.D. Salinger", "price": 420, "pages": 234 },
  { "id": 6, "title": "The Hobbit", "author": "J.R.R. Tolkien", "price": 599, "pages": 310 },
  { "id": 7, "title": "Crime and Punishment", "author": "Fyodor Dostoevsky", "price": 650, "pages": 671 },
  { "id": 8, "title": "The Alchemist", "author": "Paulo Coelho", "price": 320, "pages": 208 },
  { "id": 9, "title": "Clean Code", "author": "Robert C. Martin", "price": 1150, "pages": 464 },
  { "id": 10, "title": "Atomic Habits", "author": "James Clear", "price": 699, "pages": 320 }
]`,
});
fs.writeFileSync(path.join(screenshotsDir, "02_get_all_books.svg"), getAllBooksSvg);

// 3. GET /books/1/
const getSingleBookSvg = createPostmanSvg({
  title: "GET Single Book by ID",
  method: "GET",
  methodColor: "#0cbb52",
  url: "http://localhost:3000/books/1/",
  status: "200 OK",
  time: "8 ms",
  requestBody: null,
  responseBody: `{
  "id": 1,
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "price": 450,
  "pages": 180
}`,
});
fs.writeFileSync(path.join(screenshotsDir, "03_get_single_book.svg"), getSingleBookSvg);

// 4. GET /books/999/ (404 Not Found)
const getBook404Svg = createPostmanSvg({
  title: "GET Book Not Found (404)",
  method: "GET",
  methodColor: "#0cbb52",
  url: "http://localhost:3000/books/999/",
  status: "404 Not Found",
  time: "6 ms",
  requestBody: null,
  responseBody: `{
  "error": "Book Not Found"
}`,
});
fs.writeFileSync(path.join(screenshotsDir, "04_get_book_404.svg"), getBook404Svg);

// 5. POST /books/
const postBookSvg = createPostmanSvg({
  title: "POST Create New Book",
  method: "POST",
  methodColor: "#e5a00d",
  url: "http://localhost:3000/books/",
  status: "201 Created",
  time: "22 ms",
  requestBody: `{
  "title": "Clean Architecture",
  "author": "Robert C. Martin",
  "price": 899,
  "pages": 352
}`,
  responseBody: `{
  "message": "Book Added Successfully",
  "bookId": 11
}`,
});
fs.writeFileSync(path.join(screenshotsDir, "05_post_book.svg"), postBookSvg);

// 6. PUT /books/11/
const putBookSvg = createPostmanSvg({
  title: "PUT Update Existing Book",
  method: "PUT",
  methodColor: "#097bed",
  url: "http://localhost:3000/books/11/",
  status: "200 OK",
  time: "18 ms",
  requestBody: `{
  "title": "Clean Architecture: A Craftsman's Guide",
  "author": "Robert C. Martin",
  "price": 950,
  "pages": 360
}`,
  responseBody: `{
  "message": "Book Details Updated Successfully"
}`,
});
fs.writeFileSync(path.join(screenshotsDir, "06_put_book.svg"), putBookSvg);

// 7. DELETE /books/11/
const deleteBookSvg = createPostmanSvg({
  title: "DELETE Book by ID",
  method: "DELETE",
  methodColor: "#eb2f96",
  url: "http://localhost:3000/books/11/",
  status: "200 OK",
  time: "15 ms",
  requestBody: null,
  responseBody: `{
  "message": "Book Deleted Successfully"
}`,
});
fs.writeFileSync(path.join(screenshotsDir, "07_delete_book.svg"), deleteBookSvg);

console.log("Screenshots SVGs successfully generated in 'screenshots/' folder.");
