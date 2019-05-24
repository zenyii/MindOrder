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
    queryBollen:false,//词条显示效果布尔值
    words:[],
    queryRes:null,//词条点赞者openID数组
    querywordsId:null,//点赞词条的_id
    color: ["#8AACFF", "#A6B1F0", "#9AE3F0", "#AEEDE1", "#F8DC2E"],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
        })
      }
    } else {
    //在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
          })
        }
      })
    }
    //同步UserData数据
    this.setData({
      userData: app.globalData.UserData,
    })
    var userData = this.data.userData;

    //将userData中的openId属性插入词条数据中，方面后续显示
    for(var i = 0; i<userData.length;i++){
      for(var j = 0;j<userData[i].words.length;j++){
        userData[i].words[j].openId = userData[i].openId;
        this.data.allMessage.push(userData[i].words[j]);
      }
    }

   //将allmessage随机打乱并存储在showMessage中
    while(this.data.allMessage.length){
      var index = Math.floor(Math.random() * this.data.allMessage.length);
      this.data.showMessage.push(this.data.allMessage[index]);
      this.data.allMessage.splice(index,1);
    }

    for(var i=0;i<this.data.showMessage.length;i++){
      var index = Math.floor(Math.random()*this.data.color.length);
      this.data.showMessage[i].backColor = this.data.color[index];
    }

    this.setData({
      showMessage:this.data.showMessage
    })

    //console.log(this.data.showMessage);
  },

  //点赞
  like:function(e){
    var count=0;
    var id = e.currentTarget.id;
    var openId = app.globalData.openId;
    var length = this.data.showMessage[id].num.length;
    var roomNumber = app.globalData.roomNum;
    //console.log(e);
    //将点赞过的人的昵称存入num数组中，并处理点赞事件
    if(length){
      for(var i = 0;i<length;i++){
        if (this.data.showMessage[id].num[i] == openId){
          this.data.showMessage[id].num.splice(i,1);
          this.data.showMessage[id].isgood=false;
          break;
        }
        count++;
      }
      if(count==length){
        this.data.showMessage[id].num.push(openId);
        this.data.showMessage[id].isgood=true;
      }
    }
    else{
      this.data.showMessage[id].num.push(openId);
      this.data.showMessage[id].isgood = true;
    }

    this.setData({
      showMessage: this.data.showMessage,
      isgood: this.data.showMessage[id].isgood
    })

    app.globalData.showMessage = this.data.showMessage;
    //console.log(this.data.showMessage);
    //用户点赞后请求点赞结果
    var that = this;
    
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
        _id: "96c1cbbe5ccff8f20d045eed0a250256"
      }).get({
        success: res => {
          //获取查询信息
          that.setData({
            queryRes: res.data[0].supporter,
            querywordsId: res.data[0]._id
          })
          //console.log('[数据库] [查询记录] 成功: ', res.data)
          // console.log('生成的房号是: ', that.data.roomNum)
          //console.log('test：', that.data.queryRes)
          resolve();
        }
      })
    });
    updateSupport.then(function () {
      //检查使用者openID是否在词条点赞者中
      let index = that.inarray(app.globalData.openId, that.data.queryRes)
      //如果赞过
      if (index!=-1) {
        //console.log('赞过', index)
        that.setData({
          queryBollen: false,
        })
        //点赞中删除点赞用户
        that.data.queryRes.splice(index, 1)
        //console.log('test2', that.data.querywordsId)
        //console.log('test2', that.data.queryRes)
        db.collection('words').doc(that.data.querywordsId).update({
          data: {
            //自减一
            supportNum: _.inc(-1),
            supporter: _.set(
              that.data.queryRes
            )
          }
        })
        //console.log('点赞重复')
      }
      else {
        //没赞过
        that.setData({
          queryBollen: true
        })
        db.collection('words').doc(that.data.querywordsId).update({
          data: {
            //自增一
            supportNum: _.inc(1),
            supporter: _.push(openId)
          },
          success: res => {
            console.log(res.data)
            
            this.setData({
             
            })
          }
        })
        //console.log('点赞成功')
        //that.getRandomInt(100000, 999999)
      }
      // db.collection('words').doc("96c1cbbe5ccff8f20d045eed0a250256").update({
      //   data: {
      //     supportNum: 1,
      //     supporter: [
      //       {
      //         "avatarUrl": "",
      //         "nickName": "",
      //         "openid": openId,
      //       },
      //     ]
      //   },
      //   success: res => {
      //     console.log(res.data)
      //     this.setData({

      //     })
      //     resolve();
      //   }
      // })
    })
    
    // wx.request({
    //   url: 'https://fl123.xyz/api/xcx/support.php',
    //   data: {
    //     roomNum: roomNumber,
    //     userId: openId,
    //     author: that.data.showMessage[id].openId,
    //     text: that.data.showMessage[id].word,
    //     state: 1
    //   },
    //   method: 'POST',
    //   header: {
    //     'content-type': "application/x-www-form-urlencoded"
    //   },
    //   success: function (res) {
    //    //返回true或false来判定用户是否点赞
    //     that.data.showMessage[id].isgood = res.data;
    //     that.setData({
    //       showMessage: that.data.showMessage
    //     })
    //   },
    // })
  },
  querywords:function(){

  },
  inarray:function(index,array){
    let i
    for(i=0;i<array.length;i++){
      if(array[i]==index){
        return i
      }
    }
    return -1
  },
  change(){
    wx.navigateTo({
      url: '../rank/rank',
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