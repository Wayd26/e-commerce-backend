const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors")
const morgan = require("morgan")
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');

const authRoutes = require("../routes/auth")
const categoryRoutes = require("../routes/category")
const productRoutes = require("../routes/product")


dotenv.config();

const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.MONGO_URI).then(
    () => console.log("Database Connected Successfully")
).catch(error => console.log("Failed to connect to Database ", error))

app.use(morgan('dev'));
app.use(express.json())


const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 
}

app.use(cors(corsOptions))
// CORS
// const whitelist = ['*'];

// app.use(cors({
//   origin: '*'
// }));

  
  // app.use((req, res, next) => {
    // const origin = req.get('referer');
    // const isWhitelisted = whitelist.find((w) => origin && origin.includes(w));
    // if (isWhitelisted) {
      // res.header('Access-Control-Allow-Origin', '*');
      // res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      // res.header('Access-Control-Allow-Headers', 'Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization');
      // res.header('Access-Control-Allow-Credentials', true);
    // }
    // Pass to next layer of middleware
    // if (req.method === 'OPTIONS') res.sendStatus(200);
    // else 
    // next();
  // });
  
  // const setContext = (req, res, next) => {
  //   if (!req.context) req.context = {};
  //   next();
  // };
  // app.use(setContext);

// CORS

// app.options('*', cors())

// app.options('*', cors()) 

app.use('/api', authRoutes)
app.use('/api', categoryRoutes)
app.use('/api', productRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`)

})

 