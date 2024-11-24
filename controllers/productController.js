var mongoose = require("mongoose");
var productModel = require("../models/product");
var path = require("path");

module.exports = {
  //  controller  to create new product
  addProduct: async function (req, res) {
    const { pId, pName, pDescription, pCategory, pStock, pPrice, pImage } =
      req.body;
    const newProduct = new ProductModel({
      pId,
      pName,
      pDescription,
      pCategory,
      pStock,
      pPrice,
      pImage,
    });
    await newProduct.save();
    console.log("Product added successfully!");
  },
};
