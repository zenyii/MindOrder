Component({
  options:{
    addGlobalClass:true,
  },
  data: {
    selected: 0,
    color: "#000000",
    selectedColor: "#4880ff",
    list: [{
      pagePath: "/pages/index/index",
      iconPath: "../icon/index.png",
      selectedIconPath: "../icon/indexChecked.png",
      text: "首页"
    }, {
      pagePath: "",
      iconPath: "../icon/build.png",
      selectedIconPath: "../icon/build.png",
    }, {
      pagePath: "/pages/index/index",
      iconPath: "../icon/mine.png",
      selectedIconPath: "../icon/mineChecked.png",
      text: "我的"
    }]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      console.log(e,'switch')
      const data = e.currentTarget.dataset
      const url = data.path
      this.setData({
        selected: data.index
      })
      data.index === 1 ? wx.navigateTo({url:'/pages/buildRooming/buildRooming'}) : wx.switchTab({url})
    }
  }
})