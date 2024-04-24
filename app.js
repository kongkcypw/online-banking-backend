const express = require('express');

const registerRoute = require('./routes/Register')
const loginRoute = require('./routes/Login')
const authRoute = require('./routes/Auth')

const app = express();

app.use(express.json())

app.get('/', (req, res) => {
    res.json({ message: "hello server" });
})

app.use("/register", registerRoute)
app.use("/login", loginRoute)
app.use("/auth", authRoute)

module.exports = app;