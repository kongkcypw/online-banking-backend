const express = require('express');
const { promisePool } = require('./config/mysql');

const PORT = 3000;

const app = express();

app.get('/', (req, res) => {
    res.json({ message: "hello server" });
})

app.get('/sql', async (req, res) => {
    try {
        // Example of querying the database
        const [rows, fields] = await promisePool.query("SELECT * FROM test_connection");
        res.json(rows);
    } catch (error) {
        console.error('Error in MySQL query', error);
        res.status(500).send('Error in server!');
    }
})

app.listen(PORT, () => console.log(`Server is now listening on http://localhost:${PORT}`))