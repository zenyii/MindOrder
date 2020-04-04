// pages/login.js
const app = getApp();
Page({
  data: {
    code: '',
    redirect_url: ''
  },
  handleLogin(res) {
    let data = res.detail;
    let userInfo = {};
    userInfo.avatarUrl = data.userInfo.avatarUrl;
    userInfo.nickName = data.userInfo.nickName;
    app.globalData.userInfo = userInfo;//全局储存用户信息
    let that = this;
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      loading: true,
    })
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        let openid = res.result.openid;
        app.globalData.selfOpenId = openid;
        wx.setStorageSync('userInfo', userInfo);//本地缓存用户信息
        wx.setStorageSync('selfOpenId', openid);
        wx.hideLoading();
        that.setData({
          loading: false
        });
        //先查询是否有此用户记录，再创建users表
        app.onQuery('users', { openid: openid }, { nickName: true }).then(res => {
          let data = res.data;
          if (data.length === 0) {//如果后台没有此用户记录，则加入
            app.onAdd('users', {
              avatarUrl: app.globalData.userInfo.avatarUrl,
              hisRoom: [],
              nickName: app.globalData.userInfo.nickName,
              star: [],
              userInfo: {},
              openid: app.globalData.selfOpenId
            }).then(()=>{
              console.log('插入用户数据成功')
            })
          }else{
            console.log('用户已有数据')
          }
          //开始跳转页面
          if (that.data.redirect_url) {
            console.log('跳转开始')
            wx.redirectTo({
              url: that.data.redirect_url
            })
          } else {
            wx.redirectTo({
              url: 'pages/index/index'///!!!!
            })
            return 
          }
        })  
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })

  },
  onLoad: function (options) {
    let that = this;
    this.setData({
      redirect_url: decodeURIComponent(options.redirect_url)
    })
    wx.login({//登录并获取code
      success: function (res) {
        if (res.code) {
          that.setData({
            code: res.code
          })
        }
      }
    })
  },

})