// miniprogram/pages/beforeDiscussTime/beforeDiscussTime.js
const app = getApp();
Page({
  data: {
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that =this;
    app.onUpdate('rooms',app.globalData.roomId,'meetingTime',Number(options.timeHold))//更新会议时间
    //console.log(options.timePreparing,'indexP')
    let counts = options.timePreparing
  /*   let counts = 2; */
    that.setData({
      counts:counts*60
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
    let counts = that.data.counts;
    let inter = setInterval(function(){
      counts--;
      that.setData({
        seconds:counts%60,
        minutes:Math.floor(counts/60)
      });
      if(counts===0) clearInterval(inter);
    },1000)
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