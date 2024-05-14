const express = require('express');
const router = express.Router();

const controller = require('../controllers/favoriteController');

router.post('/get-favorite', controller.get_favorite);

module.exports = router;