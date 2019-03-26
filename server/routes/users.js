var express = require('express');
var router = express.Router();
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

module.exports = router;
