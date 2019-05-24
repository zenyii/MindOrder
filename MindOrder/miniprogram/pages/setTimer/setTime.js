// pages/setTime/setTime.js
import {countDown} from '../../utils/timer.js';
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    minutes:[],
    seconds:[],
    index1:'0',index2:'0',index3:'0',
    hour:'0',minute:'0',second:'0'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    for (var i = 0; i <=60; i++) {
      this.data.minutes.push(i);
    }
    for (var i = 0; i <= 60; i++) {
      this.data.seconds.push(i);
    }
    this.setData({
      minutes:this.data.minutes,
      seconds:this.data.seconds
    })
  },

   setMinutes(e) {
    this.setData({
      index2: e.detail.value
    })
  },

  setSeconds(e) {
    this.setData({
      index3: e.detail.value
    });
  },

  settime(){
    this.setData({
      minute:this.data.index2,
      second:this.data.index3
    })
    this.setData({
      index2:'0',
      index3:'0'
    })

    app.globalData.minute = this.data.minute;
    app.globalData.second = this.data.second;

    wx.navigateTo({
      url: '../try/try',
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