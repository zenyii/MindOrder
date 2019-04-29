// pages/login.js
const app = getApp();
const request = require('../../requests/request');
Page({
  data: {
    code: '',
    redirect_url: ''
  },
  handleLogin(res) {
    let data = res.detail;
    //console.log(data,'data')
    let iv = data.iv;
    let encryptedData = data.encryptedData;
    let code = this.data.code;
    let rawData = data.rawData;
    let signature = data.signature;
    let userInfo = data.userInfo;
    let that = this;
    if (this.data.loading || !iv || !encryptedData) {
      return
    }
    //console.log(this.data.code, 'code');
    //console.log(this.data.redirect_url, 'redirect_url')
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      loading: true,
    })
    request.request('https://fl123.xyz/api/xcx/addUser.php', { code, iv, encryptedData, rawData, signature }, 'POST', 'application/x-www-form-urlencoded')
      .then(r => {
        //返回自定义登录态
        console.log(r, '添加用户数据成功');
         wx.setStorageSync('userInfo',userInfo);
         app.globalData.userInfo = userInfo;
        wx.hideLoading();
        that.setData({
          loading: false
        });
        
        if (that.data.redirect_url) {
          //console.log('重定向！')
          wx.reLaunch({
            url: that.data.redirect_url
          })
        } else {
          //console.log('没有来源，默认index')
          wx.reLaunch({
            url: 'pages/index/index'///!!!!
          })
        }
      }, r => {
        console.log(r, '添加用户失败')
        reject(r);
      })

  },
  onLoad: function (options) {
    let that = this;
    this.setData({
      redirect_url: decodeURIComponent(options.redirect_url)
    })
    wx.login({
      success: function (res) {
        if (res.code) {
          that.setData({
            code: res.code
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})