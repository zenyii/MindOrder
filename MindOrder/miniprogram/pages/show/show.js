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
    words: [],
    queryRes: null,//词条点赞者openID数组
    querywordsId: null,//点赞词条的_id
    color: ["#8AACFF", "#A6B1F0", "#9AE3F0", "#AEEDE1", "#F8DC2E"],
    title:'',
    timer:true,
    windowHeight:''        //设备高度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '点赞区',
    })

    var windowHeight = wx.getSystemInfoSync().windowHeight;//获取设备高度
    this.setData({
      windowHeight: windowHeight
    })

    //修改当前页面状态
    app.globalData.nowPage = 2;

    const db = wx.cloud.database();
    var that = this;
    db.collection('words').where({
        roomNum:app.globalData.roomNum,
        term:app.globalData.term   //根据轮数取出数据
      }).get({
      success(res){
        that.setData({
          showMessage:res.data,
          title:app.globalData.title
        })
        for(let x = 0;x < that.data.showMessage.length;x++){
          that.data.showMessage[x].isLike = false
        }
      }
    })
    //实时同步数据
    this.dataQuary();
  },

  //点赞
  like:function(e){
    var count=0;
    var id = e.currentTarget.id;
    var openId = app.globalData.selfOpenId;
    var length = this.data.showMessage[id].supporter.length;
    var roomNumber = app.globalData.roomNum;
    var that = this;
    //将点赞过的人的昵称存入supporter数组中，并处理点赞事件
    if (length) {
      for (var i = 0; i < length; i++) {
        if (this.data.showMessage[id].supporter[i] == openId) {
          this.data.showMessage[id].supporter.splice(i, 1);
          this.data.showMessage[id].isgood = false;
          break;
        }
        count++;
      }
      if (count == length) {
        this.data.showMessage[id].supporter.push(openId);
        this.data.showMessage[id].isgood = true;
      }
    }
    else {
      this.data.showMessage[id].supporter.push(openId);
      this.data.showMessage[id].isgood = true;
    }

    this.setData({
      showMessage: this.data.showMessage,
      isgood: this.data.showMessage[id].isgood
    })


    /*
      *为词条添加点赞数据
      */
    const db = wx.cloud.database()
    const _ = db.command
    //查询该词条的点赞信息是否存在
    var updateSupport = new Promise(function (resolve, reject) {
      db.collection('words').where({
        //使用时填词条的查询条件
        // "author":that.data.showMessage[id].openId,
        // "content": that.data.showMessage[id].word,
        // "roomNum": roomNumber,

        //测试数据，用时注释
        _id: that.data.showMessage[id]._id
      }).get({
        success: res => {
          //获取查询信息
          that.setData({
            queryRes: res.data[0].supporter,
            querywordsId: res.data[0]._id
          })
          resolve();
        }
      })
    });
    updateSupport.then(function () {
      //检查使用者openID是否在词条点赞者中
      let index = that.inarray(app.globalData.selfOpenId, that.data.queryRes)
      //如果赞过
      if (index != -1) {
        /*that.data.showMessage[id].isLike = false;
        that.setData({
          showMessage: that.data.showMessage,
        })*/
        //点赞中删除点赞用户
        that.data.queryRes.splice(index, 1)
        db.collection('words').doc(that.data.querywordsId).update({
          data: {
            //自减一
            supportNum: _.inc(-1),
            supporter: _.set(
              that.data.queryRes
            )
          }
        })
      }
      else {
        //没赞过
        db.collection('words').doc(that.data.querywordsId).update({
          data: {
            //自增一
            supportNum: _.inc(1),
            supporter: _.push(openId)
          },
          success: res => {
          }
        })
        //that.getRandomInt(100000, 999999)
      }
    })
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
  inarray: function (index, array) {
    let i
    for (i = 0; i < array.length; i++) {
      if (array[i] == index) {
        return i
      }
    }
    return -1
  },
  change(){
    wx.redirectTo({
      url: '/pages/rank/rank',
    })
  },

  /* 同步房间数据 */
  dataQuary: function () {
    let that = this;
    if(!that.data.timer) return
    app.onQuery('rooms', { roomNum: app.globalData.roomNum },
      { again: true })
      .then(res => {
        let data = res.data[0];
        that.setData({
          isAgain: data.again,
        })
        if (!data.again) {
          setTimeout(function () {
            //要延时执行的代码
            that.dataQuary();
          }, 1000) //延迟时间
        } else {//房主已经设置开始了,传入准备时间
          if (that.data.isAgain) {//如果是成员，接收到allset后直接跳转到准备时间页面
          app.globalData.term++;
            wx.redirectTo({
              url: '/pages/try/try'
            })
          }

        }
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
    this.setData({
      timer:false
    })
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