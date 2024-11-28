var mongoose = require("mongoose");
var productModel = require("../models/product");
var path = require("path");

module.exports = {
  deleteProduct: async function (req, res) {
    const { pID } = req.body;

    try {
      const productExists = await productModel.findOne({ pId: pID });

      if (!productExists) {
        console.log("Product Id not found!!!!");
        return res.status(404).render("delete", {
          errorMessage: "Product ID not found!!!!",
          successMessage: null,
        });
      }

      const deletedProduct = await productModel.findOneAndDelete({ pId: pID });

      console.log("Product Deleted Successfully!!!", deletedProduct);

      return res.status(200).render("delete", {
        errorMessage: null,
        successMessage: "Product deleted successfully!",
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      return res.status(500).render("delete", {
        errorMessage: "Server error! Unable to delete product.",
        successMessage: null,
      });
    }
  },
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
  updateProduct: async function (req, res) {
    const { pID, pName, pDescription, pCategory, pStock, pPrice } = req.body;

    try {
      const product = await productModel.findOne({ pId: pID });

      if (!product) {
        console.log("Product not found!");
        return res.status(404).render("update", {
          errorMessage: "Product ID not found!",
          successMessage: null,
        });
      }

      // Update fields only if new values are provided
      if (pName) product.pName = pName;
      if (pDescription) product.pDescription = pDescription;
      if (pCategory) product.pCategory = pCategory;
      if (pStock) product.pStock = parseInt(pStock);
      if (pPrice) product.pPrice = parseFloat(pPrice);

      await product.save();

      console.log("Product updated successfully:", product);
      return res.status(200).render("update", {
        errorMessage: null,
        successMessage: "Product updated successfully!",
      });
    } catch (error) {
      console.error("Error updating product:", error);
      return res.status(500).render("update", {
        errorMessage: "Server error! Unable to update product.",
        successMessage: null,
      });
    }
  },
};
