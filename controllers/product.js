const Product = require('../models/product');

const fs = require('fs');
const slugify = require('slugify');

exports.createOneProduct = async (req, res, next) => {
    const { name, description, price, quantity, shipping, category } = req.fields;
    const { photo } = req.files;

    // Validations
    switch (true) {
        case !name.trim():
            res.json({error: "Name is required"})
            break;
        case !description.trim():
            res.json({error: "Description is required"})
            break;
        case !price.trim():
            res.json({error: "Price is required"})
            break;
        case !quantity.trim():
            res.json({error: "Quantity is required"})
            break;
        case !category.trim():
            res.json({error: "Category is required"})
            break;
        case !shipping.trim():
            res.json({error: "Shipping is required"})
            break;
        case photo && photo.size > 1000000:
            res.json({error: "Image should be less than 1MB in size"})
            break;
        default:
            break;
    }
    // Create a product
    const product = new Product({...req.fields, slug: slugify(name)});

    if(photo) {
        product.photo.data = fs.readFileSync(photo.path);
        product.photo.contentType = photo.type;
    }
   await product.save().then(
        product => res.status(201).json(product)
    )
}

exports.updateOneProduct = async (req, res, next) => {

    const { name, description, price, quantity, shipping, category } = req.fields;
    const { photo } = req.files;

    // Validations
    switch (true) {
        case !name.trim():
            res.json({error: "Name is required"})
            break;
        case !description.trim():
            res.json({error: "Description is required"})
            break;
        case !price.trim():
            res.json({error: "Price is required"})
            break;
        case !quantity.trim():
            res.json({error: "Quantity is required"})
            break;
        case !category.trim():
            res.json({error: "Category is required"})
            break;
        case !shipping.trim():
            res.json({error: "Shipping is required"})
            break;
        case photo && photo.size > 1000000:
            res.json({error: "Image should be less than 1MB in size"})
            break;
        default:
            break;
    }
    // Update the product
    const product = await Product.findByIdAndUpdate(req.params.id, {...req.fields, slug: slugify(name)}, {new: true});

    if(photo) {
        product.photo.data = fs.readFileSync(photo.path);
        product.photo.contentType = photo.type;
    }
   await product.save().then(
        product => res.status(201).json(product)
    )
}

exports.deleteOneProduct = (req, res, next) => {
    Product.findByIdAndDelete(req.params.id)
        .select("-photo")
        .then(
        (product) => res.status(200).send(`Product ${product.name} has been deleted successfully`)
    ).catch(
        error => res.status(401).json({error: error})
    )
}

exports.getOneProduct = (req, res, next) => {
    Product.findOne({slug: req.params.slug})
        .select("-photo")
        .populate("category")
        .then(
            product => res.status(200).json(product)
        ).catch(
        error => res.status(400).json({error: error})
        )
}

exports.getAllProducts =  (req, res, next) => {
    Product.find()
    .select("-photo")
    .populate("category")
    .limit(10)
    .sort({ createdAt: -1 })
    .then(
        products => res.status(200).json(products)
    ).catch(
        error => res.status(400).json({error})
    )
}

exports.getProductPhoto = async (req, res, next) => {
   await Product.findById(req.params.id).select("photo").then(
   product => {
    if(product.photo.data) {
        res.set("Content-Type", product.photo.contentType)
        return res.send(product.photo.data)
   }
   } 
   ).catch(
    error => res.status(400).json({error: error})
   )
   
}