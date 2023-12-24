const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = 3000;

const pool = new Pool({
    user: 'andrij',
    host: 'localhost',
    database: 'Web-database',
    password: 'passwd',
    port: 5432,
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
    console.log("Helo");
});

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const client = await pool.connect();
    const select = `SELECT * FROM users Where email = $1`
    const insert = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)';
    try {
        let results = await client.query(select, [email]);
        if(results.rows.length > 0) {
            res.status(400).json({ error: "Email already registered"});
        } else {

        await client.query(insert, [username, email, password]);
        
        console.log("Registration successful! User inserted into PostgreSQL.");
        
        client.release();
        res.status(200).json({ message: 'Registration successful!' });
        }
    } catch (error) {
        console.error("Error inserting data into PostgreSQL:", error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});