// pages/pick/pick.js
import {sort} from '../../utils/sort.js'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  showMessage:[
    { word: "词条1", num: Array(0), isgood: false, openId: 2, backColor: "rgb(255,210,210)" },
    { word: "词条1", num: Array(0), openId: 1, backColor: "rgb(255,210,210)" },
    { word: "词条1", num: Array(0), isgood: false, openId: 3, backColor: "rgb(255,228,108)" },
    { word: "词条2", num: Array(0), openId: 1, backColor: "rgb(189,218,255)" },
    { word: "词条2", num: Array(0), isgood: false, openId: 3, backColor: "rgb(202,230,241)" },
    { word: "词条2", num: Array(0), isgood: false, openId: 2, backColor: "rgb(255,228,108)" }
  ],
    //showMessage:[],
    pickMessage:[],
    index:[],
    isRank:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //this.setData({
    //  showMessage : app.globalData.showMessage
    //})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //console.log(this.data.showMessage);
    //获取显示的词条
    var showMessage = this.data.showMessage;
    //排序词条
    sort(this, showMessage);
    this.setData({
      showMessage:this.data.showMessage
    })
  },
 
  //切换到讨论区
  goDiscussing: function () {
    this.setData({
      isRank:false
    })
  },

  //切换到排行榜
  goRanking: function () {
    this.setData({
      isRank: true
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