// pages/login.js
const app = getApp();
Page({
  data: {
    code: '',
    redirect_url: ''
  },
  handleLogin(res) {
    let data = res.detail;
    //console.log(data,'data')
    /* let iv = data.iv;
    let encryptedData = data.encryptedData;
    let code = this.data.code;
    let rawData = data.rawData;
    let signature = data.signature; */
    let userInfo = {};
    userInfo.avatarUrl = data.userInfo.avatarUrl;
    userInfo.nickName=data.userInfo.nickName;
    app.globalData.userInfo = userInfo;//全局储存用户信息
    let that = this;
    /* if (this.data.loading) {
      return
    } */
    //console.log(this.data.code, 'code');
    //console.log(this.data.redirect_url, 'redirect_url')
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
        app.globalData.selfOpenId = res.result.openid;
        wx.setStorageSync('userInfo', userInfo);//本地缓存用户信息
        wx.setStorageSync('selfOpenId', res.result.openid);
        wx.hideLoading();
        that.setData({
          loading: false
        });

        if (that.data.redirect_url) {
          wx.reLaunch({
            url: that.data.redirect_url
          })
        } else {
          wx.reLaunch({
            url: 'pages/index/index'///!!!!
          })
        }
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