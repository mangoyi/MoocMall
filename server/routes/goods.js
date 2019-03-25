var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');

// connect Mongodb
mongoose.connect('mongodb://127.0.0.1:27017/dumall', {useNewUrlParser: true});

mongoose.connection.on('connected', function() {
    console.log('mongoDB connected success');
});

mongoose.connection.on('error', function() {
    console.log('mongoDB connected fail');
});

mongoose.connection.on('disconnected', function() {
    console.log('mongoDB connected disconnected');
});

// 查询商品列表
// goods 路由会访问此路由,
router.get('/', function(req, res, next) {
    // 数据库查询代码(业务部分)
    let page = parseInt(req.param('page'));
    let pageSize = parseInt(req.param('pageSize'));
    let priceLevel = req.param('priceLevel');
    let sort = req.param('sort');
    let skip = (page - 1)*pageSize;
    let priceGt = '', priceLt = '';
    let params = {};   
    if (priceLevel != 'all') {
        switch (priceLevel) {
            case '0':
                priceGt = 0;priceLt = 100
            break;
            case '1':
                priceGt = 100; priceLt = 500
            break;
            case '2':
                priceGt = 500; priceLt = 1000
            break;
            case '3':
                priceGt = 1000; priceLt = 5000
            break;
        }
        params = {
            salePrice: {
                $gt: priceGt,
                $lte: priceLt
            }
        }
    }
    let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
    goodsModel.sort({'salePrice': sort});  // 1升序 -1降序

    goodsModel.exec(function(err, doc) {
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

// 加入购物车  二级路由   /goods/addCart
router.post('/addCart', function(req, res, next) {
    // post请求通过req.body.productId 来获取参数
    var userId = '100000077', productId = req.body.productId;
    var User = require('../models/user');

    User.findOne({userId: userId}, function(err, userDoc) {
        if (err) {
            res.json({
                status: 1,
                msg: err.message
            })
        } else {
            console.log(userDoc);
            if (userDoc) {
                let goodItem = '';
                userDoc.cartList.forEach(function(item) {
                    if (item.productId === productId) {
                        // 购物车已经存在该商品
                        goodItem = item;
                        item.productNum++;
                    }
                });
                if (goodItem) {
                    // 如果存在
                    userDoc.save(function(err3, doc3) {
                        if (err3) {
                            res.json({
                                status: 1,
                                msg: err3.message
                            })
                        } else {
                            res.json({
                                status: 0,
                                msg: '',
                                result: 'success'
                            })
                        }
                    })
                } else {
                    // 如果不存在
                    Goods.findOne({productId: productId}, function(err1, doc) {
                        if (err1) {
                            res.json({
                                status: 1,
                                msg: err1.message
                            })
                        } else {
                            if (doc) {
                                // doc是一个商品信息
                                doc.productNum = 1;
                                doc.checked = 1;

                                // 将商品信息加入到用户名下
                                userDoc.cartList.push(doc);
                                userDoc.save(function(err2, doc2) {
                                    if (err2) {
                                        res.json({
                                            status: 1,
                                            msg: err2.message
                                        })
                                    } else {
                                        res.json({
                                            status: 0,
                                            msg: '',
                                            result: 'success'
                                        })
                                    }
                                })
                            }
                        }
                    })
                }

            }
        }
    })

});



module.exports = router;

