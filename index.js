const express = require('express');
require('dotenv').config();

const registerRoute = require('./routes/Register')

const PORT = process.env.LOCAL_PORT;
const app = express();

app.get('/', (req, res) => {
    res.json({ message: "hello server" });
})

app.use("/register", registerRoute)

app.listen(PORT, () => console.log(`Server is now listening on http://localhost:${PORT}`))