// miniprogram/pages/rank/rank.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rankMsg:[],
    rankColor:['#F05959','#F6DA2E','#AEEDE1'],
    isroomMaster:false,
    term:0,                     //当前页面获取数据轮数
    isAgain:false,                //判断是否继续讨论
    timer:null                   //计时器
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
      supporter:true
    }).get().then(res => {
        that.setData({
          rankMsg: res.data
        })
      console.log(that.data.rankMsg);
      that.orderwords();
      }
    ).then(()=>{
      for(let x = 0; x < that.data.rankMsg.length;x++){
        that.data.rankMsg[x].isGood = false
        //判断support数组中是否含自己openid，如果有则改变isGood属性
        for (let y = 0; y < that.data.rankMsg[x].supporter.length;y++){
          if (that.data.rankMsg[x].supporter[y]==app.globalData.selfOpenId){
              that.data.rankMsg[x].isGood = true;
          }
        }
      }
      that.setData({
        rankMsg:that.data.rankMsg
      })
      console.log(that.data.rankMsg);
    })

    //如果是房主则将索引值改为true且当前页面为排行榜
    if (app.globalData.selfOpenId == app.globalData.roomMaster &&app.globalData.nowPage==3){
      this.setData({
        isroomMaster:true
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
    //console.log(this.data.rankMsg)
  },

  /* 同步房间数据 */
  dataQuary: function () {
    let that = this;
    app.onQuery('rooms', { roomNum: app.globalData.roomNum },
      { again: true })
      .then(res => {
        let data = res.data[0];
        console.log(res.data[0]);
        that.setData({
          isAgain: data.again,
        })
        //console.log("test")
        if (!data.again) {
          that.data.timer = setTimeout(function () {
            //要延时执行的代码
            that.dataQuary();
          }, 1000) //延迟时间
        } else {//房主已经设置开始了,传入准备时间
          if (that.data.isAgain) {//如果是成员，接收到allset后直接跳转到准备时间页面
            wx.redirectTo({
              url: '../try/try'
            })
          }

        }
      })
  },

  again:function(){
    app.globalData.term++;
    wx.redirectTo({
      url: '../setTime/setTime?rank=1&placeHolderWri=1',
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
    clearTimeout(this.data.timer);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

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