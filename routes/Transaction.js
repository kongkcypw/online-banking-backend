const express = require('express');
const router = express.Router();

const controller = require('../controllers/transactions/TransactionController');
const svpController = require('../controllers/role_supervisor/TransactionController');
const bmgController = require('../controllers/role_bankmanager/TransactionController');

// User
router.post('/insert', controller.insert);
router.post('/insert-withdraw', controller.insert_withdraw);

// Supervisor
router.post('/spv/get-current-date', svpController.get_current_date);
router.post('/spv/get-destination-detail', svpController.get_destination_detail);

// Bank manager
router.post('/bmg/get-current-date', bmgController.get_all_bank_branches);
router.post('/bmg/get-ranking', bmgController.get_transaction_ranking);
router.post('/bmg/get-overview', bmgController.get_overview_dashboard);

module.exports = router;