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
    backColor: "#8AACFF",
    show:null,
    color: ["#8AACFF", "#A6B1F0", "#9AE3F0", "#AEEDE1","#F8DC2E"],
    isEdit: false,
    isCheck:false,
    selectedIndex: 0, 
    term: 0,              //轮数获取  
    rankMsg: [],
    rankColor: ['#F05959', '#F6DA2E', '#AEEDE1'],
    isroomMaster: false,
    isAgain: false,                //判断是否继续讨论
    timer: null,                   //计时器
    isRank:false,                  //判断是否查看排行榜
    colorRender:false,             //色板是否渲染
    step:0,                        //记录当前便签内容每一输入操作的位置
    ifBack:false,                 //是否能进行后退操作
    isGo:false,                   //是否能进行前进操作
    title:'',
    }, 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    //修改当前页面状态
    app.globalData.nowPage = 1;

    //获取当前轮数
    this.setData({
      term:app.globalData.term
    })

    var that = this;
    //获取屏幕宽度以及计算屏幕换算rpx值
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowWidth:res.windowWidth,
          windowHeight:res.windowHeight,
          title:app.globalData.title
        })
      },
    })
    
    //获取时间数据
    const db = wx.cloud.database();
    db.collection('rooms').where({
      roomNum: app.globalData.roomNum
    }).field({
      meetingTime: true
    }).get().then(res => {
      let minutes = res.data[0].meetingTime.toString();
      that.setData({
        minute: minutes,
        second: '0'
      });
    }).then(() => {
      that.setData({
        timer: parseInt(that.data.minute) * 60 + parseInt(that.data.second)
      })
      countDown(that);
    })

    var that = this;
    //从数据库获取数据
    if(this.data.term>1){
    db.collection("words").where({
      roomNum: app.globalData.roomNum,
      term: that.data.term-1
    }).field({
      text: true,
      supportNum: true,
      supporter: true
    }).get().then(res => {
      that.setData({
        rankMsg: res.data
      })
      that.orderwords();
    }
    ).then(() => {
      for (let x = 0; x < that.data.rankMsg.length; x++) {
        that.data.rankMsg[x].isGood = false
        //判断support数组中是否含自己openid，如果有则改变isGood属性
        for (let y = 0; y < that.data.rankMsg[x].supporter.length; y++) {
          if (that.data.rankMsg[x].supporter[y] == app.globalData.selfOpenId) {
            that.data.rankMsg[x].isGood = true;
          }
        }
      }
      that.setData({
        rankMsg: that.data.rankMsg
      })
    })
    }
    //更改再次讨论变量，方便复用
    app.onUpdate('rooms', app.globalData.roomId, 'again', false);
  },
  //排行榜排序方法
  orderwords: function () {
    //let temp, temp1, temp2,i,j
    var arr = this.data.rankMsg
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
      rankMsg: arr
    })
  },

  //点击键盘按钮出发输入框
  inputWord:function(){
    this.setData({
      isActive:true,
    })
  },

  //双向绑定输入词条数据
  addWord: function(e) {
    this.data.value.push(e.detail.value);
    this.setData({
      end:e.detail.value
    })
    if(this.data.value.length&&this.data.step){
      this.setData({
        ifBack:true,
        step:this.data.value.length-1
      })
    }
    else if(!this.data.step){
      this.setData({
        ifBack: true,
        step: this.data.value.length - 1
      })
    }
    
  },

  //退回上一步的操作
  goBack:function(){
    this.data.step--;
    if(this.data.step>=0){
      let changeWord = this.data.value[this.data.step];
      this.setData({
        end: changeWord
      })
    }
    //回退后检查是否可以再回退
    if(this.data.step<0){
      this.setData({
        ifBack:false,
        end:""
      })
    }
    //回退后步骤检查是否可以前进
    if(this.data.step <this.data.value.length- 1){
      this.setData({
      ifGo: true,
    })
    }
    else{
      this.setData({
      ifGo: false,
    })
  }
  },

  //前进一步操作
  goHead:function(){
    this.data.step++;
    if(this.data.step<=this.data.value.length-1){
      let changeWord = this.data.value[this.data.step];
      this.setData({
        end: changeWord,
        ifBack:true
      })
    }   
    //前进后步骤检查是否可以前进
    if (this.data.step < this.data.value.length - 1) {
      this.setData({
        ifGo: true,
      })
    }
    else {
      this.setData({
        ifGo: false,
      })
    }
  },

  //控制编辑版面出现
  goEdit:function(){
    this.setData({
      isEdit:true
    })
  },

  //点击换颜色后色板弹出动画
  changeColor:function(){
    var that = this;
    var temp = this.data.ifColor?false:true;
    this.setData({
      ifColor:temp
    })
    var animation = null;
    animation = wx.createAnimation({
      duration:1000,
      timingFunction:"ease"
    });
    //色板弹出动画
    if (this.data.ifColor) {
      animation.translateY(-30).translateX(70).opacity(1).scale(1.2, 1.2).step();
    this.setData({show:animation.export()})
    }
    //色板收回动画
    else{
      animation.translateY(30).translateX(-70).opacity(0).scale(1,1).step();
      this.setData({ show: animation.export() })
    }
    let render = that.data.colorRender ? false : true;
      this.setData({
        colorRender: render
      })

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
        ifBack:false,
        ifGo:false
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
      this.setData({
        value : []
      })
      newUser.words.push(obj);
      var checkNum = 0;
      //将新增词条写入数据库
      var that = this;
      const db = wx.cloud.database();
      db.collection('words').add({
        data: {
          roomNum: app.globalData.roomNum,              //所属房间
          text: obj.word,                               //词条内容
          backColor: that.data.backColor,               //词条背景颜色
          title: app.globalData.title,                 //词条作者名称
          avatarUrl:app.globalData.userInfo.avatarUrl, //词条作者头像
          term: app.globalData.term,          //轮数记录
          supporter: [],                        //点赞者存放数组
          supportNum: 0,                          //存取点赞数  
          openid:app.globalData.selfOpenId,   //词条作者的openid
        }
      })
      //若有openId属性重复的，则只插入词条数据
      for (var j = 0; j < app.globalData.UserData.length; j++) {
        //插入词条内容
        if (newUser.openId == app.globalData.UserData[j].openId) {
          app.globalData.UserData[j].words.push(obj);
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
    const db = wx.cloud.database();
    var textId = ''
    var delword = this.data.upDateUser[0].words[that.data.selectedIndex].word;

    wx.showActionSheet({
      itemList: ["删除"],
      itemColor:"red",
      success(res){
        if(res.tapIndex===0){
          that.data.upDateUser[0].words.splice(that.data.selectedIndex, 1);
          that.setData({
            upDateUser: that.data.upDateUser
          })
          var get = new Promise(function (resolve, reject) {
            db.collection('words').where({
              text: delword
            }).get({
              success: function (res) {
                textId = res.data[0]._id;
                resolve();
              }
            })
          });
          get.then(function () {
            db.collection('words').doc(textId).remove({
              success(res) {

              }
            })
          }
          )
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
        if (that.data.selectedIndex >= 0 && that.data.selectedIndex < that.data.upDateUser[0].words.length){
        if (remainWidth < 0.8 * windowWidth) {
          that.data.upDateUser[0].words[that.data.selectedIndex].select = true;
        }
      }
      this.setData({
        upDateUser: this.data.upDateUser,
        selectedIndex:this.data.selectedIndex
      })
    })
  },
  EditWord:function(){
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
      wx.showToast({
        title: '已修改',
        duration: 500,
        mask: true
      })
      this.data.upDateUser[0].words[this.data.selectedIndex].word = this.data.value[this.data.value.length - 1];
    this.data.value = [];
    this.data.upDateUser[0].words[this.data.selectedIndex].isModify=false
    this.setData({
      upDateUser:this.data.upDateUser
    })
    }
  },

  getRank:function(){
    var that = this;
    //若第一轮或上一轮没有数据则不跳转页面
    if(app.globalData.term<2 || !this.data.rankMsg.length){
      wx.showToast({
        title: '无数据',
        duration: 1000,
        mask: true
      })
    }else{       //排行榜有数据
      let temp = that.data.isRank? false:true;
      that.setData({
        isRank:temp
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
