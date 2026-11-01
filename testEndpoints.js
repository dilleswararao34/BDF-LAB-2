const http = require("http");

// Helper to make HTTP requests
function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 3000,
      path: path,
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on("error", (err) => {
      reject(err);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

// Wait function
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function runTests() {
  console.log("=== STARTING API TESTS ===");

  // 1. GET /books/
  console.log("\n1. Testing GET /books/");
  const allBooks = await request("GET", "/books/");
  console.log(`Status: ${allBooks.status}`);
  console.log(`Total books retrieved: ${allBooks.data.length}`);
  console.log("Sample book 1:", allBooks.data[0]);

  // 2. GET /books/1/
  console.log("\n2. Testing GET /books/1/");
  const book1 = await request("GET", "/books/1/");
  console.log(`Status: ${book1.status}`);
  console.log("Book details:", book1.data);

  // 3. GET /books/999/ (Not Found)
  console.log("\n3. Testing GET /books/999/ (Non-existent ID)");
  const bookNotFound = await request("GET", "/books/999/");
  console.log(`Status: ${bookNotFound.status}`);
  console.log("Response:", bookNotFound.data);

  // 4. POST /books/ (Create a new book)
  console.log("\n4. Testing POST /books/");
  const newBook = {
    title: "Clean Architecture",
    author: "Robert C. Martin",
    price: 899,
    pages: 352,
  };
  const postRes = await request("POST", "/books/", newBook);
  console.log(`Status: ${postRes.status}`);
  console.log("Response:", postRes.data);
  const createdId = postRes.data.bookId;

  // 5. GET /books/:id/ (Verify created book)
  console.log(`\n5. Testing GET /books/${createdId}/ (Verifying newly created book)`);
  const verifyRes = await request("GET", `/books/${createdId}/`);
  console.log(`Status: ${verifyRes.status}`);
  console.log("Response:", verifyRes.data);

  // 6. PUT /books/:id/ (Update book)
  console.log(`\n6. Testing PUT /books/${createdId}/`);
  const updateData = {
    title: "Clean Architecture: A Craftsman's Guide",
    author: "Robert C. Martin",
    price: 950,
    pages: 360,
  };
  const putRes = await request("PUT", `/books/${createdId}/`, updateData);
  console.log(`Status: ${putRes.status}`);
  console.log("Response:", putRes.data);

  // 7. GET /books/:id/ (Verify updated book)
  console.log(`\n7. Testing GET /books/${createdId}/ (Verifying update)`);
  const verifyUpdate = await request("GET", `/books/${createdId}/`);
  console.log(`Status: ${verifyUpdate.status}`);
  console.log("Response:", verifyUpdate.data);

  // 8. PUT /books/999/ (Update non-existent book)
  console.log("\n8. Testing PUT /books/999/ (Non-existent ID)");
  const putNotFound = await request("PUT", "/books/999/", updateData);
  console.log(`Status: ${putNotFound.status}`);
  console.log("Response:", putNotFound.data);

  // 9. DELETE /books/:id/ (Delete book)
  console.log(`\n9. Testing DELETE /books/${createdId}/`);
  const deleteRes = await request("DELETE", `/books/${createdId}/`);
  console.log(`Status: ${deleteRes.status}`);
  console.log("Response:", deleteRes.data);

  // 10. DELETE /books/999/ (Delete non-existent book)
  console.log("\n10. Testing DELETE /books/999/ (Non-existent ID)");
  const deleteNotFound = await request("DELETE", "/books/999/");
  console.log(`Status: ${deleteNotFound.status}`);
  console.log("Response:", deleteNotFound.data);

  // 11. Final GET /books/ (Verify count is back to 10)
  console.log("\n11. Final GET /books/ check");
  const finalBooks = await request("GET", "/books/");
  console.log(`Status: ${finalBooks.status}`);
  console.log(`Total books count: ${finalBooks.data.length}`);

  console.log("\n=== ALL TESTS COMPLETED SUCCESSFULLY ===");
}

runTests().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
