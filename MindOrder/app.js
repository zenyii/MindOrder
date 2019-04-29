//app.js
const utils = require('./utils/util');
const request = require('./requests/request');
App({
  globalData: {
    roomNum:0,
    appid: 'wx8d5d22897bfc549c',
    secret: '92751c1e7384da0a6fe2f851c20451da',
    userId: 'oGw5W49WStN-HbdVgfbSxykI8SC0',
    selfOpenid:'',
    roomMaster:'',//获取房主的openid
    //userInfo: {},
    hasUserInfo: false,
    userInfo: null,
    openId:1123,
    UserData: [
      {
        openId:1,
        words: [{ word: "词条1", num: [] }, { word: "词条2", num: [] }],
        method: [{ content: "具体方法1", num: [], isgood: false }, { content: "具体方法2", num: [], isgood: false }]
      },
      {
        openId:2,
        words: [{ word: "词条1", num: [], isgood: false }, { word: "词条2", num: [], isgood: false }],
        method: [{ content: "具体方法1", num: [], isgood: false }, { content: "具体方法2", num: [], isgood: false }]
      },
      {
        openId:3,
        words: [{ word: "词条1", num: [], isgood: false }, { word: "词条2", num: [], isgood: false }],
        method: [{ content: "具体方法1", num: [], isgood: false }, { content: "具体方法2", num: [], isgood: false }]
      },
    ],
    minute: '',
    second: '',
    showMessage: [],
    pickMessage: []
  },
  onLaunch: function (path) {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    console.log(path,'path')
    let query = '';
    let redirect_url = '';
    let userInfo = wx.getStorageSync('userInfo');
    //解析url中是否带有参数，若有则拼接成字符串
    for (let i in path.query) {
      if (i) {
        query = query + i + '=' + path.query[i] + '&'
      }
    }
    if (query) {
      redirec_url = parh.path + '?' + query;
    } else {
      redirect_url = path.path;
    }
    if (!userInfo) {
      wx.reLaunch({
        url: 'pages/login/login?redirect_url=' + encodeURIComponent(`/${redirect_url}`),
      })
      return
    }
  },
  /* 获取用户数据 */
  //1、调用微信登录接口，获取code

  getUserInfo: function () {
    let that = this;
    let userInfo = wx.getStorageSync('userInfo') || {};

    return new utils.promise((resolve, reject) => {
      console.log(userInfo, 'storage')
      console.log(!userInfo.nickName)
      //先发送到后台确认登录态是否过期
      if (!userInfo.nickName) {//+openid?
        wx.login({
          success: function (res) {
            let code = res.code;
            console.log(res.code, 'code')
            if (code) {
              wx.getUserInfo({
                //withCredentials: true,
                success: function (e) {
                  wx.setStorageSync('userInfo', e.userInfo);
                  request.request('https://fl123.xyz/api/xcx/addUser.php', {
                    userId: 'oGw5W49WStN-HbdVgfbSxykI8SC0',
                    message: e.userInfo
                  }, 'POST').then(r => {
                    console.log(r, '添加用户数据成功')
                    resolve(e.userInfo);
                  }, r => {
                    console.log(r, '添加用户失败')
                    reject(r);
                  })//url, data, method
                  //that.globalData.userInfo = e
                  //发送code凭证
                  //request!!!!后台生成一个唯一字符串sessionid作为键，将openid和session_key作为值，存入redis，超时时间设置为2小时
                  //获取sessionid，setstorage（sessionid）发送时附带在header上

                  //直接取openid，wx.setStorageSync('openid', openid);//存储openid  
                  console.log(e, 'applogin')

                },
                fail: function (e) {
                  reject(e);
                }
              })
              let data = that.globalData;
              var wechatUrl = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + data.appid + '&secret=' + data.secret + '&js_code=' + code + '&grant_type=authorization_code';
              /* request.request(wechatUrl, {}, 'GET', (data) => {
                console.log(data,'data')
                let obj = {};
                obj.openid = data.openid;
                obj.expires_in = Date.now() + data.expires_in;
                console.log(obj,'obj');
                wx.setStorageSync('user', obj);//存储openid  
              }) */
              request.request(wechatUrl, {}, 'GET').then(data => {
                console.log(data, 'data')
                let obj = {};
                obj.openid = data.openid;
                obj.expires_in = Date.now() + data.expires_in;
                console.log(obj, 'obj');
                wx.setStorageSync('user', obj);//存储openid  
              }, e => {
                console.log('获取用户唯一标识失败')
              })
            }
          },
          fail: function (e) {
            console.log('login失败');
          }
        })
      } else {//已登录
        //console.log(userInfo,'app')
        resolve(userInfo);
      }

    })
  },


})