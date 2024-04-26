const jwt = require('jsonwebtoken')
require('dotenv').config();

const verifyToken = (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token']

    if (!token) {
        return res.status(201).json({ status: 201, message: "A token is required for authentications" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_TOKEN_KEY)
        req.user = decoded;
    } catch (error) {
        return res.status(202).json({ status: 202, message: "Invalid token" });
    }

    return next();
}

module.exports = verifyToken;