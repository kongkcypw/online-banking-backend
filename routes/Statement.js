const express = require('express');
const router = express.Router();

const controller = require('../controllers/StatementController');

router.post('/get-by-account', controller.get_statement_by_account);
router.post('/get-summary', controller.get_summary_statement);

module.exports = router;