var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');

// connect Mongodb
mongoose.connect('mongodb://127.0.0.1:27017/dumall');

mongoose.connection.on('connected', function() {
    console.log('mongoDB connected success');
});

mongoose.connection.on('error', function() {
    console.log('mongoDB connected fail');
});

mongoose.connection.on('disconnected', function() {
    console.log('mongoDB connected disconnected');
});

router.get('/', function(req, res, next) {
    // 数据库查询代码(业务部分)
    Goods.find({},function(err, doc) {
        if (err) {
            // 报错
            res.json({
                status: 1,
                msg: err.message
            })
        } else {
            res.json({
                status: 0,
                msg: '',
                result: {
                    count: doc.length,
                    list: doc
                }
            })
        }
    })
});

module.exports = router;

