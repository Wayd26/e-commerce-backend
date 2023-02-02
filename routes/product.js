const express = require('express');
const formidable = require('express-formidable')
const router = express.Router();

const {requireSignin, isAdmin} = require('../middlewares/auth')

const { createOneProduct, updateOneProduct, deleteOneProduct, getAllProducts, getOneProduct, getProductPhoto, filteredProducts, productsSearch, listProducts, productsCount, relatedProducts, processPayment, getToken, orderStatus } = require('../controllers/product')

router.post('/product', requireSignin, isAdmin, formidable(), createOneProduct)
router.put('/product/:id', requireSignin, isAdmin, formidable(), updateOneProduct)
router.delete('/product/:id', requireSignin, isAdmin, deleteOneProduct)
router.get('/product', getAllProducts)
router.get('/product/:slug', getOneProduct)
router.get('/product/photo/:id', getProductPhoto)
router.post("/filtered-products", filteredProducts);
router.get("/products-count", productsCount);
router.get("/list-products/:page", listProducts);
router.get("/products/search/:keyword", productsSearch);
router.get("/related-products/:productId/:categoryId", relatedProducts);
router.get("/braintree/token", getToken);
router.post("/braintree/payment", requireSignin, processPayment);
router.put("/order-status/:orderId", requireSignin, isAdmin, orderStatus);


module.exports = router;