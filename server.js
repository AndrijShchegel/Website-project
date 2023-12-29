const express = require("express");
const { Pool } = require("pg");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
const port = 3000;

const pool = new Pool({
  user: "andrij",
  host: "localhost",
  database: "Web-database",
  password: "passwd",
  port: 5432,
});

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.get("/", (req, res) => {
  const adminPath = path.join(__dirname, "public", "home.html");
  res.sendFile(adminPath);
});

app.get("/admin", (req, res) => {
  const adminPath = path.join(__dirname, "public", "admin.html");
  res.sendFile(adminPath);
});

app.get("/library", (req, res) => {
  const adminPath = path.join(__dirname, "public", "library.html");
  res.sendFile(adminPath);
});

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const client = await pool.connect();
  const select = "SELECT * FROM users WHERE email = $1";
  const insert = "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)";
  try {
    const results = await client.query(select, [email]);
    if (results.rows.length > 0) {
      res.status(400).json({ error: "Email aalready registered" });
    } else {

      const hashedPassword = await bcrypt.hash(password, 10);

      await client.query(insert, [username, email, hashedPassword]);

      res.status(200).json({ message: "Registration successful!" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const select = "SELECT * FROM users WHERE email = $1";

  let client;

  try {
    client = await pool.connect();

    const results = await client.query(select, [email]);
    if (results.rows.length === 0) {
      res.status(400).json({ error: "Invalid email or password" });
    } else {
      const user = results.rows[0];

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        const token = jwt.sign({ email }, "secret-1998", { expiresIn: "1d" });
        res.status(200).json({ message: "Login successful!", token });
      } else {
        res.status(400).json({ error: "Invalid email or password" });
      }
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (client) { client.release(); }
  }
});

const verifyToken = (authHeader, res) => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing or invalid token format" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "secret-1998");
    return decoded.email; // Return the decoded information
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

app.post("/access", async (req, res) => {
  const authHeader = req.headers.authorization;
  const selectAdmin = "SELECT * FROM admins WHERE email = $1";
  const accessList = [];

  let client;

  try {
    const email = verifyToken(authHeader, res);

    client = await pool.connect();

    const results = await client.query(selectAdmin, [email]);

    if (results.rows.length !== 0) {
      accessList.push("/admin");
    }

    //in future add accout settings access

    res.status(200).json({ accessList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (client) { client.release(); }
  }
});

app.get("/books", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const itemsPerPage = 10;
  const offset = (page - 1) * itemsPerPage;

  const selectBooks = "SELECT * FROM bookInformation ORDER BY id DESC LIMIT $1 OFFSET $2";

  let client;

  try {
    client = await pool.connect();

    const results = await client.query(selectBooks, [itemsPerPage, offset]);
    const books = results.rows;

    const totalCountResults = await client.query("SELECT COUNT(*) FROM bookInformation");
    const totalCount = parseInt(totalCountResults.rows[0].count);

    const totalPages = Math.ceil(totalCount / itemsPerPage);
    res.status(200).json({ books, totalPages, currentPage: page });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (client) { client.release(); }
  }
});

app.post("/create-book", async (req, res) => {
  const { bookName, uniqueName, description, genres } = req.body;
  const select = "SELECT * FROM bookInformation WHERE uniqueName = $1";
  const insert =
  "INSERT INTO bookInformation (name, uniqueName, description, genres) VALUES ($1, $2, $3, $4)";

  let client;

  try {
    client = await pool.connect();

    const results = await client.query(select, [uniqueName]);
    if (results.rows.length > 0) {
      res.status(400).json({ error: "Book with this uniqe name was already created" });
    } else {
      await client.query(insert, [bookName, uniqueName, description, genres]);

      res.status(200).json({ message: "Creation successful!" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (client) { client.release(); }
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
