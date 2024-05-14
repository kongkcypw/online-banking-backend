const express = require('express');
const router = express.Router();

const controller = require('../controllers/BeneficiaryController');

router.post('/get-beneficiary', controller.get_beneficiary);

module.exports = router;