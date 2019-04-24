//index.js
//获取应用实例
const app = getApp()//返回询问是否退出！，删除的那个用户要强制退出房间
Page({//
  data: {
    timeRange:[],
    index:0,
    join: false,
    allSet:false,
    inputMsg: {//保存上一页面传来的房间信息
      roomNum: 0,
      text: '',

    },
    dotsWidth:0,
    currentSwiper:0,
    /*  temUserData:{
       avatarUrl:'../../images/1.jpg'
     }, */
    userInfo: [{
      avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/lXib4ldvq8FjEs2ac7bECPHiapHk12Haykf2vcIGcsy7wErYDDm4sQowgr5kFiaJBgFeNGhUHacCKKWPt2JQ3SjAQ/132",
      city: "Meizhou",
      country: "China",
      gender: 2,
      language: "zh_HK",
      nickName: "李me薇",
      province: "Guangdong",
      ready: false
    },
    {
      avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/lXib4ldvq8FjEs2ac7bECPHiapHk12Haykf2vcIGcsy7wErYDDm4sQowgr5kFiaJBgFeNGhUHacCKKWPt2JQ3SjAQ/132",
      city: "Meizhou",
      country: "China",
      gender: 2,
      language: "zh_HK",
      nickName: "李meme薇",
      province: "Guangdong",
    },
    {
      avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/lXib4ldvq8FjEs2ac7bECPHiapHk12Haykf2vcIGcsy7wErYDDm4sQowgr5kFiaJBgFeNGhUHacCKKWPt2JQ3SjAQ/132",
      city: "Meizhou",
      country: "China",
      gender: 2,
      language: "zh_HK",
      nickName: "李薇",
      province: "Guangdong",
    },
    {
      avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/lXib4ldvq8FjEs2ac7bECPHiapHk12Haykf2vcIGcsy7wErYDDm4sQowgr5kFiaJBgFeNGhUHacCKKWPt2JQ3SjAQ/132",
      city: "Meizhou",
      country: "China",
      gender: 2,
      language: "zh_HK",
      nickName: "李薇",
      province: "Guangdong",
    },
    {
      avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/lXib4ldvq8FjEs2ac7bECPHiapHk12Haykf2vcIGcsy7wErYDDm4sQowgr5kFiaJBgFeNGhUHacCKKWPt2JQ3SjAQ/132",
      city: "Meizhou",
      country: "China",
      gender: 2,
      language: "zh_HK",
      nickName: "李薇",
      province: "Guangdong",
    },
    {
      avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/lXib4ldvq8FjEs2ac7bECPHiapHk12Haykf2vcIGcsy7wErYDDm4sQowgr5kFiaJBgFeNGhUHacCKKWPt2JQ3SjAQ/132",
      city: "Meizhou",
      country: "China",
      gender: 2,
      language: "zh_HK",
      nickName: "李薇",
      province: "Guangdong",
    },
    {
      avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/lXib4ldvq8FjEs2ac7bECPHiapHk12Haykf2vcIGcsy7wErYDDm4sQowgr5kFiaJBgFeNGhUHacCKKWPt2JQ3SjAQ/132",
      city: "Meizhou",
      country: "China",
      gender: 2,
      language: "zh_HK",
      nickName: "李薇",
      province: "Guangdong",
    },
    {
      avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/lXib4ldvq8FjEs2ac7bECPHiapHk12Haykf2vcIGcsy7wErYDDm4sQowgr5kFiaJBgFeNGhUHacCKKWPt2JQ3SjAQ/132",
      city: "Meizhou",
      country: "China",
      gender: 2,
      language: "zh_HK",
      nickName: "李薇",
      province: "Guangdong",
    },
    {
      avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/lXib4ldvq8FjEs2ac7bECPHiapHk12Haykf2vcIGcsy7wErYDDm4sQowgr5kFiaJBgFeNGhUHacCKKWPt2JQ3SjAQ/132",
      city: "Meizhou",
      country: "China",
      gender: 2,
      language: "zh_HK",
      nickName: "李薇",
      province: "Guangdong",
    },
    {
      avatarUrl: "https://wx.qlogo.cn/mmopen/vi_32/lXib4ldvq8FjEs2ac7bECPHiapHk12Haykf2vcIGcsy7wErYDDm4sQowgr5kFiaJBgFeNGhUHacCKKWPt2JQ3SjAQ/132",
      city: "Meizhou",
      country: "China",
      gender: 2,
      language: "zh_HK",
      nickName: "李薇",
      province: "Guangdong",
    }],
    userInfoSwiper:[]

  },
  //事件处理函数

  onLoad: function (e) {
    let that = this;
    let timeRange=[];
    Array.from({length:13},(v,i)=>{
      timeRange.push(i*5);
    })
    // console.log(e.roomId,'roomId');//通过传入的验证码，request，搜寻对应数据项
   
    /* let userInfo = that.data.userInfo;*/
    console.log(e, 'e');
    let inputMsg = that.data.inputMsg;
    inputMsg.roomNum = e.roomNum;
    app.globalData.roomNum = e.roomNum;
    inputMsg.text = e.text;
    //console.log(e.roomID);
    //wx.request()获取inputMsg和userInfo，获取主题和人数，（loading等待）
    /* 填充人数 */
    /* while(userInfo.length !== inputMsg.count){
        userInfo.push(that.data.temUserData);
      } */
    that.setData({
      // userInfo:userInfo,
      join: Number(e.join),
      inputMsg: inputMsg,
      timeRange:timeRange,

    });
    console.log(this.data.inputMsg, 'inputMsg')
    wx.hideShareMenu();
    wx.showShareMenu({
      // 要求小程序返回分享目标信息
      withShareTicket: true
    });

    /* 获取用户数据并分配 */
    //先request用户数据亚茹userInfo中
    let userInfoSwiper =that.assignUser(that.data.userInfo);
    let length = userInfoSwiper.length;
    that.setData({
      userInfoSwiper:userInfoSwiper,
      dotsWidth:length*50
    })

  },
  swiperChange: function (e) {
    this.setData({
      currentSwiper: e.detail.current
    })
  },
//判断用户数量
  assignUser:function(a){
    let userInfoSwiper=[];
    while(a.length>=8){
      userInfoSwiper.push(a.splice(0,8))
    };
    userInfoSwiper.push(a);
    return userInfoSwiper

  },
  /* 转发 */
  onShareAppMessage: function (ops) {
    if (ops.form === 'button') {
      console.log(ops.target, 'button');
    }
    //console.log(ops.target);
    return {
      title: this.data.inputMsg.inputTitle,
      desc: '快来加入我们的头脑风暴吧！',
      path: 'pages/preparing/preparing',
      success: function (e) {
        console.log('转发成功' + JSON.stringify(e))
      },
      fail: function (e) {
        console.log('转发失败' + JSON.stringify(e))
      }

    }

  },
  bindDelete: function (e) {
    let that = this;
    console.log(e);
    /* if (e._relatedInfo.anchorTargetText === "x") {
      let id = e.target.id;
      console.log(id, 'id');
      let index = id[id.length - 1];
      console.log(index, 'index');
      let userInfo = that.data.userInfo;
      let temUserData = this.data.temUserData;
      userInfo.splice(index, 1);
      console.log(userInfo, 'userinfo')
      that.setData({
        userInfo: userInfo
      })
    } */

  },
  bindReady: function () {
    let that = this;
    if (that.data.join) {
      let readyData = 'userInfo[2].ready'
      let ready = that.data.userInfo[2].ready;
      that.setData({
        [readyData]: !ready,
      })
    }else{
      if(that.data.allSet){//请求后台数据，如果所有成员准备完毕,并发送时间

      }else{
        wx.showModal({
          title: '提示',
          content: '还有人没有准备好哦！别急^u^',
          showCancel:false,
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        })
      }
    }
  },
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

})
