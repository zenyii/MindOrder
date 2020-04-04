//获取应用实例
const app = getApp()
Page({
  data: {
    join: 1,
    roomNums: 0,
    value: null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  inputMsg: function (e) {
    this.setData({
      value: e.detail.value
    })

  },
  formSubmit: function (values) {//
    let roomNums = values.detail.value.roomId;
    let that = this;
    if (!roomNums) {
      wx.showToast({
        title: '房号不能为空！',
        icon: 'none',
        duration: 2000
      })
      return
    } else {
      wx.showLoading({
        title: '加载中',
      })
      app.globalData.roomNum = roomNums;
      app.onQuery('rooms', { roomNum: roomNums }, { roomNum: true, roomMaster: true, })
        .then(res => {
          let data = res.data[0];
          if (!data) {
            wx.hideLoading();
            wx.showToast({
              title: '不存在该房间，请重新输入！',
              icon: 'none',
              duration: 2000
            })
          } else {
            that.goToBuild(data.roomNum);
          }


        }, err => {

        })


    }

  },
  /* 获取用户信息 */

  goToBuild: function (num) {
    let that = this;
    //request//判断是否存在该房号
    wx.navigateTo({
      url: '../preparing/preparing?roomNum=' + num + '&join=' + that.data.join//传入验证码
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})