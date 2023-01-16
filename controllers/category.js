const category = require('../models/category');
const Category = require('../models/category');


exports.createOneCategory = (req, res, next) => {
    const category = new Category({
        name: req.body.name,
        slug: req.body.slug
    })
    category.save().then(
        () => res.status(201).send(`Category ${category.name} created successfully`)
    ).catch(
        error => res.status(401).json({ error: error })
    )
}

exports.updateOneCategory = (req, res, next) => {
    const category = new Category({
        _id: req.body._id,
        name: req.body.name,
        slug: req.body.slug
    })

    Category.updateOne({ _id: req.body._id }, category).then(
        category => res.status(201).json({ message: "Update done successfully" })
    ).catch(
        error => res.status(400).json({ error: error })
    )
}

exports.getOneCategory = (req, res, next) => {
    Category.findOne({ slug: req.params.slug }).then(
        category => res.status(200).json(category)
    ).catch(
        error => res.status(400).json({ error: error })
    )
}

exports.deleteOneCategory = (req, res, next) => {
    Category.deleteOne({ _id: req.body._id }).then(
        (category) => res.status(200).send(`Category ${category.name} deleted successfully`)
    ).catch(
        error => res.status(400).json({ error: error })
    )

}

exports.getAllCaterories = (req, res, next) => {
    Category.find().then(
        categories => res.status(200).json(categories)
    ).catch(
        error => res.status(400).json({ error: error })
    )
}