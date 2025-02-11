var mongoose = require("mongoose");
var productModel = require("../models/product");
var path = require("path");
const product = require("../models/product");

module.exports = {

  // Controller logic to delete a Product
  deleteProduct: async function (req, res) {
    const { pID } = req.body;

    try {
      const productExists = await productModel.findOne({ pId: pID });

      if (!productExists) {
        console.log("Product Id not found!!!!");
        return res.status(404).render("delete", {
          errorMessage: "Product ID not found!!!!",
          successMessage: null,
          product: null,
        });
      }

      const deletedProduct = await productModel.findOneAndDelete({ pId: pID });

      console.log("Product Deleted Successfully!!!", deletedProduct);

      return res.status(200).render("delete", {
        errorMessage: null,
        successMessage: "Product deleted successfully!",
        product:null,
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      return res.status(500).render("delete", {
        errorMessage: "Server error! Unable to delete product.",
        successMessage: null,
        product: null,
      });
    }
  },

  //Delete by Id

  deleteById: async (req, res) => {

    const productId = req.params.id;

    try {
      const productData = await productModel.findOne({ pId: productId });

      console.log(productData);
      if (!productData) {
        return res.render("delete", {
          errorMessage: "Product not found.",
          successMessage: null,
          product: null,
        });
      }
      else{
        res.render("delete", {
        errorMessage: null,
        successMessage: null,
        product: productData,
      });
      };
      
    } catch (error) {
      console.error("Error fetching product:", error);
      res.render("delete", {
        errorMessage: "An error occurred while fetching the product.",
        successMessage: null,
        product: null,
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

  // Controller logic to update a Product
  updateProduct: async function (req, res) {
    const { pId, pName, pDescription, pCategory, pStock, pPrice } = req.body;

    console.log("Received data:", req.body); // Log the request data

    try {
      const product = await productModel.findOne({ pId: pId });

      if (!product) {
        console.log("Product not found!");
        return res.status(404).render("update", {
          errorMessage: "Product ID not found!",
          successMessage: null,
        });
      }

      if (pName) product.pName = pName;
      if (pDescription) product.pDescription = pDescription;
      if (pCategory) product.pCategory = pCategory;
      if (pStock) product.pStock = parseInt(pStock);
      if (pPrice) product.pPrice = parseFloat(pPrice);

      console.log("Updating product:", product);

      await product.save();

      console.log("Product updated successfully:", product);
      return res.status(200).render("update", {
        errorMessage: null,
        successMessage: "Product updated successfully!",
        product:null,
      });
    } catch (error) {
      console.error("Error updating product:", error);
      return res.status(500).render("update", {
        errorMessage: "Server error! Unable to update product.",
        successMessage: null,
        product:product,
      });
    }
  },

  //Update by Id

  updateById: async (req, res) => {

    const productId = req.params.id;
    console.log(productId);

    try {
      const productData = await productModel.findOne({ pId: productId }); // Search the product on MongoDB

      console.log(productData);
      if (!productData) {
        console.log("We are inside no product found");
        return res.render("update", {
          errorMessage: "Product not found.",
          successMessage: null,
          product: null,
        });
      }
      else{
        console.log("We found the product");
        res.render("update", {
        errorMessage: null,
        successMessage: null,
        product: productData, // Sending the product to the view
      });
      };
      
    } catch (error) {
      console.error("Error fetching product:", error);
      res.render("update", {
        errorMessage: "An error occurred while fetching the product.",
        successMessage: null,
        product: null,
      });
    }
  },

  // See all products controller
  seeAllProducts: async (req, res) => {
    try {
      const products = await product.find();
  
      if (products.length === 0) {
        return res.render("seeAllProducts", {
          products: [],
          message: "No products available at the moment.",
        });
      }
  
      // Pass the fetched products to the EJS template
      res.render("seeAllProducts", { products, message: null });
    } catch (err) {
      console.error("Error fetching products:", err);
      res.status(500).send("Unable to fetch products. Please try again later.");
    }
  },

  // get products by category
  getbyCategory: async function (req, res) {
    console.log("We are inside the filter by category function");

    const {pCategory} = req.query;
    const result =  await productModel.find({pCategory});

    res.render('seeAllProducts.ejs',{products:result});

  },

  // get products by quantity
  getbyQuantity: async function (req, res) {
    console.log("We are inside the filter by quantity function");

    const quantity= req.query.pQuantity;
    const result =  await productModel.find({"pStock":{$gte:quantity}});
    res.render('seeAllProducts.ejs',{products:result});
  }

};
