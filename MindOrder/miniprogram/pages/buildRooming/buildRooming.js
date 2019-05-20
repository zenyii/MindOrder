//获取应用实例
const app = getApp()
const request = require('../../requests/request');
Page({
  data: {
    roomId: 0,
    queryRes:null,
    roomNum:null,
    // redBorder:false,
    inputValue: {},
    //canIUse: wx.canIUse('button.open-type.getUserInfo'),
    /*     code: '',
        encryptedData: '',
        iv: '' */
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRandomInt(100000, 999999)
    

    /* 初始化，载入现存的用户数据
      if (app.globalData.userInfo) {
       console.log(1)
       this.setData({
         userInfo: app.globalData.userInfo,
       })
     } else if (this.data.canIUse) {
       console.log(2)
       // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
       // 所以此处加入 callback 以防止这种情况
       app.userInfoReadyCallback = res => {
         this.setData({
           userInfo: res.userInfo,
 
         })
       }
     } else {
       console.log(3)
       // 在没有 open-type=getUserInfo 版本的兼容处理
       wx.getUserInfo({
         success: res => {
           app.globalData.userInfo = res.userInfo
           this.setData({
             userInfo: res.userInfo,
           })
         }
       })
     } */
  },

//获取房主的openid然后随链接传参给preparing，赋值在全局上！！！！！
  goToBuild: function () {
    wx.navigateTo({
      //传入房间验证码,
      url:`../preparing/preparing?roomNum=${this.data.inputValue.roomNum}&join=0&text=${this.data.inputValue.text}`
    })
    console.log('goto')
  },

   /*
   *  创建房间
   */
  formSubmit: function (values) {//
    let that = this;
    let inputValue = values.detail.value;
    inputValue.userIdArr=[app.globalData.userId];
    wx.showLoading({
      title: '加载中',
    })
    
    //数据库创建房间
    const db = wx.cloud.database()
    db.collection('rooms').add({
      //添加的信息
      data: {
          roomNum:parseInt(inputValue.roomNum),
          title: inputValue.text,
          userIdArr: inputValue.userIdArr
      }
    })
    .then(res=>{
      that.setData({
        inputValue: inputValue
      })
      console.log('form发生了submit事件，携带数据为：', that.data.inputValue);
    })
    .then(e=>{
      that.goToBuild();
    },e=>{
    }).finally(
      ()=>{
        wx.hideLoading();
      }
    ) 
  },


  /*
   *  返回一个未存在的房间号
   */
  getRandomInt:function(min, max) {
    
      //获取房间号区间
      min = Math.ceil(min);
      max = Math.floor(max);
      //定义循环控制变量、房间号、房间号查询存在结果
      let that = this
      const db = wx.cloud.database()
      //生成随机房号
      that.setData({
        roomNum: Math.floor(Math.random() * (max - min)) + min
      })
      //查询房号是否存在
      var getRoomNum = new Promise(function (resolve, reject) {
          db.collection('rooms').where({
            roomNum: that.data.roomNum
          }).get({
            success: res=>{
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
      getRoomNum.then(function(){
        //房号唯一，返回生成的房号
        if (that.data.queryRes == 0) {
          //console.log('返回房间号是：', that.data.roomNum)
          that.setData({
            roomId: that.data.roomNum
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
})
//获取表单数据以及房主个人信息发送到服务器储存
//表单必须有值输入


