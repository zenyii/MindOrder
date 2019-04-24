//index.js
//获取应用实例
const app = getApp();
const utils = require('../../utils/util');
Component({
  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 0
        })
      }
    }
  },
  data: {
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数

  onLoad: function () {

  },
  methods:{
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
    buildRoom() {
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
    joinRoom() {
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
  }
},
 

})

