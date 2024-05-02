const express = require('express');
const router = express.Router();

const topupController = require('../controllers/transactions/TransactionController');

router.post('/insert', topupController.insert);

module.exports = router;