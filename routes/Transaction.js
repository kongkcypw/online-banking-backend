const express = require('express');
const router = express.Router();

const controller = require('../controllers/transactions/TransactionController');
const svpController = require('../controllers/role_supervisor/TransactionController');

// User
router.post('/insert', controller.insert);
router.post('/insert-withdraw', controller.insert_withdraw);

// Supervisor
router.post('/spv/get-current-date', svpController.get_current_date);
router.post('/spv/get-destination-detail', svpController.get_destination_detail);

module.exports = router;