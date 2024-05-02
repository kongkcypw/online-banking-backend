const express = require('express');
const router = express.Router();

const controller = require('../controllers/TopupController');

router.get('/get-all', controller.get_all);

module.exports = router;