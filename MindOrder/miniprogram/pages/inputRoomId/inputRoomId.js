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
    queryRes:null,
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
    const db = wx.cloud.database()
    wx.showLoading({
      title: '加载中',
    })
    //根据输入房号查询房间信息
    var queryRoomNum = new Promise(function (resolve, reject) {
      db.collection('rooms').where({
        roomNum: parseInt(inputValue.roomId)
      }).get({
        success: res => {
          that.setData({
            inputValue: inputValue,
            queryRes: res.data.length
          })
          console.log('[数据库] [查询记录] 成功: ', inputValue)
          console.log('查询到的数据是: ', res.data)
          console.log('test：', that.data.queryRes)
          resolve();
        }
      })

    });
    queryRoomNum.then(function () {
      //房号，返回生成的房号
      if (that.data.queryRes == 0) {
        console.log('房间号是：', inputValue)
        wx.showToast({
          icon: 'none',
          title: '该房间号不存在，请重新输入'
        })
        //console.log('返回唯一房间号：', that.data.roomNum)
      }
      else {
        //查询到了房号，前往房间页面
        //console.log('查到了重复！重置房间号')
        that.goToBuild()
      }

    })
    // }).then(e=>{
    //   that.goToBuild()
    //   }).finally(
    //     () => {
    //       wx.hideLoading();
    //     }
    //   )
      /* 获取用户信息 */
    //   request.request('https://fl123.xyz/api/xcx/createRoom.php',inputValue,'POST','application/x-www-form-urlencoded')//根据房号搜寻房间信息
    //   .then(e=>{
    //     that.setData({
    //       inputValue: inputValue
    //     })
    //     console.log('form发生了submit事件，携带数据为：', that.data.inputValue)
    //   },e=>{
    //     console.log('发送表单失败！'+e)
    //   })
    // .then(e=>{
    //   that.goToBuild();
    //   console.log('goto')
    // },e=>{

    // }).finally(
    //   ()=>{
    //     wx.hideLoading();
    //   }
    // )
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