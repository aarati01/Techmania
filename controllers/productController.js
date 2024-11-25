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

      // Store success message in session
      req.session.successMessage = "Product added successfully!";

      // Redirect to the same page to display the success message
      return res.redirect("/addProduct");
    } catch (error) {
      console.error("Error adding product:", error);
      return res.status(500).render("create", {
        errorMessage:
          "There was an error adding the product, please try again.",
      });
    }
  },
};
