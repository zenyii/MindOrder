//index.js
//获取应用实例
const app = getApp();//返回询问是否退出！，删除的那个用户要强制退出房间
Page({//
  data: {
    /* timeRange: [], */
    index: 0,
    join: 1,
    allset: false,
    inputMsg: {//保存上一页面传来的房间信息
      roomNum: 0,
      text: '',
    },
    buttonText: '',
    dotsWidth: 0,
    currentSwiper: 0,
    userInfo: [],
    userInfoSwiper: [],
  },
  //事件处理函数
  onLoad: function (e) {//链接传入roomNum 和join
    /* 一进来先后台查询此房间是否已在讨论中， */
    let that = this;
    app.globalData.userInfo = wx.getStorageSync('userInfo');
    app.globalData.selfOpenId = wx.getStorageSync('selfOpenId');
    /* 获取房号 */
    let inputMsg = that.data.inputMsg;
    let join = Number(e.join);
    /*  let join = 1; */
    let buttonText = join === 0 ? '开始讨论' : '准备';
    /* inputMsg.roomNum = e.roomNum;
    inputMsg.text = e.text; */
    inputMsg.roomNum = e.roomNum;
    console.log(inputMsg.roomNum )
    //console.log(inputMsg, 'inputMsg')
    /* 查找数据库的记录 */
    app.onQuery('rooms', { roomNum: inputMsg.roomNum },
      { roommates: true, title: true, inMeeting: true ,roomMaster:true,})
      .then(res => {
        console.log(res.data, '结果');
        let data = res.data[0];
        if (data.inMeeting) {
          wx.showToast({
            title: '你来晚啦，房间正在讨论或者已经结束！',
            icon: 'none',
            mask: true,
            duration: 2000,
            success: function () {//返回首页
              setTimeout(function () {
                //要延时执行的代码
                wx.redirectTo({
                  url: '../index/index'
                });
              }, 2000) //延迟时间
            }
          })
          return
        }

        let userInfo = data.roommates;
        inputMsg.text = data.title;
        

        //如果是新加进来的用户，先补充全局变量，还需把他的数据push到数据库更新数据
        if (join !== 0) {
          app.globalData.title = data.title;
          app.globalData.roomNum = inputMsg.roomNum;
          app.globalData.roomMaster = data.roomMaster;
          app.globalData.roomId = data._id;

          let newPerson = {
            openid: app.globalData.selfOpenId,
            avatarUrl: app.globalData.userInfo.avatarUrl,
            nickName: app.globalData.userInfo.nickName,
            ready: false
          };
          userInfo.push(newPerson);
          /* 数据库更新 */
          
          wx.cloud.callFunction({
            name: 'updateMsg',
            data: {
              roomId: app.globalData.roomId,
              newPerson: newPerson
            }
          }).then(console.log('更新成功！'))
        }
        that.setData({
          join: join,
          buttonText: buttonText,
          inputMsg: inputMsg,
          userInfo: userInfo
          /* timeRange: timeRange, */
        });

        //开始不断加载数据
        that.dataQuary();
        that.resetSwiper();

      }, err => {
        console.log('搜索失败')
      })

  },

  /* 同步房间数据 */
  dataQuary: function () {
    let that = this;
    app.onQuery('rooms', { roomNum: app.globalData.roomNum },
      { roommates: true, allset: true, preparingTime: true })
      .then(res => {
        let data = res.data[0];
        //console.log(res.data,'data')
        //console.log(typeof app.globalData.roomNum,'roomNum')
        //console.log(data,'666');
        that.setData({
          userInfo: data.roommates,
        })
        console.log("test")
        if (!data.allset) {
          setTimeout(function () {
            //要延时执行的代码
            that.dataQuary();
            that.resetSwiper();
          }, 4000) //延迟时间
        } else {//房主已经设置开始了,传入准备时间
          if (that.data.join === 1) {//如果是成员，接收到allset后直接跳转到准备时间页面
            wx.redirectTo({
              url: `../beforeDiscussTime/beforeDiscussTime?timePreparing=${data.preparingTime}`
            })
          }

        }
      })
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
    console.log(that.data.userInfo,'userInfo');
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
      path: '/pages/preparing/preparing?join=1',//传入房间号，在后台查找进入房间
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
    //console.log(e);
    //console.log(id, 'id');
    if (id.indexOf('delete') !== -1) {
      let index = id[id.length - 1];
     // console.log(index, 'index');
      let userInfo = that.data.userInfo;
      let deleted = userInfo.splice(index, 1);//被删除的用户数据
      //console.log(deleted, 'deleted')
      that.setData({
        userInfo: userInfo
      })
      //console.log(this.data.userInfo, 'userinfo')
    }
    this.deletePerson(that.data.userInfo);
    this.resetSwiper();

  },

  deletePerson: function (userInfo) {
    wx.cloud.callFunction({
      name: 'removePeople',
      data: {
        roomId: app.globalData.roomId,
        updatePersons: userInfo
      }
    }).then(console.log('删除&更新成功！'))
  },



  /* 准备 */
  bindReady: function () {//发送[openId,ready],返回的数据更改相应的ready
    let that = this;
    let join = this.data.join;
    console.log(join, 'join');
    /* 查找数据库的记录 */
    app.onQuery('rooms', { roomNum: app.globalData.roomNum },
     { readyArr: true, roommates: true, inMeeting: true }).then(res => {
      
      let data = res.data[0];
      console.log(res, 'arr');
      let readyArr = data.readyArr;//查找当前准备好的人数
      let userNum = data.roommates.length;//查找当前房间已有人数
      //console.log(user,'user');
      if (join !== 0 && data.inMeeting === false) {
        /////!!!!!!!!!!!!!!!!成员视角且房主已经在设置时间了，不能再改了

        //寻找自己的位置，修改roommates的ready
        let userInfo = data.roommates;//实时更新
        let selfOpenId = app.globalData.selfOpenId;
        let indexx;
        userInfo.some((item, index) => {
          if (item.openid === selfOpenId) {
            indexx = index;
            return true
          }
        });

        let readyData = `userInfo[${indexx}].ready`;
        //console.log(indexx,'raedy')
        let ready = that.data.userInfo[indexx].ready;
        let text = !ready ? '取消准备' : '准备';
        that.setData({
          [readyData]: !ready,
          buttonText: text
        })
        //修改数据readyArr
        //先拉取
        let yIndex = readyArr.indexOf(selfOpenId);
        yIndex !== -1 ? readyArr.splice(yIndex, 1) : readyArr.push(selfOpenId);

        //整体update&set到数据库上
        //console.log(that.data.userInfo, 'user',readyArr,'arr');
        that.setReady(that.data.userInfo, readyArr);

      } else if (join === 0) {//房主视角
        let readyNum = readyArr.length;
        if (readyNum === userNum - 1) that.data.allset = true//但不发送到后台
        //
        if (that.data.allset) {//请求后台数据
          /*  app.onUpdate('rooms',app.globalData.roomId,'inMeeting',true).then(res=>{
             console.log('更改inMeeting成功！')
           }); */
          app.onUpdate('rooms', app.globalData.roomId, `inMeeting`, true).then(res => {
            console.log('更改inMeeting成功！')
          });//会议已开始，其他人员不可再进入房间
          wx.redirectTo({
            url: '../setTime/setTime?rank=0',
          })
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
      } else {//房主已在设置时间，不可更改状态了
        wx.showToast({
          title: '房主正在设置准备时间！不可更改状态啦！',
          icon: 'none',
          duration: 2000,
        })
      }
      that.resetSwiper();
    })

  },

  setReady: function (roommates, readyArr) {
    wx.cloud.callFunction({
      name: 'setReady',
      data: {
        roomId: app.globalData.roomId,
        newRoommates: roommates,
        newReadyArr: readyArr
      }
    }).then(console.log('setReady成功！'))
  },
  /*  bindPickerChange(e) {
     console.log('picker发送选择改变，携带值为', e.detail.value)
     this.setData({
       index: e.detail.value
     })
   }, */
  /* 用户退出 */
  bindQuite: function () {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确定退出讨论吗？您将返回主页',
      success(res) {
        if (res.confirm) {

          //删除数据
          let userInfo = that.data.userInfo;
          let selfOpenId = app.globalData.selfOpenId;
          let indexx;
          
          userInfo.some((item, index) => {
            if (item.openid === selfOpenId) {
              indexx = index;
              return true;
            }
          });
          let deleted = userInfo.splice(indexx, 1);//被删除的用户数据
          //console.log(deleted, 'deleted')
          if(selfOpenId===app.globalData.roomMaster)//房主自己退出房间！
          {
            app.globalData.roomMaster=userInfo[0].openid;//设置房间第一位为房主
          }
          app.onUpdate('rooms',app.globalData.roomId,`roomMaster`,userInfo[0]);//在数据库更新房主
          that.setData({
            userInfo: userInfo
          })
          // console.log(that.data.userInfo, 'userinfo')

          that.deletePerson(that.data.userInfo);
          //that.resetSwiper();
          wx.redirectTo({
            url: '../index/index'
          });
        } else if (res.cancel) {

        }
      }
    })
  },

  /*  onUnload: function (e) {//对应删除该用户的openid
     wx.showToast({
       title: '您已退出讨论！',
       icon: 'none',
       duration: 2000
     })
   }, */

})
