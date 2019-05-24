// miniprogram/pages/advice/advice.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    end:'',
    isActive:false,
    value:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  addWord:function(e){
    this.data.value.push(e.detail.value);
  },

  inputAdvice:function(){
    var that = this;
    //检测输入内容是否为空
    if (!this.data.value[this.data.value.length - 1]) {
      wx.showToast({
        title: '不能为空',
        duration: 2000,
        mask: true
      })
    }
    else {
      this.setData({
        end:''
      })
      wx.showToast({
        title: '感谢',
        duration: 2000,
        mask: true
      })
      const db  = wx.cloud.database();
      db.collection('advice').add({
        data:{
          advice: that.data.value[that.data.value.length-1]
        }
      })
    }
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