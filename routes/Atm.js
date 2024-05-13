const express = require('express');
const router = express.Router();

const controller = require('../controllers/AtmController');

router.get('/get-info', controller.get_atm_info);
router.post('/get-balance', controller.get_atm_balnce);

module.exports = router;