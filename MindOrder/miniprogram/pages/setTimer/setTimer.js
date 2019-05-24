// miniprogram/pages/setTimer/setTimer.js
const app = getApp();
Page({
  data: {
    timeRangeWrite: [],
    timeRangePrepare: [],
    timeHold:'',
    timePrepare:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let timeRangeWrite = [];
    let timeRangePrepare = [];
    let that = this;
    Array.from({ length: 13 }, (v, i) => {
      timeRangeWrite.push(i+1);
      timeRangePrepare.push(i+1);
    });
    that.setData({
      timeRangeWrite: timeRangeWrite,
      timeRangePrepare:timeRangePrepare
    });
  },
  bindPickerChangeW(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      timeHold: e.detail.value
    })
  },
  bindPickerChangeP(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      timePreparing: e.detail.value
    })
  },
  formSubmit:function(){
    let that = this;
    let timeRangePrepare =that.data.timeRangePrepare;
    let timeRangeWrite =that.data.timeRangeWrite; 
    let timePreparing = timeRangePrepare[that.data.timePreparing];//获取时间值
    let timeHold =  timeRangeWrite[that.data.timeHold];
      app.onUpdate('rooms',app.globalData.roomId,'preparingTime',timePreparing)//更新准备时间的值
      .then(res=>{
        wx.redirectTo({
          url:`../beforeDiscussTime/beforeDiscussTime?timePreparing=${timePreparing}&timeHold=${timeHold}`,
          success:function(){
            app.onUpdate('rooms',app.globalData.roomId,'allset',true)
          }
        })
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