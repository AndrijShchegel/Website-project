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
});

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const client = await pool.connect();
    const select = `SELECT * FROM users WHERE email = $1`
    const insert = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)';
    try {
        let results = await client.query(select, [email]);
        if(results.rows.length > 0) {
            res.status(400).json({ error: "Email already registered"});
        } else {

        await client.query(insert, [username, email, password]);
        
        res.status(200).json({ message: 'Registration successful!' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        client.release();
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const client = await pool.connect();
    const select = `SELECT * FROM users WHERE email = $1 AND password = $2`
    try {
        let results = await client.query(select, [email, password]);
        if(results.rows.length === 0) {
            res.status(400).json({ error: 'Invalid email or password'});
        } else {
            res.status(200).json({ message: 'Login successful!' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        client.release();
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});