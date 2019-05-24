// miniprogram/pages/wirtePlan/writePlan.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Plan:[],
    end:'',
    value:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  //用户输入
  editPlan:function(e){
    this.data.value.push(e.detail.value);
  },

  //点击确认键后保存方案
  surePlan:function(){
    //检测输入内容是否为空
    if (!this.data.value[this.data.value.length - 1]) {
      wx.showToast({
        title: '不能为空',
        duration: 1000,
        mask: true
      })
    }
    else {
      //发送后输入框清空
      this.setData({
        end: '',
      })

    var context = this.data.value[this.data.value.length - 1];

    var obj={
      content: context,
      nickName: "zenyi"//app.globalData.userInfo.nickName
    };
    this.data.Plan.push(obj);
    this.setData({
      Plan:this.data.Plan
    })
    //存入数据库
    const db = wx.cloud.database();
    db.collection('scheme').add({
      data:{
        author: "zenyi",  //app.globalData.userInfo.nickName
        content: context,
        roomNum:app.globalData.roomNum,
        supportNum:'',
        supporter:[
          {
            avatarUrl:'',
            nickName:'',
            openid:''
          }
        ]
      }
    })
    }
  },

  nextPage:function(){
    wx.navigateTo({   
      url: "/pages/showPlan/showPlan"
    })
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