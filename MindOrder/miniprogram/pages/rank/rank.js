// miniprogram/pages/rank/rank.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rankMsg: [],
    rankColor: ['#F05959', '#F6DA2E', '#AEEDE1'],
    isroomMaster: false,
    term: 1,                     //当前页面获取数据轮数
    isAgain: false,                //判断是否继续讨论
    timer: true,                   //计时器
    startTime: 0,
    endTime: 0,
    totalTime: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '排行榜',
    })

    //修改当前页面状态
    app.globalData.nowPage = 3;
    this.setData({
      term: app.globalData.term
    })


    var that = this;
    //从数据库获取数据
    const db = wx.cloud.database()
    db.collection("words").where({
      roomNum: app.globalData.roomNum,
      term: that.data.term
    }).field({
      text: true,
      supportNum: true,
      supporter: true
    }).get().then(res => {
      that.setData({
        rankMsg: res.data
      })
      that.orderwords();
    }
    ).then(() => {
      for (let x = 0; x < that.data.rankMsg.length; x++) {
        that.data.rankMsg[x].isGood = false
        //判断support数组中是否含自己openid，如果有则改变isGood属性
        for (let y = 0; y < that.data.rankMsg[x].supporter.length; y++) {
          if (that.data.rankMsg[x].supporter[y] == app.globalData.selfOpenId) {
            that.data.rankMsg[x].isGood = true;
          }
        }
      }
      that.setData({
        rankMsg: that.data.rankMsg
      })
    })


    //如果是房主则将索引值改为true且当前页面为排行榜

    if (app.globalData.selfOpenId == app.globalData.roomMaster && app.globalData.nowPage == 3) {
      this.setData({
        isroomMaster: true
      })
    }

    //实时获取数据
    this.dataQuary();

  },
  //排行榜排序方法
  orderwords: function () {
    //let temp, temp1, temp2,i,j
    var arr = this.data.rankMsg
    arr.sort(function (a, b) { //自定义函数排序
      var a1 = a.supportNum;
      var b1 = b.supportNum;
      if (a1 < b1) {
        return 1;
      } else if (a1 > b1) {
        return -1;
      }
      return 0;
    }
    )
    this.setData({
      rankMsg: arr
    })
  },

  /* 同步房间数据 */
  dataQuary: function () {
    let that = this;
    if (!that.data.timer) return
    app.onQuery('rooms', { roomNum: app.globalData.roomNum },
      { 
        again: true,
        goSelect:true
       })
      .then(res => {
        let data = res.data[0];
        if (!data.again&&!data.goSelect) {
          setTimeout(function () {
            //要延时执行的代码
            that.dataQuary();
          }, 1000) //延迟时间
        } 
        else if(data.again) {
            app.globalData.term++;
            wx.redirectTo({
              url: '/pages/try/try'
            })
          }
        else if(data.goSelect){
          wx.redirectTo({
            url: '/pages/selectWords/selectWords'
          })
        }
      })
  },

  again: function () {
    app.globalData.term++;
    wx.redirectTo({
      url: '/pages/setTime/setTime?rank=1&placeHolderWri=1',
    })
  },

  goReport: function () {//房主视角决定总时间，会不会有人提前生成报告而无法取得时间？
    this.countAllTime();
    let date = new Date();
    let time = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;

    app.onUpdate('rooms', app.globalData.roomId, 'date', time).then(res => {
    })
    app.onUpdate('rooms',app.globalData.roomId,'goSelect',true)

  },

  //计算总时方法
  countAllTime: function () {
    let that = this;
    //获取结束讨论时间戳
    this.setData({
      endTime: Date.parse(new Date()) / 1000
    })

    app.onQuery('rooms', { _id: app.globalData.roomId }, { startTime: true }).then(res => {
      let data = res.data[0];
      that.setData({
        startTime: data.startTime,
      })
      //得出总时间
      let timediff = this.data.endTime - this.data.startTime
      //计算小时数
      let remain = timediff % 86400
      //let hours = Math.floor(remain / 3600)
      //计算分钟数
      remain = remain % 3600
      let mins = Math.floor(remain / 60)
      //计算秒数
      let secs = remain % 60;
      let totalTime = mins + ":" + secs
      app.onUpdate('rooms', app.globalData.roomId, 'totalTime', totalTime).then(res => {
      })
      //return temp;
      that.setData({
        totalTime      //保存时间差
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      timer: false
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 显示顶部刷新图标  
    wx.showNavigationBarLoading();
    wx.startPullDownRefresh();
    var that = this;
    const db = wx.cloud.database()
    db.collection("words").where({
      roomNum: app.globalData.roomNum,
      term: that.data.term
    }).field({
      text: true,
      supportNum: true,
      supporter: true
    }).get().then(res => {
      that.setData({
        rankMsg: res.data
      })
      that.orderwords();
    }
    ).then(() => {
      for (let x = 0; x < that.data.rankMsg.length; x++) {
        that.data.rankMsg[x].isGood = false
        //判断support数组中是否含自己openid，如果有则改变isGood属性
        for (let y = 0; y < that.data.rankMsg[x].supporter.length; y++) {
          if (that.data.rankMsg[x].supporter[y] == app.globalData.selfOpenId) {
            that.data.rankMsg[x].isGood = true;
          }
        }
      }
      that.setData({
        rankMsg: that.data.rankMsg
      })
    })

    setTimeout(function () {
      // 隐藏导航栏加载框  
      wx.hideNavigationBarLoading();
      // 停止下拉动作  
      wx.stopPullDownRefresh();
    }, 2000);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})