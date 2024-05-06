const express = require('express');
const router = express.Router();

const controller = require('../controllers/RegisterController');

router.post('/password', controller.register_password);
router.post('/pin', controller.register_pin);
router.post('/account', controller.register_account);
router.post('/confirm', controller.register_confirm);

module.exports = router;