const jwt = require('jsonwebtoken')

const User = require('../models/user')

exports.requireSignin = (req, res, next) => {

    try {
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        return next();
    } catch (error) {
        return res.status(401).json(error);
    }
    next();
}

exports.isAdmin = async (req, res, next) => {
    const user = await User.findOne({ _id: req.user._id, role: 1 })
    if (user === null) {
        return res.status(401).send("Unauthorized")
    } else {
        console.log("User Info => ", user);
        return next();
    }
};