//获取应用实例
const app = getApp()
Page({
  data: {
    inputValue: {},
    queryRes:null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    /* 随机roomid */
    that.getRandomInt(100000, 999999);
  },

  goToBuild: function () {
    let that = this;
    /* 跳转到invite页面 */
    wx.redirectTo({
      //传入roomid,主题
      url: `../invite/invite?roomNum=${that.data.inputValue.roomNum}&text=${that.data.inputValue.text}`
    })
  },

  /* button开启房间 */
  formSubmit: function (values) {//
    let that = this;
    let userInfo = wx.getStorageSync('userInfo');
    let selfOpenId = wx.getStorageSync('selfOpenId');
    if (values.detail.value.text === "") {
      wx.showToast({
        title: '主题不能为空！',
        icon: 'none',
        duration: 2000
      })
      return
    }
    app.globalData.userInfo = userInfo;
    app.globalData.selfOpenId = selfOpenId;
    let inputValue = values.detail.value;//获取表单信息
    //inputValue.userIdArr = [app.globalData.selfOpenid];//获取用户自己的openid
    app.globalData.roomMaster = selfOpenId;//设置房主openid
    app.globalData.roomNum = String(this.data.inputValue.roomNum);//全局保存房间号
    app.globalData.title=inputValue.text;
    wx.showLoading({
      title: '加载中',
    })
    /* 插入数据 */
    app.onAdd('rooms',
      {
        title: inputValue.text,
        roomNum: String(inputValue.roomNum),
        roomMaster: { 
          openid: selfOpenId, 
          avatarUrl: app.globalData.userInfo.avatarUrl, 
          nickName: app.globalData.userInfo.nickName 
        },
        readyArr: [],
        roommates: [{ 
            openid:selfOpenId, 
            avatarUrl: app.globalData.userInfo.avatarUrl, 
            nickName: app.globalData.userInfo.nickName , 
            ready: false 
          }],
        allset: false,
        inMeeting: false,
        preparingTime: 2,
        meetingTime: 10,
        again:false,
        validPlan:[],
        startTime:0,
        totalTime:'',
        date:'',
        hasRank:false,
        hasPersonal:false,
        reportAgain:false,
        goReport:false,
        goSelect:false
      })
      .then(res => {
        app.globalData.roomId = res._id,
        that.setData({
          inputValue: inputValue
        })
      }, err => {
        console.error('[数据库] [新增room记录] 失败：', err)
      })
      .then(e => {//数据发送到服务器并反馈成功后页面跳转
        that.goToBuild();
        wx.hideLoading();
      })
  },

  /*
  * 返回一个未存在的房间号
  */

  getRandomInt: function (min, max) {
    //获取房间号区间
    min = Math.ceil(min);
    max = Math.floor(max);
    //定义循环控制变量、房间号、房间号查询存在结果
    let that = this;
    const db = wx.cloud.database()
    let roomNum = `inputValue.roomNum`
    //生成随机房号
    that.setData({
      [roomNum]: Math.floor(Math.random() * (max - min)) + min
    })
    //查询房号是否存在
    var getRoomNum = new Promise(function (resolve, reject) {
      db.collection('rooms').where({
        roomNum: that.data.inputValue.roomNum
      }).get({
        success: res => {
          that.setData({
            queryRes: res.data.length,
          })
          resolve();
        }
      })
    });
    getRoomNum.then(function () {
      //房号唯一，返回生成的房号
      if (that.data.queryRes == 0) {
        that.setData({
          roomId: that.data.inputValue.roomNum
        })
      }
      else {
        //房号不唯一，递归调用
        that.getRandomInt(100000, 999999)
      }
    })

  },

    /* 用户退出 */
    bindQuite: function () {
      let that = this;
      wx.showModal({
        title: '提示',
        content: '确定退出讨论吗？您将返回主页',
        success(res) {
          if (res.confirm) {
            wx.redirectTo({
              url: '../index/index'
            });
          } else if (res.cancel) {
  
          }
        }
      })
    },

  /* 返回到首页不刷新 */
  onUnload: function () {
    /* let pages = getCurrentPages();
    let prevPage = pages[ pages.length - 2 ];
    prevPage.setData({  // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
      selected:0
  });
    wx.navigateBack({
      delta:2 // 返回上一级页面
    }) */
    /* wx.redirectTo({
      url:'../index1/index1?selected=0'
    }) */
  }
  /*   formReset() {
      console.log('form发生了reset事件')
    } */
})
//获取表单数据以及房主个人信息发送到服务器储存
//表单必须有值输入


