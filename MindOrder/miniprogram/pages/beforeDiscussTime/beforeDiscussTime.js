// miniprogram/pages/beforeDiscussTime/beforeDiscussTime.js
const app = getApp();
Page({
  data: {
    title:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    if (app.globalData.selfOpenId == app.globalData.roomMaster) {//房主更新会议时间
      app.onUpdate('rooms', app.globalData.roomId, 'meetingTime', Number(options.timeHold))//更新会议时间
    }
    //console.log(options.timePreparing,'indexP')
    let counts = options.timePreparing
    /*   let counts = 2; */
    that.setData({
      counts: counts * 60,
      title:app.globalData.title
    })

    let hisRooms;
    console.log(app.globalData.selfOpenId,'id')
    app.onQuery('users', { openid: app.globalData.selfOpenId }, { hisRoom: true }).then(res => {
      let data = res.data[0];
      hisRooms = data.hisRoom;
      hisRooms.push(app.globalData.roomNum);
      wx.cloud.callFunction({
        name: 'updateComplex',
        data: {
          collect: 'users',
          where: { openid: app.globalData.selfOpenId },
          key :'hisRoom',
          value:hisRooms
        }
      }).then(console.log('更新成功！'))  
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
    let counts = this.data.counts;
    let inter = setInterval(function () {
      counts--;
      let second = String(counts % 60).padStart(2,0);
      let minute = String(Math.floor(counts / 60)).padStart(2,0);
      that.setData({
        seconds: second,
        minutes: minute
      });
      if (counts === 0) {
        clearInterval(inter);
        wx.redirectTo({
          url: '../try/try'
        })
      }
    }, 1000)
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