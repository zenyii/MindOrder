// miniprogram/pages/myDiscuss/myDIscuss.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hisRoom:[],
    titleMsg:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '我的讨论',
    })

    var selfOpenId = app.globalData.selfOpenId;
    var hisroomMsg = [];
    //从user表拉取自己参与过得话题
    const db = wx.cloud.database();
    db.collection('users').where({
      _openid:selfOpenId
    }).get().then(res=>{
        //console.log(res);
        that.setData({
          hisRoom: res.data[0].hisRoom
        })
        //console.log(that.data.hisRoom)
      }
    ).then(() => {
      //console.log(that.data.hisRoom)
      //根据拉取到的历史房间号从rooms表中拉取数据
      for (let x = 0; x < that.data.hisRoom.length; x++) {
        var roomnum = that.data.hisRoom[x];
        //console.log(roomnum);
        db.collection('rooms').where({
          roomNum: roomnum
        }).get().then(res => { 
            //console.log(res.data);
          hisroomMsg.push(res.data[0]);
            that.data.titleMsg.push(res.data[0].title);
            that.setData({
              titleMsg:that.data.titleMsg
            })
          wx.setStorage({
            key: 'hisroomMsg',
            data: hisroomMsg
            })
          })
        }
      }
    )

    

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