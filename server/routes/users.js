var express = require('express');
var router = express.Router();
require('./../utils/util')
var User = require('./../models/user')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// login
router.post('/login', function(req, res, next) {
  let param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  };
  console.log("param" + param.userName);
  // 获取user模型 操作mogoose模型
  User.findOne(param, function(err, userDoc) {
    if(err) {
      res.json({
        status: 1,
        msg: err.message
      })
    } else {
      if (userDoc) {
        // cookie 向浏览器存储cookie
        res.cookie("userId", userDoc.userId, {
          path: '/',
          maxAge: 1000*60*60
        });
        res.cookie('userName',userDoc.userName, {
          path: '/',
          maxAge: 1000*60*60
        });
        // req.session.user = userDoc;
        res.json({
          status: 0,
          msg: '',
          result: {
            userName: userDoc.userName,
          }
        })
      } else {
        res.json({
          status: 1,
          msg: '账号或则密码错误',
          result: ''
        })
      }
    }
  })

});

// logout
router.post('/logout', function(req, res, next) {
  // clear cookie
  res.cookie('userId', '', {
    path: '/',
    maxAge: -1
  })
  res.json({
    status: 0,
    msg: 'success',
    result: ''
  })

});

// checkLogin
router.get('/checkLogin', function(req, res, next) {
  if (req.cookies.userId) {
    // 校验获取当前用户信息
    res.json({
      status: 0,
      msg: '',
      result: req.cookies.userName || ''
    })
  } else {
    res.json({
      status: 1,
      msg: '未登录',
      result: ''
    })
  }
});

// cartList 查询购物车数据
router.get('/cartList', function(req, res, next) {
  var userId = req.cookies.userId;
  User.findOne({userId: userId}, function(err, doc) {
    if (err) {
      res.json({
        status: 1,
        msg: err.message,
        result: ''
      })
    } else {
      // 读取购物车列表数据
      if(doc) {
        res.json({
          status: 0,
          msg: '',
          result: doc.cartList
        })
      }
    }
  })
});

// 删除商品 del
router.post("/cart/del", function(req, res, next) {
  var userId = req.cookies.userId,
      productId = req.body.productId;
  User.update({
    userId: userId
  }, {
    $pull: 
      { 
        'cartList': 
        {
          'productId': productId
        }
      }
    }, function(err, doc) {
      if (err) {
        res.json({
          status: 1,
          msg: err.message,
          result: ''
        })
      } else {
        res.json({
          status: 0,
          msg: '',
          result: 'success'
        })
      }

    })
});

// 修改商品数量
router.post('/cartEdit', function(req, res, next) {
  var userId  = req.cookies.userId,
      productId = req.body.productId,
      productNum = req.body.productNum,
      checked = req.body.checked;
  User.update({
    'userId': userId,
    "cartList.productId": productId
  }, {
    'cartList.$.productNum': productNum,
    'cartList.$.checked': checked
  }, function(err, doc) {
    if (err) {
      res.json({
        status: 1,
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: 0,
        msg: '',
        result: 'success'
      })
    }
  })
});

