const express = require('express');
const router = express.Router();

const controller = require('../controllers/BillController');

router.post('/get-payment-require', controller.get_payment_require);

module.exports = router;