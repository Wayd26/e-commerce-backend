const express = require('express')

const router = express.Router()

const { secret, login, register } = require('../controllers/auth')

const { requireSignin, isAdmin } = require('../middlewares/auth')

router.post('/register', register)

router.post('/login', login)

router.get('/secret', requireSignin, isAdmin, secret)

module.exports = router;