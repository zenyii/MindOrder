//index.js
//获取应用实例
const app = getApp();
Page({
  data: {
    userInfo: {},
    selected: 0,
    color: "#000000",
    selectedColor: "#4880ff",
    list: [{
      iconPath: "../../icon/index.png",
      selectedIconPath: "../../icon/indexChecked.png",
      text: "首页"
    }, {
      iconPath: "../../icon/arrowbg.png",
      selectedIconPath: "../../icon/arrowbg.png",
    }, {
      iconPath: "../../icon/mine.png",
      selectedIconPath: "../../icon/mineChecked.png",
      text: "我的"
    }]
  },
  //事件处理函数

  onLoad: function (e) {
    let that =this;
    app.globalData.userInfo = wx.getStorageSync('userInfo');
    app.globalData.selfOpenId = wx.getStorageSync('selfOpenId');
    this.setData({
      selected: e.selected ? e.selected : 0,
      userInfo: app.globalData.userInfo
    })
  },

  buildRoom: function () {
    let that = this;
    wx.redirectTo({
      url: '../buildRooming/buildRooming'
    })

  },
  joinRoom: function () {
    let that = this;
    wx.navigateTo({
      url: '../inputRoomId/inputRoomId'
    })

  },
  switchTab: function (e) {
    const data = e.currentTarget.dataset
    const url = data.path
    if (data.index === 1) {
      wx.redirectTo({ url: '/pages/buildRooming/buildRooming' });
      this.setData({
        selected: 1
      })
    } else {
      this.setData({
        selected: data.index
      })
    }
  }
})




