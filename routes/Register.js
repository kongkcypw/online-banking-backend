const express = require('express');
const router = express.Router();

const controller = require('../controllers/RegisterController');

router.get('/get', controller.register_get);
router.post('/post', controller.register_post);

module.exports = router;