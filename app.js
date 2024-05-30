const express = require('express');
const cors = require('cors');

const registerRoute = require('./routes/Register')
const loginRoute = require('./routes/Login')
const authRoute = require('./routes/Auth')
const accountRoute = require('./routes/Account')
const favoriteRoute = require('./routes/Favorite')
const transactionRoute = require('./routes/Transaction')
const statementRoute = require('./routes/Statement')

const billRoute = require('./routes/Bill')
const topupRoute = require('./routes/Topup')
const bankRoute = require('./routes/Bank')
const atmRoute = require('./routes/Atm')
const dashboardRoute = require('./routes/Dashboard')

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

// User
app.use("/register", registerRoute)
app.use("/login", loginRoute)
app.use("/auth", authRoute)
app.use("/account", accountRoute)
app.use("/favorite", favoriteRoute)
app.use("/transaction", transactionRoute)
app.use("/statement", statementRoute)

// Only above employee 
app.use("/topup", topupRoute)
app.use("/bill", billRoute)
app.use("/bank", bankRoute)
app.use("/atm", atmRoute)
app.use("/dashboard", dashboardRoute)

module.exports = app;