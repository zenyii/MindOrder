//index.js
//获取应用实例
const app = getApp();
const utils = require('../../utils/util');
Page({
  data: {
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    selected: 0,
    color: "#000000",
    selectedColor: "#4880ff",
    list: [{
      iconPath: "../../icon/index.png",
      selectedIconPath: "../../icon/indexChecked.png",
      text: "首页"
    }, {
      iconPath: "../../icon/build.png",
      selectedIconPath: "../../icon/build.png",
    }, {
      iconPath: "../../icon/mine.png",
      selectedIconPath: "../../icon/mineChecked.png",
      text: "我的"
    }]
  },
  //事件处理函数

  onLoad: function () {

  },
   /*  getUserInfo() {
      let that = this;
      return new utils.promise((resolve, reject) => {
        app.getUserInfo().then(e => {
          //console.log(e, 'userinfo')
          console.log('用户信息获取成功')
          resolve(e);
        }, e => {
          console.log('用户信息获取失败！')
          reject(e)
        })
      }) 
    },*/
    buildRoom:function() {
      let that = this;
      wx.navigateTo({
        url: '../buildRooming/buildRooming'
      })
     /*  that.getUserInfo().then(e => {
        wx.navigateTo({
          url: '../buildRooming/buildRooming'
        })
      },e=>{
  
      }) */
    },
    joinRoom:function() {
      let that = this;
      wx.navigateTo({
        url: '../inputRoomId/inputRoomId'
      })
      /* that.getUserInfo().then(e => {
        wx.navigateTo({
          url: '../inputRoomId/inputRoomId'
        })
      },e=>{
        
      }) 
    }*/
  },
  switchTab:function(e) {
    console.log(e,'switch')
    const data = e.currentTarget.dataset
    const url = data.path
    this.setData({
      selected: data.index
    })
    data.index === 1 ? wx.navigateTo({url:'/pages/buildRooming/buildRooming'}) :''
  }
})
 



