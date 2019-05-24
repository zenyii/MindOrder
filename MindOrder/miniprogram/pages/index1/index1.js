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
    
    this.setData({
      selected: e.selected ? e.selected : 0,
      userInfo:app.globalData.userInfo
    })

  },

    buildRoom:function() {
      let that = this;
      wx.navigateTo({
        url: '../buildRooming/buildRooming'
      })

    },
    joinRoom:function() {
      let that = this;
      wx.navigateTo({
        url: '../inputRoomId/inputRoomId'
      })
      
  },
  switchTab:function(e) {
    console.log(e,'switch')
    const data = e.currentTarget.dataset
    const url = data.path
    if(data.index === 1){
      wx.navigateTo({url:'/pages/buildRooming/buildRooming'});
      this.setData({
        selected:0
      })
    }else{
      this.setData({
        selected: data.index
      })
    }
  }
})
 



