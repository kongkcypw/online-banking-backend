const express = require('express');
const router = express.Router();

const controller = require('../controllers/BillController');

router.get('/get-all', controller.get_all);
router.post('/get-payment-require', controller.get_payment_require);

module.exports = router;