// miniprogram/pages/myStar/myStar.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    star:[],
    roomMsg:[],
    titleMsg:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '我的收藏',
    })

    var selfOpenId = app.globalData.selfOpenId;
    var starRoomMsg = [];
    //从users表拉取已收藏的房间号
    const db = wx.cloud.database();
    db.collection('users').where({
      _openid: selfOpenId
    }).get().then(res => {
      that.setData({
        star: res.data[0].star
      })
    }).then(()=>{
      if(that.data.star.length){
      //根据拉取到的已收藏房间号从rooms表中拉取数据
      for (let x = 0; x < that.data.star.length; x++) {
        var roomnum = that.data.star[x];
        db.collection('rooms').where({
          roomNum: roomnum
        }).get().then(res => {
          starRoomMsg.push(res.data[0]);
          that.data.titleMsg.push(res.data[0].title);
          that.setData({
            titleMsg: that.data.titleMsg
          })
          wx.setStorage({
            key: 'starRoomMsg',
            data: starRoomMsg
            })
        })
      }
      }
      else{
        wx.showToast({
          title: '暂无收藏',
          duration: 1000
        })
      }
    })
  },
  goReport: function (e) {
    let index = e.currentTarget.dataset.index;
    app.globalData.roomnum = this.data.hisRoom[index];
    wx.navigateTo({
      url: '/pages/report/report',
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