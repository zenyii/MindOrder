 // pages/show/show.js

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userData:[],
    allMessage:[],
    showMessage:[],
    userInfo:{},
    color: ["rgb(255,210,210)", "rgb(219,218,234)", "rgb(255,228,108)", "rgb(189,218,255)", "rgb(202,230,241)"],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
        })
      }
    } else {
    //在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
          })
        }
      })
    }
    //同步UserData数据
    this.setData({
      userData: app.globalData.UserData,
    })
    var userData = this.data.userData;

    //将userData中的name属性插入词条数据中，方面后续显示
    for(var i = 0; i<userData.length;i++){
      for(var j = 0;j<userData[i].words.length;j++){
        userData[i].words[j].name = userData[i].name;
        this.data.allMessage.push(userData[i].words[j]);
      }
    }

   //将allmessage随机打乱并存储在showMessage中
    while(this.data.allMessage.length){
      var index = Math.floor(Math.random() * this.data.allMessage.length);
      this.data.showMessage.push(this.data.allMessage[index]);
      this.data.allMessage.splice(index,1);
    }

    for(var i=0;i<this.data.showMessage.length;i++){
      var index = Math.floor(Math.random()*this.data.color.length);
      this.data.showMessage[i].backColor = this.data.color[index];
    }

    this.setData({
      showMessage:this.data.showMessage
    })

    console.log(this.data.showMessage);


  },

  like:function(e){
    var count=0;
    var id = e.currentTarget.id;
    var nickName = this.data.userInfo.nickName;
    var length = this.data.showMessage[id].num.length
    //将点赞过的人的昵称存入num数组中，并处理点赞事件
    if(length){
      for(var i = 0;i<length;i++){
        if (this.data.showMessage[id].num[i]==nickName){
          this.data.showMessage[id].num.splice(i,1);
          this.data.showMessage[id].isgood=false;
          break;
        }
        count++;
      }
      if(count==length){
        this.data.showMessage[id].num.push(nickName);
        this.data.showMessage[id].isgood=true;
      }
    }
    else{
      this.data.showMessage[id].num.push(nickName);
      this.data.showMessage[id].isgood = true;
    }

    this.setData({
      showMessage: this.data.showMessage,
      isgood: this.data.showMessage[id].isgood
    })

    app.globalData.showMessage = this.data.showMessage;
    console.log(this.data.showMessage);
    /*var that = this;
    wx.request({
      url: "https://www.fl123.xyz/php/info.php",
      data: {

      },
      header: {
        "centent-type": "application/json;charset=UTF-8;"
      },
      method: 'GET',
      success:function(res){
        console.log(res);
      }
    })*/
  },
  change(){
    wx.navigateTo({
      url: '../pick/pick',
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