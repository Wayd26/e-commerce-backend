const express = require('express')
const router = express.Router();

const { requireSignin, isAdmin } = require('../middlewares/auth')

const { createOneCategory, updateOneCategory, deleteOneCategory, getAllCaterories, getOneCategory } = require('../controllers/category')

router.post('/category', requireSignin, isAdmin, createOneCategory)
router.put('/category/:id', requireSignin, isAdmin, updateOneCategory)
router.delete('/category/:id', requireSignin, isAdmin, deleteOneCategory)
router.get('/category', getAllCaterories)
router.get('/category/:slug', getOneCategory)

module.exports = router;