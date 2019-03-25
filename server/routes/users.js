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

module.exports = router;
