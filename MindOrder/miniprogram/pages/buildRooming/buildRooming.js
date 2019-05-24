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
    //console.log('goto')
  },

  /* button开启房间 */
  formSubmit: function (values) {//
    let that = this;
    let userInfo = wx.getStorageSync('userInfo');
    app.globalData.userInfo = userInfo;
    //console.log( aa,'userInfo');
    let inputValue = values.detail.value;//获取表单信息
    //inputValue.userIdArr = [app.globalData.selfOpenid];//获取用户自己的openid
    app.globalData.roomMaster = app.globalData.selfOpenid;//设置房主openid
    app.globalData.roomNum = String(this.data.inputValue.roomNum);//全局保存房间号
    wx.showLoading({
      title: '加载中',
    })
    /* 插入数据 */
    app.onAdd('rooms',
      {
        title: inputValue.text,
        roomNum: String(inputValue.roomNum),
        roomMaster: { openid: app.globalData.roomMaster, avatarUrl: app.globalData.userInfo.avatarUrl, nickName: app.globalData.nickName },
        readyArr: [],
        roommates: [{ openid:app.globalData.roomMaster, avatarUrl: app.globalData.userInfo.avatarUrl, nickName: app.globalData.nickName , ready: false }],
        allset: false,
        inMeeting: false,
        preparingTime: 2,
        meetingTime: 10
      })
      .then(res => {
        console.log(res);
        console.log('[数据库] [新增room记录] 成功，记录 _id: ', res._id)
        that.setData({
          [app.globalData.roomId]: res._id,
          inputValue: inputValue
        })
        console.log('form发生了submit事件，携带数据为：', that.data.inputValue);
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
          //console.log('[数据库] [查询记录] 成功: ', res.data.length)
          //console.log('生成的房号是: ', that.data.roomNum)
          //console.log('test：', that.data.queryRes)
          resolve();
        }
      })
    });
    getRoomNum.then(function () {
      //房号唯一，返回生成的房号
      if (that.data.queryRes == 0) {
        //console.log('返回房间号是：', that.data.roomNum)
        that.setData({
          roomId: that.data.inputValue.roomNum
        })
        //console.log('返回唯一房间号：', that.data.roomNum)
      }
      else {
        //房号不唯一，递归调用
        //console.log('查到了重复！重置房间号')
        that.getRandomInt(100000, 999999)
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


