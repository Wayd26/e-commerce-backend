const category = require('../models/category');
const Category = require('../models/category');
const slugify = require('slugify')
const Product = require('../models/product');



exports.createOneCategory = async (req, res, next) => {
    try {
        const { name } = req.body;
        if (!name.trim()) {
          return res.json({ error: "Name is required" });
        }
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
          return res.json({ error: "Already exists" });
        }
    
        const category = await new Category({ name, slug: slugify(name) }).save();
        res.json(category);
      } catch (err) {
        console.log(err);
        return res.status(400).json(err);
      }
}

exports.updateOneCategory = async (req, res, next) => {
    try {
        const { name } = req.body;
        const { id } = req.params;
        const category = await Category.findByIdAndUpdate(
          id,
          {
            name,
            slug: slugify(name),
          },
          { new: true }
        );
        res.json(category);
      } catch (err) {
        console.log(err);
        return res.status(400).json(err.message);
      }
}

exports.getOneCategory = async (req, res, next) => {
    try {
        const category = await Category.findOne({ slug: req.params.slug });
        res.json(category);
      } catch (err) {
        console.log(err);
        return res.status(400).json(err.message);
      }
}

exports.deleteOneCategory =async (req, res, next) => {
    try {
        const removed = await Category.findByIdAndDelete(req.params.id);
        res.json(removed);
      } catch (err) {
        console.log(err);
        return res.status(400).json(err.message);
      }

}

exports.getAllCaterories = async (req, res, next) => {
    try {
        const all = await Category.find({});
        res.json(all);
      } catch (err) {
        console.log(err);
        return res.status(400).json(err.message);
      }
}

exports.productsByCategory = async (req, res) => {
    try {
      const category = await Category.findOne({ slug: req.params.slug });
      const products = await Product.find({ category }).populate("category");
  
      res.json({
        category,
        products,
      });
    } catch (err) {
      console.log(err);
    }
  };