// 全选不全选
router.post("/editCheckAll", function(req, res, next) {
  var userId = req.cookies.userId,
      checkAll = req.body.checkAll;
  User.findOne({userId: userId}, function(err, doc) {
    if (err)  {
      res.json({
        status: 1,
        msg: err.message,
        result: ''
      })
    } else {
      if (doc) {
        doc.cartList.forEach((item) => {
          item.checked = checkAll == true ? '1' : 0;
        });
        doc.save(function(err1, doc1) {
          if (err1) {
            res.json({
              status: 1,
              msg: err1.message,
              result: ''
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
});

// 查询用户地址
router.get('/addressList', function(req, res, next) {
  var userId = req.cookies.userId;
  User.findOne({userId: userId}, function(err, doc) {
    if (err) {
      res.json({
        status:1,
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: 0,
        msg: '',
        result: doc.addressList
      })
    }
  });
});

// 设置默认地址
router.post("/setDefault", function(req, res, next) {
  var userId = req.cookies.userId,
      addressId = req.body.addressId;
  if (!addressId) {
    res.json({
      status: 1003,
      msg: 'addressId is null',
      result: ''
    })
  } 
  User.findOne({userId: userId}, function(err, doc) {
    if (err) {
      res.json({
        status: 1,
        msg: err.message,
        result: ''
      })
    } else {
      let addressList = doc.addressList;
      addressList.forEach(item => {
        if (item.addressId == addressId) {
          item.isDefault = true;
        } else {
          item.isDefault = false;
        }
      });
      doc.save(function(err1, doc1) {
        if (err1) {
          res.json({
            status: 1,
            msg: err1.message,
            result: ''
          })
        } else {
          res.json({
            status: 0 ,
            msg: '',
            result: ''
          })
        }
      }); 
    }
  })

});

// 删除地址
router.post('/delAddress', function(req, res, next) {
  let userId = req.cookies.userId,
      addressId = req.body.addressId;
      User.update({
        userId: userId
      }, {
        $pull: 
          { 
            'addressList': 
            {
              'addressId': addressId
            }
          }
        }, function(err, doc) {
          if (err) {
            res.json({
              status: 1,
              msg: err.message,
              result: ''
            })
          } else {
            res.json({
              status: 0,
              msg: '',
              result: 'success'
            })
          }
    
        })
});

// 生成订单
router.post("/payMent", function (req,res,next) {
  var userId = req.cookies.userId,
    addressId = req.body.addressId,
    orderTotal = req.body.orderTotal;
  User.findOne({userId:userId}, function (err,doc) {
     if(err){
        res.json({
            status:"1",
            msg:err.message,
            result:''
        });
     }else{
       var address = '',goodsList = [];
       //获取当前用户的地址信息
       doc.addressList.forEach((item)=>{
          if(addressId==item.addressId){
            address = item;
          }
       })
       //获取用户购物车的购买商品
       doc.cartList.filter((item)=>{
         if(item.checked=='1'){
           goodsList.push(item);
         }
       });

       var platform = '622';
       var r1 = Math.floor(Math.random()*10);
       var r2 = Math.floor(Math.random()*10);

       var sysDate = new Date().Format('yyyyMMddhhmmss');
       var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
       var orderId = platform+r1+sysDate+r2;
       var order = {
          orderId:orderId,
          orderTotal:orderTotal,
          addressInfo:address,
          goodsList:goodsList,
          orderStatus:'1',
          createDate:createDate
       };

       doc.orderList.push(order);

       doc.save(function (err1,doc1) {
          if(err1){
            res.json({
              status:"1",
              msg:err.message,
              result:''
            });
          }else{
            res.json({
              status:"0",
              msg:'',
              result:{
                orderId:order.orderId,
                orderTotal:order.orderTotal
              }
            });
          }
       });
     }
  })
});

// 根据订单Id查询订单信息
router.get('/orderDetail', function(req, res, next) {
  let userId = req.cookies.userId,
      orderId = req.param('orderId');
  User.findOne({userId: userId}, function(err, userInfo) {
    if (err) {
      res.json({
        status: 1,
        msg: err.message,
        result: ''
      })
    } else {
      let orderList = userInfo.orderList;
      let orderTotal = 0;
      if (orderList.length > 0 ) {
        orderList.forEach(item => {
          if (item.orderId == orderId) {
            orderTotal = item.orderTotal;
          }
        });
        res.json({
          status: 0,
          msg: '',
          result: {
            orderId: orderId,
            orderTotal: orderTotal
          }
        })

      } else {
        res.json({
          status: 10002,
          msg: "无此订单",
          result: ''
        })

      }

    }
  });
});

// 查询购物车数量
router.get('/getCartCount', function(req, res, next) {
  let userId = req.cookies.userId;
  User.findOne({
    userId: userId
  }, function(err, doc) {
    if (err) {
      res.json({
        status: 1,
        msg: err.message,
        result: ''
      })
    } else {
      let cartCount = 0;
      let cartList = doc.cartList;
      cartList.map(function(item) {
        cartCount += parseInt(item.productNum);
      });
      res.json({
        status: 0,
        msg: '',
        result: cartCount
      })
    }
  })
});

module.exports = router;
