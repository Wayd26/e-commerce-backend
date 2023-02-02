const Product = require('../models/product');
const Order = require('../models/order')
const braintree = require('braintree')
const dotenv = require("dotenv")
const sgMail = require("@sendgrid/mail")



dotenv.config();

const fs = require('fs');
const slugify = require('slugify');


const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
  });
  

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
        (product) => res.status(200).json(product)
    ).catch(
        error => res.status(401).json({error: error})
    )
}

exports.getOneProduct = (req, res) => {
    Product.findOne({slug: req.params.slug})
        .select("-photo")
        .populate("category")
        .then(
            product => res.status(200).json(product)
        ).catch(
        error => res.status(400).json({error: error})
        )
}

exports.getAllProducts =  (req, res) => {
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

exports.getProductPhoto = async (req, res) => {
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


exports.filteredProducts = async (req, res) => {
    try {
      const { checked, radio } = req.body;
  
      let args = {};
      if (checked.length > 0) args.category = checked;
      if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
      console.log("args => ", args);
  
      const products = await Product.find(args);
      console.log("filtered products query => ", products.length);
      res.json(products);
    } catch (err) {
      console.log(err);
    }
  };

  exports.productsCount = async (req, res) => {
    try {
      const total = await Product.find({}).estimatedDocumentCount();
      res.json(total);
    } catch (err) {
      console.log(err);
    }
  };
  
  exports.listProducts = async (req, res) => {
    try {
      const perPage = 6;
      const page = req.params.page ? req.params.page : 1;
  
      const products = await Product.find({})
        .select("-photo")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort({ createdAt: -1 });
  
      res.json(products);
    } catch (err) {
      console.log(err);
    }
  };
  
  exports.productsSearch = async (req, res) => {
    try {
      const { keyword } = req.params;
      const results = await Product.find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      }).select("-photo");
  
      res.json(results);
    } catch (err) {
      console.log(err);
    }
  };

  exports.relatedProducts = async (req, res) => {
    try {
      const { productId, categoryId } = req.params;
      const related = await Product.find({
        category: categoryId,
        _id: { $ne: productId },
      })
        .select("-photo")
        .populate("category")
        .limit(3);
  
      res.json(related);
    } catch (err) {
      console.log(err);
    }
  };


  exports.getToken = async (req, res) => {
    try {
      gateway.clientToken.generate({}, function (err, response) {
        if (err) {
          res.status(500).send(err);
        } else {
          res.send(response);
        }
      });
    } catch (err) {
      console.log(err);
    }
  };
  
  exports.processPayment = async (req, res) => {
    try {
      // console.log(req.body);
      const { nonce, cart } = req.body;
  
      let total = 0;
      cart.map((i) => {
        total += i.price;
      });
      // console.log("total => ", total);
  
      let newTransaction = gateway.transaction.sale(
        {
          amount: total,
          paymentMethodNonce: nonce,
          options: {
            submitForSettlement: true,
          },
        },
        function (error, result) {
          if (result) {
            // res.send(result);
            // create order
            const order = new Order({
              products: cart,
              payment: result,
              buyer: req.user._id,
            }).save();
            // decrement quantity
            // decrementQuantity(cart);
            const bulkOps = cart.map((item) => {
              return {
                updateOne: {
                  filter: { _id: item._id },
                  update: { $inc: { quantity: -0, sold: +1 } },
                },
              };
            });
  
            Product.bulkWrite(bulkOps, {});
  
            res.json({ ok: true });
          } else {
            res.status(500).send(error);
          }
        }
      );
    } catch (err) {
      console.log(err);
    }
  };  
  
  const decrementQuantity = async (cart) => {
    try {
      // build mongodb query
      const bulkOps = cart.map((item) => {
        return {
          updateOne: {
            filter: { _id: item._id },
            update: { $inc: { quantity: -1, sold: +1 } },
          },
        };
      });
  
      const updated = await Product.bulkWrite(bulkOps, {});
      console.log("blk updated", updated);
    } catch (err) {
      console.log(err);
    } 
  };
  
  exports.orderStatus = async (req, res) => {
        try {
          const { orderId } = req.params;
          const { status } = req.body;
          const order = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
          ).populate("buyer", "email name"); 
          // send email
      
          // prepare email
          const emailData = {
            from: process.env.EMAIL_FROM,
            to: order.buyer.email,
            subject: "Order status",
            html: `
              <h1>Hi ${order.buyer.name}, Your order's status is: <span style="color:red;">${order.status}</span></h1>
              <p>Visit <a href="${process.env.CLIENT_URL}/dashboard/user/orders">your dashboard</a> for more details</p>
            `,
          };
      
          try {
            await sgMail.send(emailData);
          } catch (err) {
            console.log(err);
          }
      
          res.json(order);
        } catch (err) {
          console.log(err);
        }
      };