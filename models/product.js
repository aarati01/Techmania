// require mongoose package
var mongoose = require('mongoose');

// Create the schema for the DB
var productSchema = new mongoose.Schema({
    pId: {type:Number},
    pName:{type:String},
    pDescription:{type:String},
    pCategory:{type:String},
    pStock:{type:Number},
    pPrice:{type:Number},
    pImage:{type:String}
});


module.exports = mongoose.model('product',productSchema);