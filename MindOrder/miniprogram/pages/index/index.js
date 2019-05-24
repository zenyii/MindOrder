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
      iconPath: "../../icon/build.png",
      selectedIconPath: "../../icon/build.png",
    }, {
      iconPath: "../../icon/mine.png",
      selectedIconPath: "../../icon/mineChecked.png",
      text: "我的"
    }]
  },
  //事件处理函数

  onLoad: function (e) {
    console.log(e.selected);
    app.globalData.userInfo = wx.getStorageSync('userInfo');
    app.globalData.selfOpenid = wx.getStorageSync('selfOpenid');
    this.setData({
      selected: e.selected ? e.selected : 0,
      userInfo: app.globalData.userInfo
    })

    //先查询是否有此用户记录，再创建users表
    app.onQuery('users', { openid: app.globalData.selfOpenid }, { nickName: true }).then(res => {
      let data = res.data;
      if (!data) {//如果后台没有此用户记录，则加入
        app.onAdd('users', {
          avatarUrl: app.globalData.userInfo.avatarUrl,
          hisRoom: [],
          nickName: app.globalData.userInfo.nickName,
          star: [],
          userInfo: {},
          openid: app.globalData.selfOpenid
        }).then(res => {
          console.log('创建users记录成功！')
        })
      }
    })


  },

  buildRoom: function () {
    let that = this;
    wx.navigateTo({
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
    console.log(e, 'switch')
    const data = e.currentTarget.dataset
    const url = data.path
    if (data.index === 1) {
      wx.navigateTo({ url: '/pages/buildRooming/buildRooming' });
      this.setData({
        selected: 0
      })
    } else {
      this.setData({
        selected: data.index
      })
    }
  }
})




