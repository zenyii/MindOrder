// pages/pick/pick.js
import {sort} from '../../utils/sort.js'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showMessage:[],
    pickMessage:[],
    index:[],
    isRank:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    const db = wx.cloud.database();
    var getData = [];
    var comment = new Promise(function(resolve,reject){
      db.collection('words').get({
      success(res) {
       // console.log(res);
        getData = res.data;
        //console.log(getData);
        resolve();
        }
      })
    });
    comment.then(function(){
      //console.log(getData);
      that.setData({
        showMessage: getData
      })
      
      for(let x = 0;x < that.data.showMessage.length;x++){
        that.data.showMessage[x].isMore = false
      }
      //console.log(that.data.showMessage);
     /* //获取显示的词条
      var showMessage = that.data.showMessage;
      //排序词条
      sort(that, showMessage);
      that.setData({
        showMessage: that.data.showMessage
      })
      //console.log(that.data.showMessage);*/
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //console.log(this.data.showMessage);
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

  //点击更多标志，出现收藏评论的图标
  getMore:function(e){
    let id = e.currentTarget.id;
    this.data.showMessage[id].isMore = true;
    this.setData({
      showMessage:this.data.showMessage
    })
  },

  //点击收藏按钮后，对是否收藏进行处理
  getStar:function(e){
    let id = e.currentTarget.id;
    this.data.showMessage[id].isStar = !this.data.showMessage[id].isStar;
   /*
    const db = wx.cloud.database();
    db.collection('words').update({

    }); --数据库更新收藏数据*/
    if (this.data.showMessage[id].isStar){
      wx.showToast({
        title: '已收藏',
        duration: 1000,
        mask: true
      })
    }
    this.setData({
      showMessage:this.data.showMessage
    })
  },

  //评论词条
  sendComment:function(e){
    let id = e.currentTarget.id;
    this.data.showMessage[id]
    const db = wx.cloud.database();
    db.collection('contents').add({
      data:{
        comment:'',
        rootWord:'',
        sonCom:'',
        belong:''
      }
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