//获取应用实例
const app = getApp()
const request = require('../../requests/request');
Page({
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
      this.getRandomInt(100000, 999999)
  },
//获取房主的openid然后随链接传参给preparing，赋值在全局上！！！！！
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
      console.log('form发生了submit事件，携带数据为：', that.data.inputValue);
    },e=>{
      console.log('发送表单失败！'+e);
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

  a:function(){
    var b =  this.getRandomInt(100000, 999999);
    console.log("hhhh",b);
  },

  getRandomInt: function (min, max) {
    //获取房间号区间
    min = Math.ceil(min);
    max = Math.floor(max);
    console.log(min,max);
    //定义循环控制变量、房间号、房间号查询存在结果
    var existCrl, roomNum, queryRes
    var that = this;
    existCrl = true
    const db = wx.cloud.database()

  if (existCrl) {
      //生成随机房号
      roomNum = Math.floor(Math.random() * (max - min)) + min;
      console.log(roomNum);
      //查询房号是否存在
      var getRoomNum = new Promise(function (resolve, reject) {
        db.collection('rooms').where({
          roomNum: roomNum
        }).get({
          success:function(res){
            queryRes = res.data.length
            console.log('[数据库] [查询记录] 成功: ', res.data.length)
            console.log('生成的房号是: ', roomNum)
            console.log('test：', queryRes);
            resolve();
          }
        })
      });
      getRoomNum.then(function () {
        //房号存在，继续循环。房号不存在，返回生成的房号
        if (!queryRes) {
          console.log('测试值是：', queryRes)
          console.log(roomNum);
          that.setData({
            roomId: roomNum
          })
        } else {
          console.log('测试值是：', queryRes)
          console.log(11111);
        }
      })
    }
   }
  /*   formReset() {
      console.log('form发生了reset事件')
    } */
})
//获取表单数据以及房主个人信息发送到服务器储存
//表单必须有值输入


