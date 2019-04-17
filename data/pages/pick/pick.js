// pages/pick/pick.js
import {sort} from '../../utils/sort.js'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  showMessage:[
    { word: "词条1", num: Array(0), isgood: false, name: "用户2", backColor: "rgb(255,210,210)" },
    { word: "词条1", num: Array(0), name: "用户1", backColor: "rgb(255,210,210)" },
    { word: "词条1", num: Array(0), isgood: false, name: "用户3", backColor: "rgb(255,228,108)" },
    { word: "词条2", num: Array(0), name: "用户1", backColor: "rgb(189,218,255)" },
    { word: "词条2", num: Array(0), isgood: false, name: "用户3", backColor: "rgb(202,230,241)" },
     { word: "词条2", num: Array(0), isgood: false, name: "用户2", backColor: "rgb(255,228,108)" }
  ],
    //showMessage:[],
    pickMessage:[],
    index:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //this.setData({
     // showMessage : app.globalData.showMessage
    //})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //console.log(this.data.showMessage);
    var showMessage = this.data.showMessage;
    sort(this, showMessage);
    this.setData({
      showMessage:this.data.showMessage
    })
  },
 
  insuretitle:function(e){
    this.data.index.push(e.detail.value);
  },

  insurelast:function(){
    this.data.pickMessage.push(this.data.index[this.data.index.length - 1]);
    this.setData({
      pickMessage: this.data.pickMessage
    })
    app.globalData.pickMessage = this.data.pickMessage[this.data.pickMessage.length-1]
    wx.navigateTo({
      url: '../lastTitle/lastTitle',
    })
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