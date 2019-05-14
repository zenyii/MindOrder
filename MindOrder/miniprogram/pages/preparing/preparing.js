//index.js
//获取应用实例
const app = getApp();//返回询问是否退出！，删除的那个用户要强制退出房间
Page({//
  data: {
    timeRange: [],
    index: 0,
    join: 1,
    allSet: true,
    inputMsg: {//保存上一页面传来的房间信息
      roomNum: 0,
      text: '',
    },
    buttonText: '',
    dotsWidth: 0,
    currentSwiper: 0,
    userInfo: [{
      avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/lXib4ldvq8FjEs2ac7bECPHiapHk12Haykf2vcIGcsy7wErYDDm4sQowgr5kFiaJBgFeNGhUHacCKKWPt2JQ3SjAQ/132",
      nickName: "李me薇",
      openId: 'oGw5W49WSt-HbdVgfbSxykI8SC0',
      ready: false,
      index: 0
    },
    {
      avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/lXib4ldvq8FjEs2ac7bECPHiapHk12Haykf2vcIGcsy7wErYDDm4sQowgr5kFiaJBgFeNGhUHacCKKWPt2JQ3SjAQ/132",
      nickName: "李meme薇",
      ready: false,
      openId: 'oGw5W49StN-HbdVgfbSxykI8SC0',
      index: 1
    },
    {
      avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/lXib4ldvq8FjEs2ac7bECPHiapHk12Haykf2vcIGcsy7wErYDDm4sQowgr5kFiaJBgFeNGhUHacCKKWPt2JQ3SjAQ/132",
      nickName: "李薇",
      openId: 'oGwW49WStN-HbdVgfbSxykI8SC0',
      ready: false,
      index: 2
    },
    {
      avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/lXib4ldvq8FjEs2ac7bECPHiapHk12Haykf2vcIGcsy7wErYDDm4sQowgr5kFiaJBgFeNGhUHacCKKWPt2JQ3SjAQ/132",
      nickName: "李薇",
      openId: 'oGw5W4WStN-HbdVgfbSxykI8SC0',
      ready: false,
      index: 3
    },
    {
      avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/lXib4ldvq8FjEs2ac7bECPHiapHk12Haykf2vcIGcsy7wErYDDm4sQowgr5kFiaJBgFeNGhUHacCKKWPt2JQ3SjAQ/132",
      nickName: "李薇",
      openId: 'oGw5W49WStN-HbdVgfbSxykI8SC0',
      ready: false,
      index: 4
    },
    {
      avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/lXib4ldvq8FjEs2ac7bECPHiapHk12Haykf2vcIGcsy7wErYDDm4sQowgr5kFiaJBgFeNGhUHacCKKWPt2JQ3SjAQ/132",

      nickName: "李薇",
      openId: 'oGw5W49WStN-HbVgfbSxykI8SC0',
      ready: false,
      index: 5
    },
    {
      avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/lXib4ldvq8FjEs2ac7bECPHiapHk12Haykf2vcIGcsy7wErYDDm4sQowgr5kFiaJBgFeNGhUHacCKKWPt2JQ3SjAQ/132",
      nickName: "李薇",
      openId: 'oGw5W49WStN-HdVgfbSxykI8SC0',
      ready: false,
      index: 6
    },
    {
      avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/lXib4ldvq8FjEs2ac7bECPHiapHk12Haykf2vcIGcsy7wErYDDm4sQowgr5kFiaJBgFeNGhUHacCKKWPt2JQ3SjAQ/132",

      nickName: "李薇",
      openId: 'oGw5W49WStN-HbVgfbSxykI8SC0',
      ready: false,
      index: 7
    },
    {
      avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/lXib4ldvq8FjEs2ac7bECPHiapHk12Haykf2vcIGcsy7wErYDDm4sQowgr5kFiaJBgFeNGhUHacCKKWPt2JQ3SjAQ/132",

      nickName: "李薇",
      openId: 'oGw5W49WStN-HbdVgbSxykI8SC0',
      ready: false,
      index: 8
    },
    {
      avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/lXib4ldvq8FjEs2ac7bECPHiapHk12Haykf2vcIGcsy7wErYDDm4sQowgr5kFiaJBgFeNGhUHacCKKWPt2JQ3SjAQ/132",

      nickName: "李薇",
      openId: 'oGw5W49WSt-HbdVgfbSxykI8SC0',
      ready: false,
      index: 9
    },
    {
      avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/lXib4ldvq8FjEs2ac7bECPHiapHk12Haykf2vcIGcsy7wErYDDm4sQowgr5kFiaJBgFeNGhUHacCKKWPt2JQ3SjAQ/132",

      nickName: "李薇",
      openId: 'oGw5W49WStN-HbdVgfbxykI8SC0',
      ready: false,
      index: 10
    },
    {
      avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/lXib4ldvq8FjEs2ac7bECPHiapHk12Haykf2vcIGcsy7wErYDDm4sQowgr5kFiaJBgFeNGhUHacCKKWPt2JQ3SjAQ/132",
      nickName: "李薇",
      openId: 'oGw5W49WStN-HbdfbSxykI8SC0',
      ready: false,
      index: 11
    },
    {
      avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/lXib4ldvq8FjEs2ac7bECPHiapHk12Haykf2vcIGcsy7wErYDDm4sQowgr5kFiaJBgFeNGhUHacCKKWPt2JQ3SjAQ/132",

      nickName: "李薇",
      openId: 'oGw5W49WStN-HbdVgfbSxykI80',
      ready: false,
      index: 12
    }],
    userInfoSwiper: []
  },
  //事件处理函数

  onLoad: function (e) {
    let that = this;
    let timeRange = [];
    Array.from({ length: 13 }, (v, i) => {
      timeRange.push(i * 5);
    })
    console.log(e, 'e');

    /* 获取房号和主题 */
    let inputMsg = that.data.inputMsg;
    inputMsg.roomNum = e.roomNum;
    inputMsg.text = e.text;

    let buttonText = Number(e.join) === 0 ?'开始讨论':'准备';
    that.setData({
      join: Number(e.join),
      buttonText:buttonText,
      inputMsg: inputMsg,
      timeRange: timeRange,
    });

    wx.showShareMenu({
      // 要求小程序返回分享目标信息
      withShareTicket: true
    });
    that.resetSwiper();
  },

  /* 判断用户swiper需要多少分页 */
  swiperChange: function (e) {
    this.setData({
      currentSwiper: e.detail.current
    })
  },
  /* 重置swiper用户头像的排列 */
  resetSwiper: function () {
    /* 获取用户数据并分配 */
    //先request用户数据亚茹userInfo中
    let that = this;
    let userInfoTem = that.data.userInfo.slice();
    let userInfoSwiper = that.assignUser(userInfoTem);
    let length = userInfoSwiper.length;
    that.setData({
      userInfoSwiper: userInfoSwiper,
      dotsWidth: length * 50
    })
  },
  //判断用户数量
  assignUser: function (a) {
    let userInfoSwiper = [];
    while (a.length >= 8) {
      userInfoSwiper.push(a.splice(0, 8))
    };
    userInfoSwiper.push(a);
    return userInfoSwiper

  },
  /* 转发 */
  onShareAppMessage: function (ops) {
    console.log(ops, '转发')
    if (ops.form === 'button') {
      console.log(ops.target, 'button');
    }
    //console.log(ops.target);
    return {
      title: this.data.inputMsg.inputTitle,
      desc: '快来加入我们的头脑风暴吧！',
      imageUrl: '../../icon/bg2.png',
      path: 'pages/preparing/preparing?join=1',//传入房间号，在后台查找进入房间
      success: function (e) {
        console.log('转发成功' + JSON.stringify(e));
        var shareTickets = res.shareTickets;
        if (shareTickets.length == 0) {
          console.log(shareTickets, 'shareTickets')
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

  /* 删除用户 */
  bindDelete: function (e) {
    let that = this;
    let id = e.target.id;
    console.log(e);
    console.log(id, 'id');
    if (id.indexOf('delete') !== -1) {
      let index = id[id.length - 1];
      console.log(index, 'index');
      let userInfo = that.data.userInfo;
      let deleted = userInfo.splice(index, 1);//被删除的用户数据
      console.log(deleted, 'deleted')
      that.setData({
        userInfo: userInfo
      })
      //console.log(this.data.userInfo, 'userinfo')
    }
    this.resetSwiper();

  },
  
  /* 准备 */
  bindReady: function () {//发送[openId,ready],返回的数据更改相应的ready
    let that = this;
    let join = this.data.join;
    if (join!==0) {/////!!!!!!!!!!!!!!!!
      let readyData = 'userInfo[2].ready';
      let ready = that.data.userInfo[2].ready;
      let text =  !ready ? '取消准备' : '准备';
      that.setData({
        [readyData]: !ready,
        buttonText: text
      })
    } else {
      if (that.data.allSet) {//请求后台数据，如果除房主外其他所有成员准备完毕,并发送时间

      } else {
        wx.showModal({
          title: '提示',
          content: '还有人没有准备好哦！别急^u^',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        })
      }
    }
    that.resetSwiper();
  },
 /*  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  }, */
  /* 用户退出 */
  onUnload: function (e) {//对应删除该用户的openid
    wx.showToast({
      title: '您已退出讨论！',
      icon: 'none',
      duration: 2000
    })
  },

})
