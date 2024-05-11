const http = require("http");
const url = require("url");

// Database variable
let db = [];

// Function to generate unique ID
function generateId() {
  return Math.floor(Math.random() * 1000);
}

// Create HTTP server
const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url, true);
  const { pathname } = reqUrl;

  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  // Handle GET request
  if (req.method === "GET" && pathname === "/") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(db));
  }
  // Handle POST request
  else if (req.method === "POST" && pathname === "/") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const jokeData = JSON.parse(body);
      const newJoke = {
        id: generateId(),
        title: jokeData.title,
        comedian: jokeData.comedian,
        year: jokeData.year,
      };
      db.push(newJoke);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(db));
    });
  }
  // Handle PATCH request
  else if (req.method === "PATCH" && pathname.startsWith("/joke/")) {
    const id = parseInt(pathname.split("/").pop());
    const jokeIndex = db.findIndex((joke) => joke.id === id);
    if (jokeIndex !== -1) {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        const jokeData = JSON.parse(body);
        db[jokeIndex] = { ...db[jokeIndex], ...jokeData };
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(db[jokeIndex]));
      });
    } else {
      res.writeHead(404);
      res.end("Joke not found");
    }
  }
  // Handle DELETE request
  else if (req.method === "DELETE" && pathname.startsWith("/joke/")) {
    const id = parseInt(pathname.split("/").pop());
    const jokeIndex = db.findIndex((joke) => joke.id === id);
    if (jokeIndex !== -1) {
      const deletedJoke = db.splice(jokeIndex, 1)[0];
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(deletedJoke));
    } else {
      res.writeHead(404);
      res.end("Joke not found");
    }
  }
  // Handle invalid routes
  else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

// Start server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
