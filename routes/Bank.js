const express = require('express');
const router = express.Router();

const controller = require('../controllers/BankController');

router.get('/get-all', controller.get_all);

module.exports = router;