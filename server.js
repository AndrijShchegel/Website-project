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
  res.sendFile("index.html");
});

app.get("/admin", (req, res) => {
  const adminPath = path.join(__dirname, "public", "admin.html");
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
  const client = await pool.connect();
  const select = "SELECT * FROM users WHERE email = $1";
  try {
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
    client.release();
  }
});

const verifyTokenMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing or invalid token format" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, "secret-1998", (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    req.email = decoded.email;
    next();
  });
};

app.post("/access", verifyTokenMiddleware, async (req, res) => {
  const email = req.email;
  const client = await pool.connect();
  const selectAdmin  = "SELECT * FROM admins WHERE email = $1";
  const accessList = [];
  try {
    const results = await client.query(selectAdmin, [email]);
    if (results.rows.length !== 0) {
      accessList.push("/admin");
    }
    //in future add accout settings access
    res.status(200).json({ accessList });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
});

app.post("/create-book", async (req, res) => {
  const { bookName, uniqueName, description } = req.body;
  const client = await pool.connect();
  const select = "SELECT * FROM bookInformation WHERE uniqueName = $1";
  const insert = "INSERT INTO bookInformation (name, uniqueName, description) VALUES ($1, $2, $3)";
  try {
    const results = await client.query(select, [uniqueName]);
    if (results.rows.length > 0) {
      res.status(400).json({ error: "Book with this uniqe name was already created" });
    } else {
      await client.query(insert, [bookName, uniqueName, description]);

      res.status(200).json({ message: "Creation successful!" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.release();
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
