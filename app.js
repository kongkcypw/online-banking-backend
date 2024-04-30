const express = require('express');
const cors = require('cors');

const registerRoute = require('./routes/Register')
const loginRoute = require('./routes/Login')
const authRoute = require('./routes/Auth')
const transactionRoute = require('./routes/Transaction')
const statementRoute = require('./routes/Statement')

const app = express();

// Configuration for cors
const corsOptions = {
    origin: "*", // Allow for all domains
    credentials: true,
  };
app.use(cors(corsOptions))

app.use(express.json())

app.get('/', (req, res) => {
    res.json({ message: "hello server" });
})

app.use("/register", registerRoute)
app.use("/login", loginRoute)
app.use("/auth", authRoute)
app.use("/transaction", transactionRoute)
app.use("/statement", statementRoute)

module.exports = app;