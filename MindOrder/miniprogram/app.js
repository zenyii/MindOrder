//app.js
const utils = require('./utils/util');
const request = require('./requests/request');
App({
  globalData: {
    roomNum: '',
    appid: 'wx8d5d22897bfc549c',
    secret: '92751c1e7384da0a6fe2f851c20451da',
   // userId: 'oGw5W49WStN-HbdVgfbSxykI8SC0',
    selfOpenid: 'oGw5W49WStN-HbdVgfbSxykI8SC3',
    roomMaster: '',//获取房主的openid
    roomId:'8d22b6d6-d5ce-4aa3-b373-0da450a66465',//字段id
    //userInfo: {},
    hasUserInfo: false,

    userInfo: null,
    trem: 1,              //轮数默认为1,再来一轮时累加
    selfOpenId:"o6e-P4nvU2HvdRqKOZIwRsw_wgD8",
    UserData: [
      {
        openId: 1,
        words: [{ word: "词条1", num: [] }, { word: "词条2", num: [] }],
        method: [{ content: "具体方法1", num: [], isgood: false }, { content: "具体方法2", num: [], isgood: false }]
      },
      {
        openId: 2,
        words: [{ word: "词条1", num: [], isgood: false }, { word: "词条2", num: [], isgood: false }],
        method: [{ content: "具体方法1", num: [], isgood: false }, { content: "具体方法2", num: [], isgood: false }]
      },
      {
        openId: 3,
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
    wx.hideTabBar({
      animation:true
    });
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    console.log(path, 'path')
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

//云开发添加记录
  onAdd: function (collect,data) {
    const db = wx.cloud.database()
    return db.collection(collect).add({
      data: data
    })
  },
  
/* 查询记录 */
  onQuery: function(collect,where,field) {
    const db = wx.cloud.database()
    return db.collection(collect).where(where).field(field).get()
  },

  /* 更改记录 */
  onUpdate:function(collect,where,data,value){
    const db = wx.cloud.database()
    return db.collection(collect).doc(where).update({
      data:{
        [data]:value
      }
      
    })
  },


  
})
