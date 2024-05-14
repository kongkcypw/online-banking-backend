const express = require('express');
const router = express.Router();

const controller = require('../controllers/transactions/TransactionController');

router.post('/insert', controller.insert);
router.post('/insert-withdraw', controller.insert_withdraw);

module.exports = router;