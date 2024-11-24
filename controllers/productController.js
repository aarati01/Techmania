var mongoose = require("mongoose");
var productModel = require("../models/product");
var path = require("path");

module.exports = {
  //  controller  to create new product
  addProduct: async function (req, res) {
    const { pId, pName, pDescription, pCategory, pStock, pPrice, pImage } =
      req.body;
    const newProduct = new productModel({
      pId,
      pName,
      pDescription,
      pCategory,
      pStock,
      pPrice,
      pImage,
    });
    try {
      await newProduct.save();
      console.log("Product added successfully!");

      return res.status(200).render("create", {
        successMessage: "Product added successfully!",
        errorMessage: null,
      });
    } catch (error) {
      console.error("Error adding product:", error);
      return res.status(500).render("create", {
        errorMessage:
          "There was an error adding the product, please try again.",
      });
    }
  },
};
