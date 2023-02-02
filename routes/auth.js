const express = require('express')

const router = express.Router()

const { secret, login, register, updateProfile, getOrders, allOrders } = require('../controllers/auth')

const { requireSignin, isAdmin } = require('../middlewares/auth')

router.post('/register', register)

router.post('/login', login)

router.get('/auth-check', requireSignin, (req, res) => res.json({ok: true}))

router.get('/admin-check', requireSignin, isAdmin, (req, res) => res.json({ok: true}))

router.put("/profile", requireSignin, updateProfile);


// Testing
router.get('/secret', requireSignin, isAdmin, secret)

// orders
router.get("/orders", requireSignin, getOrders);
router.get("/all-orders", requireSignin, isAdmin, allOrders);

module.exports = router;