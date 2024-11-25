var mongoose = require('mongoose');
var productModel = require('../models/product');
var path = require('path');

module.exports = {
    deleteProduct: async function (req, res) {
        const { pID } = req.body;

        try {
            const productExists = await productModel.findOne({ pId: pID });

            if (!productExists) {
                console.log("Product Id not found!!!!");
                return res.status(404).render('delete', { 
                    errorMessage: "Product ID not found!!!!", 
                    successMessage: null 
                });
            }

            const deletedProduct = await productModel.findOneAndDelete({ pId: pID });

            console.log("Product Deleted Successfully!!!", deletedProduct);

            return res.status(200).render('delete', { 
                errorMessage: null, 
                successMessage: "Product deleted successfully!" 
            });
        } catch (error) {
            console.error("Error deleting product:", error);
            return res.status(500).render('delete', { 
                errorMessage: "Server error! Unable to delete product.", 
                successMessage: null 
            });
        }
    }
};
