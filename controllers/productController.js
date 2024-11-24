var mongoose = require('mongoose');
var productModel = require('../models/product');
var path = require('path');

module.exports = {
    deleteProduct: async function (req,res) {
        const {pID} = req.body;

        const productExists = productModel.findOne({pId:pID});

        if(!productExists){
            return res.status(404).send("Product Id not found!!!!");
        }

        const deletedProduct = await productModel.findOneAndDelete({pId:pID});

        console.log("Product Deleted Scucessfully!!!", deletedProduct);
        
    }
    
}