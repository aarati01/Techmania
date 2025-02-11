// require mongoose package
var mongoose = require('mongoose');

// Create the schema for the DB
var userSchema = new mongoose.Schema({
    username: {type:String},
    password:{type:String}
});

module.exports = mongoose.model('user',userSchema);