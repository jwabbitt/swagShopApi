var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var product = new Schema({
    title: String,
    price: Number,
    imgUrl: {
        type: String,
        default: ""
    },
    likes: {
        type: Number, 
        default: 0
    }
});

module.exports = mongoose.model('Product', product);