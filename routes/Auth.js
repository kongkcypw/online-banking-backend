const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.post('/post', auth, (req, res) => {
    res.status(200).send("Auth success");
});

module.exports = router;