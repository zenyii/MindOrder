//获取应用实例
const app = getApp()
var wsOpen = false;
const request = require('../../requests/request');
Page({
  data: {
    join:1,
    inputValue:{
    },
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  formSubmit: function (values) {//
    //this.getUserInfo();
    //let promise = new utils.promise();
    // console.log(promise,'promise')
    let that = this;
    let inputValue = values.detail.value;
    wx.showLoading({
      title: '加载中',
    })
    
      /* 获取用户信息 */
      request.request('https://fl123.xyz/api/xcx/createRoom.php',inputValue,'POST','application/x-www-form-urlencoded')//根据房号搜寻房间信息
      .then(e=>{
        that.setData({
          inputValue: inputValue
        })
        console.log('form发生了submit事件，携带数据为：', that.data.inputValue)
      },e=>{
        console.log('发送表单失败！'+e)
      })
    .then(e=>{
      that.goToBuild();
      console.log('goto')
    },e=>{

    }).finally(
      ()=>{
        wx.hideLoading();
      }
    )
  },
  /* 获取用户信息 */
  
  goToBuild: function () {
    //request//判断是否存在该房号
    wx.navigateTo({
      url: '../preparing/preparing?roomId='+this.data.inputValue.roomId+'&join='+this.data.join//传入验证码
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})