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
    term:0,                //当前页面获取数据轮数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '排行榜',
    })

    //修改当前页面状态
    if(app.globalData.nowPage==2){
      app.globalData.nowPage = 3;
      this.setData({
        term:app.globalData.term
      })
    } else if (app.globalData.nowPage == 1){
      app.globalData.nowPage = 1;
      this.setData({
      term:app.globalData.term-1
      })
    }
    else{
      app.globalData.nowPage = 3;
      this.setData({
      term: app.globalData.term
      })
    }

    var that = this;
    //从数据库获取数据
    const db = wx.cloud.database()
    db.collection("words").where({ 
      roomNum: app.globalData.roomNum,
      term: that.data.term
    }).field({ 
      text: true, 
      supportNum: true
    }).get().then(res => {
        that.setData({
          rankMsg: res.data
        })
        console.log(res.data);
      console.log(that.data.rankMsg);
        that.orderwords();
      }
    )

    //如果是房主则将索引值改为true且当前页面为排行榜
    console.log(app.globalData.selfOpenId,'self')
    console.log(app.globalData.roomMaster,'master')
    console.log(app.globalData.nowPage,'nowpage')
    if (app.globalData.selfOpenId == app.globalData.roomMaster &&app.globalData.nowPage==3){
      this.setData({
        isroomMaster:true
      })
    }
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
    console.log(this.data.rankMsg)
  },

  again:function(){
    app.globalData.term++;
    wx.redirectTo({
      url: '../setTime/setTime?rank=1',
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