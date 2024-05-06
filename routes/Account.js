const express = require('express');
const router = express.Router();

const controller = require('../controllers/AccountController');

router.post('/get-info', controller.get_account_info);

module.exports = router;