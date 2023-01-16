const express = require('express');
const formidable = require('express-formidable')
const router = express.Router();

const {requireSignin, isAdmin} = require('../middlewares/auth')

const { createOneProduct, updateOneProduct, deleteOneProduct, getAllProducts, getOneProduct, getProductPhoto } = require('../controllers/product')

router.post('/product', requireSignin, isAdmin, formidable(), createOneProduct)
router.put('/product/:id', requireSignin, isAdmin, formidable(), updateOneProduct)
router.delete('/product/:id', requireSignin, isAdmin, deleteOneProduct)
router.get('/product', getAllProducts)
router.get('/product/:slug', getOneProduct)
router.get('/product/photo/:id', getProductPhoto)

module.exports = router;