//index.js
//获取应用实例
const app = getApp();//返回询问是否退出！，删除的那个用户要强制退出房间
Page({//
  data: {
    index: 0,
    join: 1,//点击链接会传入这个属性，1表示是链接进来的，0表示房主
    allset: false,//表示房主已设置好时间，全部成员可以开始进入讨论页面了
    inputMsg: {//保存上一页面传来的房间信息
      roomNum: 0,
      text: '',
    },
    buttonText: '',//针对是房主还是成员切换按钮文本
    dotsWidth: 0,//分页指示点长度
    currentSwiper: 0,//分页现在
    userInfo: [],//保存房间成员信息
    userInfoSwiper: [],//二维数组，里面的数组表示每8人信息组成一个arr，构成一页，便于分页显示
    allTime: true//同步数据停止信号，如果为fasle则表示停止实时请求响应的请求
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

    inputMsg.roomNum = e.roomNum;
    app.globalData.roomNum = inputMsg.roomNum;//初始化app.js的房号

    /* 查找数据库rooms的记录 */
    app.onQuery('rooms', { roomNum: inputMsg.roomNum },
      { roommates: true, title: true, inMeeting: true, roomMaster: true, roomNum: true, allset: true })
      .then(res => {
        let data = res.data[0];
        if (data.inMeeting) {//如果在讨论阶段不允许再加入房间
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
        let roomMaster = data.roomMaster;
        if (roomMaster.openid === app.globalData.selfOpenId) {//如果房主链接进来，join重新赋值为0；
          join = 0;
        }
        let buttonText = join == 0 ? '开始讨论' : '准备';
        let userInfo = data.roommates;//保存房间成员信息
        let allset = data.allset;
        inputMsg.text = data.title;
        app.globalData.title = data.title;//无论是谁，刚进来都要全局初始化
        app.globalData.roomMaster = roomMaster.openid;
        app.globalData.roomId = data._id;

        that.setData({
          join: join,
          buttonText: buttonText,
          inputMsg: inputMsg,
          userInfo: userInfo,
          allset: allset
          /* timeRange: timeRange, */
        });
        that.resetSwiper();//c初始化swiper

        //如果是新加进来的用户，还需把他的数据push到数据库更新数据
        let alreadyHas = userInfo.some(item => item.openid === app.globalData.selfOpenId);
        if (!alreadyHas) {
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
          }).then(() => {
            that.setData({
              userInfo: userInfo,
            });
            that.resetSwiper();//重置swiper
            setTimeout(function () {
              that.dataQuary();
            }, 500)
          })
        } else {
          console.log('您已存在在库中')
          setTimeout(function () {
            that.dataQuary();
          }, 500)
        }
        //开始不断加载数据 
      }, err => {
        console.log('搜索失败')
      })
  },

  /* 同步房间数据，不断请求数据库最新信息，更新本地room信息 */
  dataQuary: function () {
    let that = this;
    if (!that.data.allTime) return;

    app.onQuery('rooms', { roomNum: app.globalData.roomNum },
      { roommates: true, allset: true, preparingTime: true, roomMaster: true })
      .then(res => {
        let data = res.data[0];
        app.globalData.roomMaster = data.roomMaster.openid;
        let roommates = data.roommates;
        //中途被踢走
        let kitOut = roommates.some(element => element.openid == app.globalData.selfOpenId);//如果没有找到openid，返回false
        if (!kitOut) {
          wx.showToast({
            title: '您已被房主踢出，返回主页中...',
            icon: 'none',
            duration: 2000,
            success: function () {
              setTimeout(function () {
                //要延时执行的代码
                wx.redirectTo({
                  url: '../index/index'
                });
              }, 2000) //延迟时间
            }
          })
          return
        } else {
          that.setData({
            userInfo: data.roommates,
            allset: data.allset
          })
          if (!that.data.allset) {//如果讨论还没开始
            setTimeout(function () {
              //要延时执行的代码
              that.resetSwiper();//需要不断重置swiper，因为可能不断有人加入或者被踢走
              that.dataQuary();//刷新数据

            }, 1000) //延迟时间
          } else {
            //房主已经设置开始讨论了,传入准备时间
            if (that.data.join === 1) {//如果是成员，接收到allset后直接跳转到准备时间页面
              wx.redirectTo({
                url: `../beforeDiscussTime/beforeDiscussTime?timePreparing=${data.preparingTime}`
              })
            }

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
    //先request用户数据压入userInfo中
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
    while (a.length >= 8) {//每页编排8个成员
      userInfoSwiper.push(a.splice(0, 8))//push进长度为8的数组
    };
    userInfoSwiper.push(a);
    return userInfoSwiper

  },
  /* 转发 */
  onShareAppMessage: function (ops) {
    let that = this;
    if (ops.form === 'button') {
    }
    return {
      title: this.data.inputMsg.inputTitle,
      desc: '快来加入我们的头脑风暴吧！',
      imageUrl: 'https://dmt-web-1257360276.cos.ap-guangzhou.myqcloud.com/%E5%A4%B4%E8%84%91%E6%99%BA%E5%BA%8F/share.png',
      path: `/pages/preparing/preparing?join=1&roomNum=${that.data.inputMsg.roomNum}`,//传入房间号，在后台查找进入房间
      success: function (e) {
        var shareTickets = res.shareTickets;
        if (shareTickets.length == 0) {
          return false;
        }
        //可以获取群组信息
        wx.getShareInfo({
          shareTicket: shareTickets[0],
          success: function (res) {
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

    if (id.indexOf('delete') !== -1) {//点击了delete图标
      wx.showModal({
        title: '提示',
        content: '您确定要踢掉该用户？',
        success: function (res) {
          if (res.confirm) {//确认踢掉
            let index = id[id.length - 1];
            let userInfo = that.data.userInfo;
            let deleted = userInfo.splice(index, 1);//被删除的用户数据
            that.setData({
              userInfo: userInfo
            })
            this.deletePerson(that.data.userInfo);
            this.resetSwiper();
          }

        }
      })
    }
  },

  deletePerson: function (userInfo) {
    wx.cloud.callFunction({//在数据库中删除指定用户数据
      name: 'removePeople',
      data: {
        roomId: app.globalData.roomId,
        updatePersons: userInfo
      }
    })
  },



  /* 准备 */
  bindReady: function () {//发送[openId,ready],返回的数据更改相应的ready
    let that = this;
    let join = this.data.join;
    /* 查找数据库的记录 */
    app.onQuery('rooms', { roomNum: app.globalData.roomNum },
      { readyArr: true, roommates: true, inMeeting: true }).then(res => {

        let data = res.data[0];
        let readyArr = data.readyArr;//查找当前准备好的人数
        let userNum = data.roommates.length;//查找当前房间已有人数
        if (join !== 0 && data.inMeeting === false) {/////!!!!!!!!!!!!!!!!成员视角且房主已经在设置时间了，不能再改了
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

          let readyData = `userInfo[${indexx}].ready`;//保存变量属性
          let ready = that.data.userInfo[indexx].ready;
          let text = !ready ? '取消准备' : '准备';
          that.setData({
            [readyData]: !ready,
            buttonText: text
          })
          //修改数据readyArr
          //先查询是否存在
          let yIndex = readyArr.indexOf(selfOpenId);
          yIndex !== -1 ? readyArr.splice(yIndex, 1) : readyArr.push(selfOpenId);

          //整体将成员准备状态update&set到数据库上
          that.setReady(that.data.userInfo, readyArr);

        } else if (join === 0) {//房主视角
          let readyNum = readyArr.length;
          if (readyNum === userNum - 1) that.data.allset = true//所有成员都已准备完毕，但不发送到后台
          if (that.data.allset) {//在数据库中将房间设为开启讨论状态
            app.onUpdate('rooms', app.globalData.roomId, `inMeeting`, true).then(res => {
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

  setReady: function (roommates, readyArr) {//在数据库中切换准备状态
    wx.cloud.callFunction({
      name: 'setReady',
      data: {
        roomId: app.globalData.roomId,
        newRoommates: roommates,
        newReadyArr: readyArr
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
          //删除数据
          let userInfo = that.data.userInfo;
          let selfOpenId = app.globalData.selfOpenId;
          let indexx;
          that.setData({
            allTime: false
          })
          userInfo.some((item, index) => {
            if (item.openid === selfOpenId) {
              indexx = index;
              return true;
            }
          });
          let deleted = userInfo.splice(indexx, 1);//被删除的用户数据
          if (selfOpenId === app.globalData.roomMaster)//房主自己退出房间！
          {
            try {//当只有房主一个人时，房主退出时是不能传递房主给下一位
              app.globalData.roomMaster = userInfo[0].openid;//设置房间第一位为房主
            }
            catch (err) {
              console.log(err)
            }
          }
          if (userInfo.length === 0) {//，没有可以顺位的房主，消除房间
            const db = wx.cloud.database();
            db.collection('rooms').doc(app.globalData.roomId).remove({
              success(res) {
              }
            })
          } else {
            app.onUpdate('rooms', app.globalData.roomId, `roomMaster`, userInfo[0]);//在数据库更新房主
            that.setData({
              userInfo: userInfo
            })

            that.deletePerson(that.data.userInfo);
            //that.resetSwiper();
          }
          wx.redirectTo({
            url: '../index/index',//返回主页
            success: function () {
            }
          });
        } else if (res.cancel) {

        }
      }
    })
  },

  onUnload: function (e) {//对应删除该用户的openid
    /* wx.showToast({
      title: '您已退出讨论！',
      icon: 'none',
      duration: 2000
    }) */
    this.setData({
      allTime: false
    })
  },

})
