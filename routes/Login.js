const express = require('express');
const router = express.Router();

const controller = require('../controllers/LoginController');

router.post('/post', controller.login_post);

module.exports = router;