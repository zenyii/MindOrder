// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodslist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    wx.request({
      url: 'https://fl123.xyz/api/xcx/addUser.php',
      data: {
        userId:5678,
        message:"微信账号信息"
      },
      method:'POST',
      header:{
        'content-type':   "application/x-www-form-urlencoded"
      },
      success:function(res){
        //console.log("请求成功");
        //var data = JSON.parse(res.data);
        //self.setData({goodslist:res.data});
        console.log(res.data);
      },
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