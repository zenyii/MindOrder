// pages/invite/invite.js
const app = getApp();
Page({
  data: {
    inputMsg: {//保存上一页面传来的房间信息
      roomNum: 0,
      text: '',
    },
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

    //wx.hideShareMenu();
    wx.showShareMenu({
      // 要求小程序返回分享目标信息
      withShareTicket: true
    });
  },
    /* 转发 */
    onShareAppMessage: function (ops) {
      console.log(ops,'转发')
      if (ops.form === 'button') {
        console.log(ops.target, 'button');
      }
      //console.log(ops.target);
      return {
        title: this.data.inputMsg.inputTitle,
        desc: '快来加入我们的头脑风暴吧！',
        imageUrl:'../../icon/bg2.png',
        path: 'pages/preparing/preparing?join=1',//传入房间号，在后台查找进入房间
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
        wx.navigateTo({
      //传入房间验证码,
      url:`../preparing/preparing?roomNum=${this.data.inputMsg.roomNum}&join=0&text=${this.data.inputMsg.text}`
    }) 
    }
})