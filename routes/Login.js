const express = require('express');
const router = express.Router();

const controller = require('../controllers/LoginController');

router.post('/password', controller.login_password);
router.post('/check-role', controller.login_password);
router.post('/pin', controller.login_pin);

module.exports = router;