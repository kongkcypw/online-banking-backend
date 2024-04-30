const express = require('express');
const router = express.Router();

const controller = require('../controllers/StatementController');

router.post('/get-by-account', controller.get_statement_by_account);

module.exports = router;