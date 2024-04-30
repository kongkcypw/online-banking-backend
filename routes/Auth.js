const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.post('/post', auth, (req, res) => {
    res.status(200).json({ status: 200, message: "Auth success" });
});

module.exports = router;