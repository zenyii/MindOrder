//获取应用实例
const app = getApp()
const request = require('../../requests/request');
Component({

  data: {
    roomId: 0,
    // redBorder:false,
    inputValue: {},
   

    //canIUse: wx.canIUse('button.open-type.getUserInfo'),
    /*     code: '',
        encryptedData: '',
        iv: '' */
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      roomId: getRandomInt(100000, 999999)
    })

    /* 初始化，载入现存的用户数据
      if (app.globalData.userInfo) {
       console.log(1)
       this.setData({
         userInfo: app.globalData.userInfo,
       })
     } else if (this.data.canIUse) {
       console.log(2)
       // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
       // 所以此处加入 callback 以防止这种情况
       app.userInfoReadyCallback = res => {
         this.setData({
           userInfo: res.userInfo,
 
         })
       }
     } else {
       console.log(3)
       // 在没有 open-type=getUserInfo 版本的兼容处理
       wx.getUserInfo({
         success: res => {
           app.globalData.userInfo = res.userInfo
           this.setData({
             userInfo: res.userInfo,
           })
         }
       })
     } */


  },

  goToBuild: function () {
    wx.navigateTo({
      //传入房间验证码,
      url:`../preparing/preparing?roomNum=${this.data.inputValue.roomNum}&join=0&text=${this.data.inputValue.text}`
    })
    console.log('goto')
  },
  formSubmit: function (values) {//

    let that = this;
    let inputValue = values.detail.value;
    inputValue.userIdArr=[app.globalData.userId];
    wx.showLoading({
      title: '加载中',
    })
      /* 获取用户信息 */
      request.request('https://fl123.xyz/api/xcx/createRoom.php',inputValue,'POST')
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
    },e=>{

    }).finally(
      ()=>{
        wx.hideLoading();
      }
    )

  
   
    
    
  },

  /*   formReset() {
      console.log('form发生了reset事件')
    } */
}),

//获取表单数据以及房主个人信息发送到服务器储存
//表单必须有值输入

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;

  //不含最大值，含最小值
}

