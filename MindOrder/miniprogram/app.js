//app.js
App({
  globalData: {
    roomId: '',
    roomNum: '',
    userId: '',
    //selfOpenid: '',
    roomMaster: "",//获取房主的openid
    hasUserInfo: false,
    userInfo: null,
    term: 1,              //轮数默认为1,再来一轮时累加
    nowPage: 0,          //判断当前页面状态，主要区分是书写(1)、点赞(2)、排行榜(3)
    selfOpenId: "",
    minute: '',
    second: '',
    showMessage: [],
    pickMessage: [],
    title: '',
    UserData: []
  },
  onLaunch: function (path) {

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
    let selfOpenId = wx.getStorageSync('selfOpenId');
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
    if (!selfOpenId || !userInfo.avatarUrl) {
      wx.reLaunch({
        url: 'pages/login/login?redirect_url=' + encodeURIComponent(`/${redirect_url}`),
      })
      return
    }
  },

  //云开发添加记录
  onAdd: function (collect, data) {
    const db = wx.cloud.database()
    return db.collection(collect).add({
      data: data
    })
  },

  /* 查询记录 */
  onQuery: function (collect, where, field) {
    const db = wx.cloud.database()
    return db.collection(collect).where(where).field(field).get()
  },
  /* 更改记录 */
  onUpdate: function (collect, where, data, value) {
    const db = wx.cloud.database()
    return db.collection(collect).doc(where).update({
      data: {
        [data]: value
      }

    })
  },

})
