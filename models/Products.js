const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    new: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    saleCount: {
      type: Number,
      default: 0,
    },
    category: [
      {
        type: String,
        required: true,
      },
    ],
    tag: [
      {
        type: String,
      },
    ],
    stock: {
      type: Number,
      required: true,
    },
    image: [
      {
        type: String,
        validate: {
          validator: function (v) {
            return /^https?:\/\/.+\.(jpg|jpeg|png|webp)$/.test(v);
          },
          message: (props) => `${props.value} is not a valid URL for an image`,
        },
      },
    ],
    shortDescription: {
      type: String,
      maxlength: 300,
    },
    fullDescription: {
      type: String,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
