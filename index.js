// index.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Joi = require("joi");
const Product = require("./models/Products");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Validation schema for products
const productValidationSchema = Joi.object({
  id: Joi.string().required(),
  sku: Joi.string().required(),
  name: Joi.string().required(),
  price: Joi.number().positive().required(),
  discount: Joi.number().min(0).max(100).default(0),
  new: Joi.boolean().default(false),
  rating: Joi.number().min(0).max(5).optional(),
  saleCount: Joi.number().integer().min(0).optional(),
  category: Joi.array().items(Joi.string()).min(1).required(),
  tag: Joi.array().items(Joi.string()).optional(),
  stock: Joi.number().integer().min(0).required(),
  image: Joi.array().items(Joi.string().uri()).min(1).required(),
  shortDescription: Joi.string().max(255).optional(),
  fullDescription: Joi.string().optional(),
});

// Routes

// Get product by ID
app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// Get all products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Search products
app.get("/api/products/search", async (req, res) => {
  const { q } = req.query;
  try {
    const products = await Product.find({
      name: { $regex: q, $options: "i" },
    });
    res.json(products);
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ error: "Failed to search products" });
  }
});

// Add a new product
app.post("/api/products", async (req, res) => {
  const { error, value } = productValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const newProduct = new Product(value);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Failed to add product" });
  }
});

// MongoDB Connection
mongoose
  .connect(process.env.DB, {})
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
