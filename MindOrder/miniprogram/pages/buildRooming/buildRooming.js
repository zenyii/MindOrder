//获取应用实例
const app = getApp()
const request = require('../../requests/request');
Page({
  data: {
    roomId: 0,
    inputValue: {},
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    /* 随机roomid */
    that.setData({
      roomId: that.getRandomInt(100000, 999999)
    })

  },
 
  goToBuild: function () {
    /* 跳转到invite页面 */
    wx.navigateTo({
      //传入roomid,主题
      url: `../invite/invite?roomNum=${this.data.inputValue.roomNum}&text=${this.data.inputValue.text}`
    })
    //console.log('goto')
  },

  /* button开启房间 */
  formSubmit: function (values) {//
    let that = this;
    let inputValue = values.detail.value;//获取表单信息
    //inputValue.userIdArr = [app.globalData.selfOpenid];//获取用户自己的openid
    app.globalData.roomMaster=app.globalData.selfOpenid;//设置房主openid
    app.globalData.roomNum = this.data.roomId;//全局保存房间号
    wx.showLoading({
      title: '加载中',
    })
    /* 发送表单数据 */
    request.request('https://fl123.xyz/api/xcx/createRoom.php', inputValue, 'POST')
      .then(e => {
        that.setData({
          inputValue: inputValue
        })
        console.log('form发生了submit事件，携带数据为：', that.data.inputValue);
      }, e => {
        console.log('发送表单失败！' + e);
      })
      .then(e => {//数据发送到服务器并反馈成功后页面跳转
        that.goToBuild();
      }, e => {

      }).finally(
        () => {
          wx.hideLoading();
        }
      )
  },
  
  /* 随机数 */
  getRandomInt: function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
    //不含最大值，含最小值
  },

  /* 返回到首页不刷新 */
  onUnload: function () {
    /* let pages = getCurrentPages();
    let prevPage = pages[ pages.length - 2 ];
    prevPage.setData({  // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
      selected:0
  });
    wx.navigateBack({
      delta:2 // 返回上一级页面
    }) */
    /* wx.redirectTo({
      url:'../index1/index1?selected=0'
    }) */
  }
  /*   formReset() {
      console.log('form发生了reset事件')
    } */
})
//获取表单数据以及房主个人信息发送到服务器储存
//表单必须有值输入


