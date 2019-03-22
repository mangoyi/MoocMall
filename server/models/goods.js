var mongoose = require('mongoose')
var Schema = mongoose.Schema
// product 模型
var productSchema = new Schema({
    "productId": String,
    "productName": String,
    "salePrice": Number,
    "productImage": String
})

module.exports = mongoose.model('Goods', productSchema);
// product 模型输出