const express = require('express');
const router = express.Router();

const controller = require('../controllers/AccountController');

router.post('/create-new', controller.create_new_account);

module.exports = router;