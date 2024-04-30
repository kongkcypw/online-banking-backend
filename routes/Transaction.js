const express = require('express');
const router = express.Router();

const topupController = require('../controllers/transactions/TopupController');

router.post('/topup', topupController.topup);

module.exports = router;