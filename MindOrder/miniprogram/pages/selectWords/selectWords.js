// miniprogram/pages/selectWords/selectWords.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allMsg:[],          //存储所有数据库取出的数据
    rankMsg:[],         //根据轮数分好后存储数据并显示
    termArr:[],              //获取总轮数数据，方便前端显示，转化为数组
    rankColor: ['#F05959', '#F6DA2E', '#AEEDE1'],
    lastPlan:[],                //选择的有效方案
    isroomMaster:false          //判断是否为房主

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //判断是否为房主
    if (app.globalData.selfOpenId == app.globalData.roomMaster){
      this.setData({
        isroomMaster:true
      })
    }


    //获取轮数并转化成数组
    for(let z = 0;z < app.globalData.term ;z++){
      that.data.termArr.push(z);
    }
    this.setData({
      termArr:that.data.termArr
    })
    

    //拉取该房间内所有词条
    const db = wx.cloud.database();
    db.collection('words').where({
      roomNum:app.globalData.roomNum
    }).field({ 
      text:true,
      term:true,
      supportNum: true,
      supporter: true
    }).get().then(res=>{
      that.setData({
        allMsg:res.data
      })
      that.orderwords();
      //console.log(res.data);
    }).then(()=>{
      for (let x = 0; x < that.data.allMsg.length; x++) {
        that.data.allMsg[x].isGood = false
        //判断support数组中是否含自己openid，如果有则改变isGood属性
        for (let y = 0; y < that.data.allMsg[x].supporter.length; y++) {
          if (that.data.allMsg[x].supporter[y] == app.globalData.selfOpenId) {
            that.data.allMsg[x].isGood = true;
          }
        }
      }
      

      //初始化rankMsg数组
      for(let x = 0;x < app.globalData.term; x++){
        that.data.rankMsg[x] = [];
      }
      //将词条按照轮数分类
      for (let y = 0; y < that.data.allMsg.length; y++) {
          let obj = {
            text: that.data.allMsg[y].text,
            isGood: that.data.allMsg[y].isGood,
            supportNum:that.data.allMsg[y].supportNum
          }
          that.data.rankMsg[that.data.allMsg[y].term-1].push(obj);
        } 
      that.setData({
        rankMsg: that.data.rankMsg
      })

    })
  },

  //排行榜排序方法
  orderwords: function () {
    //let temp, temp1, temp2,i,j
    var arr = this.data.allMsg
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
      allMsg: arr
    })
    //console.log(this.data.rankMsg)
  },
  checkboxChange:function(e){
    console.log(e.detail.value);
    this.setData({
      lastPlan: e.detail.value
    })
  },
  insure:function(){
    console.log(this.data.lastPlan)
    var that = this;
    //将选择的方案作为有效方案
    wx.cloud.callFunction({
      name: 'updateComplex',
      data: {
        collect: 'rooms',
        where: { roomNum: app.globalData.roomNum},
        key: 'validPlan',
        value: that.data.lastPlan
      }
    })

    wx.redirectTo({
      url: '../report/report',
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