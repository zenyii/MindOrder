// pages/try/try.js
import {countDown} from '../../utils/timer.js'

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: [],
    end: '',
    userInfo: {},
    message: [],
    upDateUser: [],
    combineUser:[],
    minute:'',
    second:'',
    timer:0,
    position:[],
    totalHeight:0,
    windowWidth:0,
    windowHeight: 0,
    isActive:false,
    ifColor:false,
    backColor: "rgb(255,210,210)",
    show:null,
    color: ["rgb(255,210,210)", "rgb(219,218,234)", "rgb(255,228,108)", "rgb(189,218,255)","rgb(202,230,241)"],
    isEdit: false,
    isCheck:false,
    selectedIndex: 0, 
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    var that = this;
    //获取屏幕宽度以及计算屏幕换算rpx值
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowWidth:res.windowWidth,
          windowHeight:res.windowHeight,
        })
      },
    })

    //获取时间数据
    this.setData({
      minute:app.globalData.minute,
      second:app.globalData.second
    })
    this.setData({
      timer:parseInt(this.data.minute)*60+parseInt(this.data.second)
    })
                                                
    //获取用户昵称和已存储信息
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        //upDateUser : app.globalData.UserData
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          //upDateUser: app.globalData.UserData
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            //upDateUser: app.globalData.UserData
          })
        }
      })
    }

  },
  //点击键盘按钮出发输入框
  inputWord:function(){
    this.setData({
      isActive:true,
    })
  },

  //双向绑定输入词条数据
  addWord: function(e) {
   //console.log(e.detail.value);
    this.data.value.push(e.detail.value);
  },

  goEdit:function(){
    this.setData({
      isEdit:true
    })
  },

  changeColor:function(){
    var temp = this.data.ifColor?false:true;
    this.setData({
      ifColor:temp
    })
    var animation = null;
    animation = wx.createAnimation({
      duration:1000,
      timingFunction:"ease"
    });
    if (this.data.ifColor) {
      animation.translateY(-30).translateX(70).opacity(1).scale(1.2, 1.2).step();
    this.setData({show:animation.export()})
    }
    else{
      animation.translateY(30).translateX(-70).opacity(0).scale(1,1).step();
      this.setData({ show: animation.export() })
    }
  },

  selectColor:function(e){
    var index = e.currentTarget.id;
    this.setData({
      backColor:index
    })
  },

  newpaper: function() {
    //检测输入内容是否为空
    if (!this.data.value[this.data.value.length - 1]){
      wx.showToast({
        title: '不能为空',
        duration: 1000,
        mask: true
      })
    }
    else{
    //发送后输入框清空
      this.setData({
        end: '',
      })

   //将新建对象存入UserData数组中
    var newUser = {};
    newUser.openId = app.globalData.openId;

    newUser.words = new Array();
      var obj = {
        word: '',
        num: [],
        backColor : this.data.backColor,
        isModify:false
      }
      obj.word = this.data.value[this.data.value.length - 1];
      this.data.value=[];
      newUser.words.push(obj);
      var checkNum = 0;
      //若有openId属性重复的，则只插入词条数据
      for (var j = 0; j < app.globalData.UserData.length; j++) {
        if (newUser.openId == app.globalData.UserData[j].openId) {
          app.globalData.UserData[j].words.push(obj);
          break;
        }
        checkNum++;
      }
      //若无openId属性重复，则插入新对象
      if (checkNum == app.globalData.UserData.length){
        app.globalData.UserData.push(newUser);
      }
      this.data.upDateUser.push(newUser);
      this.setData({
        upDateUser: this.data.upDateUser,
      });
      //console.log(this.data.upDateUser);
    }

  },
  cancelEdit:function(){
    this.setData({
      isEdit:false
    })
  },
  checkText:function(){
    this.setData({
      isCheck:true
    })
  },
  cancelCheck:function(){
    this.setData({
      isCheck:false
    })
  },
  deleteWord:function(){
    var that = this;
    wx.showActionSheet({
      itemList: ["删除"],
      itemColor:"red",
      success(res){
        if(res.tapIndex===0){
          that.data.upDateUser[0].words.splice(that.data.selectedIndex, 1);
          that.setData({
            upDateUser: that.data.upDateUser
          })
        }
      }
    })
   
  },
  scrollSelect:function(e){
    var that = this;
    var paper;
    var paperSize;
    var lengthToLeft;
    var remainWidth;

    return new Promise(function(res,rej){
      for (var i = 0; i < that.data.upDateUser[0].words.length;i++){
      that.data.upDateUser[0].words[i].select = false;
    }
    var systemInfo = wx.getSystemInfoSync();
    paper = that.data.upDateUser[0].words;
    paperSize = 660;
    lengthToLeft = (e.detail.scrollLeft) * 750 / systemInfo.windowWidth;
    that.data.selectedIndex = Math.floor(lengthToLeft/paperSize);
    remainWidth = lengthToLeft / systemInfo.windowWidth;
      res(systemInfo.windowWidth);
    })
      .then((windowWidth) => {
        if (remainWidth < 0.8 * windowWidth) {
        this.data.upDateUser[0].words[this.data.selectedIndex].select = true;
      }
      //console.log(selectedIndex,remainWidth, windowWidth)
      this.setData({
        upDateUser: this.data.upDateUser,
        selectedIndex:this.data.selectedIndex
      })
      //console.log(this.data.upDateUser[0].words);
    })
  },
  EditWord:function(){
    //console.log(this.data.selectedIndex);
    var that = this;
    return new Promise(function(res,rej){
      for (var i = 0; i < that.data.upDateUser[0].words; i++) {
        that.data.upDateUser[0].words[i].isModify = false;
      }
      res();
    }).then(()=>{
      this.data.upDateUser[0].words[this.data.selectedIndex].isModify =  true;

      this.setData({
        upDateUser: this.data.upDateUser
      })
    })
  },

  insure:function(){
    if (!this.data.value[this.data.value.length - 1]) {
      wx.showToast({
        title: '无修改内容',
        duration: 500,
        mask: true
      })
    }
    else {
      this.data.upDateUser[0].words[this.data.selectedIndex].word = this.data.value[this.data.value.length - 1];
    this.data.value = [];
    this.data.upDateUser[0].words[this.data.selectedIndex].isModify=false
    this.setData({
      upDateUser:this.data.upDateUser
    })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    countDown(this);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})