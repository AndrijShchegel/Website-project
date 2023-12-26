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

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const client = await pool.connect();
  const select = "SELECT * FROM users WHERE email = $1";
  const insert = "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)";
  try {
    const results = await client.query(select, [email]);
    if (results.rows.length > 0) {
      res.status(400).json({ error: "Email already registered" });
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

app.post("/verify", (req, res) => {
  const { token } = req.body;
  jwt.verify(token, "secret-1998", (err, decoded) => {
    if (err) {
      res.status(401).json({ error: "Your token had expired. Please re-login." });
    } else {
      res.status(200).json({ email: decoded.email });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
