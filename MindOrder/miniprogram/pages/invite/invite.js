
// pages/invite/invite.js
const app = getApp();
Page({
  data: {
    inputMsg: {//保存上一页面传来的房间信息
      roomNum: '',
      text: '',
    },
    title: 'qrcode',
    step: 1,
    counterId: '',
    openid: '',
    count: null,
    queryResult: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    /* 获取链接数据 */
    let inputMsg = this.data.inputMsg;
    inputMsg.roomNum = e.roomNum;
    inputMsg.text = e.text;
    this.setData({
      inputMsg: inputMsg,
    });
    /* 隐藏右上角分享按钮 */
    //wx.hideShareMenu();
    //wx.hideShareMenu();
    wx.showShareMenu({
      // 要求小程序返回分享目标信息
      withShareTicket: true
    });
  },
    /* 转发 */
    onShareAppMessage: function (ops) {
      let that = this;
      console.log(ops,'转发')
      if (ops.form === 'button') {
        console.log(ops.target, 'button');
      }
      //console.log(ops.target);
      return {
        title: that.data.inputMsg.inputTitle,
        desc: '快来加入我们的头脑风暴吧！',
        imageUrl:'../../icon/bg2.png',
        path: `/pages/preparing/preparing?join=1&roomNum=${that.data.inputMsg.roomNum}`,//传入房间号，在后台查找进入房间
        success: function (e) {
          console.log('转发成功' + JSON.stringify(e));
          var shareTickets = res.shareTickets;
           if (shareTickets.length == 0) {
             console.log(shareTickets,'shareTickets')
             return false;
           }
           //可以获取群组信息
           wx.getShareInfo({
             shareTicket: shareTickets[0],
             success: function (res) {
               console.log(res)
             }
           })
        },
        fail: function (e) {
          console.log('转发失败' + JSON.stringify(e))
        }
  
      }
    },
/* 加入讨论室 */
    joinRoom:function(){
        let that = this;
    wx.showToast({
      title: '加油创建中！',
      icon:'loading',
      mask: true,
      duration: 2000,
      success:function(){//返回首页
        setTimeout(function () {
          //要延时执行的代码
          wx.redirectTo({
            //传入房间验证码,
            url:`../preparing/preparing?roomNum=${that.data.inputMsg.roomNum}&join=0&text=${that.data.inputMsg.text}`
          }) 
        }, 2000) //延迟时间
        
      }
    })
    },

  onCreateLimit() {
    this.create('limit')
  },

  async create(type = 'square') {
    wx.showLoading({
      title: '加载中',
    })

    try {
      const res = await wx.cloud.callFunction({
        name: 'wxaqrcode',
        data: {
          type
        }
      })

      wx.hideLoading()
      const result = res.result

      if (result.code) {
        wx.showToast({
          title: result.msg,
          icon: 'none'
        })
        return
      }

      this.setData({ qrSource: result.fileID })
    } catch (err) {
      wx.hideLoading()
      wx.showToast({
        title: '生成失败！',
        icon: 'none',
        duration: 3000
      })
    }
  },
})