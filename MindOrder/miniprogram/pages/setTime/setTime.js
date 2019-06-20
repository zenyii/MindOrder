// miniprogram/pages/setTimer/setTimer.js
const app = getApp();
Page({
  data: {
    timeRangeWrite: [],
    timeRangePrepare: [],
    timeHold: '',
    timePrepare: '',
    rank: 0,
    placeHolderWri: 1,
    placeHolderPre: 1,
    startTime:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let rank = options.rank;
    if (options.placeHolderWri) {
      that.setData({
        placeHolderWri: Number(options.placeHolderWri)
      })
    }
    let timeRangeWrite = [];
    let timeRangePrepare = [];
    Array.from({ length: 58 }, (v, i) => {
      timeRangeWrite.push(i + 1);
      timeRangePrepare.push(i * 5);
    });
    that.setData({
      rank: rank,
      timeRangeWrite: timeRangeWrite,
      timeRangePrepare: timeRangePrepare
    });
  },
  bindPickerChangeW(e) {
    this.setData({
      timeHold: e.detail.value,
      placeHolderWri: 0
    })
  },
  bindPickerChangeP(e) {
    this.setData({
      timePreparing: e.detail.value,
      placeHolderPre: 0
    })
  },

  formSubmit: function () {
    let that = this;
    let timeRangeWrite = that.data.timeRangeWrite;
    let timeHold = timeRangeWrite[that.data.timeHold];
    app.globalData.minute = `${Number(timeHold) - 1}`;
    app.globalData.second = `60`;
    if (that.data.rank == 0) {//初次
      var timeRangePrepare = that.data.timeRangePrepare;
      var timePreparing = timeRangePrepare[that.data.timePreparing];//获取时间值
      app.onUpdate('rooms', app.globalData.roomId, 'preparingTime', timePreparing)//更新准备时间的值
        .then(res => {
          
        })
        that.startTimeTamp();

    }

    app.onUpdate('rooms', app.globalData.roomId, 'meetingTime', timeHold)
      .then(res => {
        if (that.data.rank == 0) {
          wx.redirectTo({
            url: `../beforeDiscussTime/beforeDiscussTime?timePreparing=${timePreparing}&timeHold=${timeHold}`,
            success: function () {
              app.onUpdate('rooms', app.globalData.roomId, 'allset', true);
            }
          })
        } else {
          app.onUpdate('rooms', app.globalData.roomId, 'again', true)
          wx.redirectTo({
            url: `../try/try`,
          })
        }

      })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //计时开始方法
  startTimeTamp: function () {
    let that = this;
    //获取当前时间戳
    this.setData({
      startTime: Date.parse(new Date()) / 1000
    })
    //保存时间戳作为房间开始时刻
    const db = wx.cloud.database()
    db.collection('rooms').doc(app.globalData.roomId).update({
      data: {
        //设置开始时间的时间戳
        startTime: that.data.startTime
      },
      success: res => {

      }
    })
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