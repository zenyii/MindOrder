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
    //console.log(e.detail.value)
    this.setData({
      value: e.detail.value
    })

  },
  formSubmit: function (values) {//

    let that = this;
    let roomNums = values.detail.value.roomId;
    console.log(typeof roomNums, 'value');
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
      app.onQuery('rooms', { roomNum: roomNums }, { roomNum: true ,roomMaster:true, })
        .then(res => {
          let data = res.data[0];
          //console.log(data, 'data')
          if (!data) {
            wx.hideLoading();
            wx.showToast({
              title: '不存在该房间，请重新输入！',
              icon: 'none',
              duration: 2000
            })
          } else {
            
           // console.log('form发生了submit事件，携带数据为：', that.data.inputValue)
            that.goToBuild(data.roomNum);
            console.log('goto')

          }


        }, err => {

        })


    }

  },
  /* 获取用户信息 */

  goToBuild: function (num) {
    //request//判断是否存在该房号
    wx.navigateTo({
      url: '../preparing/preparing?roomNum=' + num + '&join=' + this.data.join//传入验证码
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})