const express = require("express");

const app = express();

const dotenv = require("dotenv");

const mongoose = require("mongoose");

const authRoutes = require("./routes/auth")
const categoryRoutes = require("./routes/category")
const productRoutes = require("./routes/product")

const morgan = require('morgan')

dotenv.config();

const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.MONGO_URI).then(
    () => console.log("Database Connected Successfully")
).catch(error => console.log("Failed to connect to Database ", error))

app.use(morgan('dev'));

app.use(express.json())

app.use('/api', authRoutes)
app.use('/api', categoryRoutes)
app.use('/api', productRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`)
})

