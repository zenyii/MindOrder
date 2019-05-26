// miniprogram/pages/setTimer/setTimer.js
const app = getApp();
Page({
  data: {
    timeRangeWrite: [],
    timeRangePrepare: [],
    timeHold: '',
    timePrepare: '',
    rank: 0,
    placeHolderWri:1,
    placeHolderPre:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let rank = options.rank;
    if(options.placeHolderWri){
      that.setData({
        placeHolderWri:Number(options.placeHolderWri)
      })
    }
    console.log(rank,'rank')
    let timeRangeWrite = [];
    let timeRangePrepare = [];
    Array.from({ length: 13 }, (v, i) => {
      timeRangeWrite.push(i + 1);
      timeRangePrepare.push(i + 1);
    });
    that.setData({
      rank: rank,
      timeRangeWrite: timeRangeWrite,
      timeRangePrepare: timeRangePrepare
    });
  },
  bindPickerChangeW(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      timeHold: e.detail.value,
      placeHolderWri:0
    })
  },
  bindPickerChangeP(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      timePreparing: e.detail.value,
      placeHolderPre:0
    })
  },
  bindfocus:function(){
    console.log('焦点时间')
  },
  bindblus:function(){
    console.log('失焦事件')
  },
  formSubmit: function () {
    let that = this;
    let timeRangeWrite = that.data.timeRangeWrite;
    let timeHold = timeRangeWrite[that.data.timeHold];
    app.globalData.minute = `${Number(timeHold) - 1}`;
    app.globalData.second = `60`;
    //console.log(app.globalData.minute, 'minute')
    //console.log(app.globalData.second, 'second')
    console.log(that.data.rank,'rank')
    if (that.data.rank == 0) {//初次
      var timeRangePrepare = that.data.timeRangePrepare;
      var timePreparing = timeRangePrepare[that.data.timePreparing];//获取时间值
      app.onUpdate('rooms', app.globalData.roomId, 'preparingTime', timePreparing)//更新准备时间的值
        .then(res => {
          console.log('更新准备时间成功');
        })
    }
    
    app.onUpdate('rooms', app.globalData.roomId, 'meetingTime', timeHold)
        .then(res => {
          if(that.data.rank==0){
            wx.redirectTo({
              url: `../beforeDiscussTime/beforeDiscussTime?timePreparing=${timePreparing}&timeHold=${timeHold}`,
              success: function () {
                app.onUpdate('rooms', app.globalData.roomId, 'allset', true)
              }
            })
          }else{
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