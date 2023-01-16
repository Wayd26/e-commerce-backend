const User = require('../models/user')

const jwt = require('jsonwebtoken')

const { hashPassword, comparePassword } = require('../helpers/auth')

exports.getUsers = (req, res, next) => {
    const users = [
        {
            name: "Wassiou",
            email: "wayedoun@gmail.com"
        },
        {
            name: "Aymar D-G",
            email: "dolatoundel@gmail.com"
        }
    ]

    res.status(200).json(users);
}

exports.register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name.trim()) {
            return res.json({ error: "Name is required" })
        }
        if (!email) {
            return res.json({ error: "Email is required" })
        }
        if (!password || password.length < 6) {
            return res.json({ error: "Password must be at least 6 characters long" })
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.json({ error: "Email is taken" })
        }

        const hashedPassword = await hashPassword(password);


        const user = await new User({ name, email, password: hashedPassword });
        user.save();
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
        res.status(201).json({
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                address: user.address
            }, token
        })
    } catch (error) {
        console.log("Error : ", error)
    }
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            return res.json({ error: "Email is required" })
        }
        if (!password || password.length < 6) {
            return res.json({ error: "Password must be at least 6 characters long" })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.json({ error: "User not found" })
        }

        const match = await comparePassword(password, user.password);

        if (!match) {
            return res.jsont({ error: "Wrong Password" })
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
        res.status(201).json({
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                address: user.address
            }, token
        })
    } catch (error) {
        console.log("Error : ", error)
    }
}
exports.secret = async (req, res, next) => {
    return res.json({ currentUser: req.user })
}