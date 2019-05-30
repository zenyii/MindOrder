// miniprogram/pages/report/report.js
const app = getApp();
Page({
  data: {
    rank: [],
    personal: [],
    number: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十","十一","十二","十三","十四","十五","十六","十七","十八","十九","二十"],
    list: [],
    personalList: [],
    show: false,
    personalShow: false,
    rankbg: false,
    tipsss: true,
    king: {},
    hasRank: false,
    hasPersonal: false,
    isRoomMaster: false,
    reportAgain: false,
    maskHidden: true,
  },

  onLoad: function (options) {

    let that = this;
    let list = [];
    let personalList = [];
    wx.setNavigationBarTitle({
      title: '会议报告',
    });
    let rank = [];//记得缓存
    let personal = [];
    let king = {};
    wx.getSystemInfo({//获取设备长宽
      success: function (res) {
        that.setData({
          ratio: res.windowWidth / 375,
        })
      },
    })

    Array.from({ length: app.globalData.term }, (v, i) => {//app.globalData.term
      rank[i] = [];
      personal[i] = [];
    })
    app.onQuery('rooms', { roomNum: app.globalData.roomNum }, { roomMaster: true, title: true, date: true, totalTime: true, validPlan: true, hasPersonal: true, hasRank: true, reportAgain: true }).then(res => {
      let data = res.data[0];
      let roomMasterId = data.roomMaster.openid;
      //console.log(data, 'rooms')
      let title = data.title;
      let date = data.date;
      let totalTime = data.totalTime;
      let validPlan = data.validPlan;
      let hasPersonal = data.hasPersonal;
      let hasRank = data.hasRank;
      let reportAgain = data.reportAgain;
      if (roomMasterId === app.globalData.selfOpenId && !reportAgain) {//判断房主app.globalData.selfOpenId
        that.setData({
          isRoomMaster: true,
        })
      }
      setTimeout(function () {
        that.setData({
          title,
          date,
          totalTime,
          validPlan,
          hasPersonal,
          hasRank,
          reportAgain
        })
      }, 200)
    })
    //排序轮数排行榜数据 
    app.onQuery('words', { roomNum: app.globalData.roomNum }, { term: true, supportNum: true, text: true, openid: true, avatarUrl: true })
      .then(res => {
        let data = res.data;
        king = data[0];
        //console.log(data, 'data')
        data.forEach((item, index) => {
          if (item.supportNum >= king.supportNum) king = item;
          rank[item.term - 1].push(item);
          if (item.openid === app.globalData.selfOpenId) {//属于自己的词条//app.globalData.selfOpenId
            personal[item.term - 1].push(item);
          }
        })
        //console.log(personal,'personal');
        rank.forEach(item => {
          item.sort((a, b) => {
            let a1 = a.supportNum;
            let b1 = b.supportNum;
            if (a1 < b1) {
              return 1;
            } else if (a1 > b1) {
              return -1;
            }
            return 0;
          })

        })
        personal.forEach(item => {
          item.sort((a, b) => {
            let a1 = a.supportNum;
            let b1 = b.supportNum;
            if (a1 < b1) {
              return 1;
            } else if (a1 > b1) {
              return -1;
            }
            return 0;
          })

        })
        //console.log(rank,'rank');
        rank.forEach((items, indexs) => {
          list[indexs] = {};
          let text = list[indexs].text = [];
          items.forEach(item => {
            text.push(item.text);
          })
        })
        personal.forEach((items, indexs) => {
          personalList[indexs] = {};
          let text = personalList[indexs].text = [];
          items.forEach(item => {
            text.push(item.text);
          })
        })

        that.setData({
          rank,
          list,
          personal,
          personalList,
          king
        })
        this.getImgTempPath(king.avatarUrl, 'kingImg');//
        console.log(list, 'list');
        //console.log(personalList, 'person')
        //console.log(king, 'king');
      })

    //绘制canvas生成图
    //初始化图片临时路径
/*     this.getImgTempPath('https://dmt-web-1257360276.cos.ap-guangzhou.myqcloud.com/%E5%A4%B4%E8%84%91%E6%99%BA%E5%BA%8F/stared.png', 'star')
    this.getImgTempPath('https://dmt-web-1257360276.cos.ap-guangzhou.myqcloud.com/%E5%A4%B4%E8%84%91%E6%99%BA%E5%BA%8F/circle.png', 'circle')

    this.getImgTempPath('https://dmt-web-1257360276.cos.ap-guangzhou.myqcloud.com/%E5%A4%B4%E8%84%91%E6%99%BA%E5%BA%8F/zanKing.png', 'kingCircle')
    //console.log(star,'star')     
    console.log(that.data, 'data')
    setTimeout(function () {
      that.drawCanvas();
    }, 1500)
 */
  },

  //将网络图片转成临时路径
  getImgTempPath: function (url, data) {
    let that = this;
    wx.downloadFile({
      url: url, //仅为示例，并非真实的资源
      success: function (res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          //console.log(res.tempFilePath, "reererererer")
          that.setData({
            [data]: res.tempFilePath
          })
        }
      }
    })
  },

  drawCanvas: function () {
    let that = this;
    let context = wx.createCanvasContext('mycanvas');
    let star = that.data.star;
    let circle = that.data.circle;
    let kingImg = that.data.kingImg;
    let kingCircle = that.data.kingCircle;
    let lineCha = 22 * ratio;
    let ratio = that.data.ratio;
    //console.log(ratio*375,'radio')
    context.setFillStyle("#ffffff");
    //context.setGlobalAlpha(0.8)
    context.fillRect(0, 0, 375 * ratio, 2000 * ratio);
    //h绘制header
    context.drawImage(star, 5 * ratio, 10 * ratio, 18 * ratio, 18 * ratio);//星星

    let title = this.canvasWorkBreak(300 * ratio, 16 * ratio, that.data.title);
    context.setFontSize(16 * ratio);
    context.setFillStyle('#000000');
    context.fillText(`主题:`, 25 * ratio, 25 * ratio);//主题
    //循环绘制主题内容
    var height = 25 * ratio;
    title.forEach((item, index) => {
      if (index === 1) lineCha = 0;
      context.setFontSize(16 * ratio);
      context.setFillStyle("#000000");
      context.fillText(item, 70 * ratio, height);
      height += 20 * ratio;
    })
    context.stroke();

    context.setFontSize(14 * ratio);//日期
    context.setFillStyle('gray');
    context.fillText(`日期: ${that.data.date}`, 25 * ratio, 68 * ratio - lineCha);
    context.fillText(`时长: ${that.data.totalTime}`, 25 * ratio, 85 * ratio - lineCha);
    context.stroke();

    context.drawImage(circle, 100 * ratio, 80 * ratio - lineCha, 170 * ratio, 170 * ratio);//圈圈  2-80

    context.setFontSize(16 * ratio);
    context.setFillStyle('#000000');
    context.fillText(`本次会议有效方案`, 120 * ratio, 167 * ratio - lineCha);
    context.fillText(`${that.data.validPlan.length}个`, 173 * ratio, 188 * ratio - lineCha);
    context.stroke();

    context.setFillStyle('#f2f2f2');
    context.fillRect(0, 270 * ratio - lineCha, 375 * ratio, 8 * ratio);

    //context.drawImage(kingImg, 165, 300-lineCha, 44, 44);//点赞王

    this.circleImg(context, kingImg, 165 * ratio, 300 * ratio - lineCha, 22 * ratio);//点赞王
    context.drawImage(kingCircle, 162 * ratio, 297 * ratio - lineCha, 50 * ratio, 50 * ratio);

    context.setFontSize(14 * ratio);//
    context.setFillStyle('black');
    context.fillText(`本次获赞王`, 155 * ratio, 365 * ratio - lineCha);
    context.stroke();

    context.setFontSize(14 * ratio);//
    context.setFillStyle('#ffe46c');
    context.fillText(`+${that.data.king.supportNum}`, 226 * ratio, 365 * ratio - lineCha);
    context.stroke();

    context.setFillStyle('#f2f2f2');
    context.fillRect(0, 375 * ratio - lineCha, 375 * ratio, 4 * ratio);
    //rank
    context.setFillStyle('#6188ff');
    context.fillRect(0, 380 * ratio - lineCha, 375 * ratio, 25 * ratio);

    context.setFontSize(16 * ratio);//所有排行榜
    context.setFillStyle('white');
    context.fillText(`所有排行榜`, 15 * ratio, 398 * ratio - lineCha);
    context.stroke();
    let list = that.data.list;
    list.forEach((item, index) => {
      if (index === 0) {
        context.setFontSize(14 * ratio);//轮次
        context.setFillStyle('black');
        context.fillText(`第${that.data.number[index]}轮`, 25 * ratio, 400 * ratio - lineCha + 23 * (index + 1));
        context.stroke();

        context.setFillStyle('#f2f2f2');
        context.fillRect(0, 405 * ratio - lineCha + 24 * (index + 1), 375 * ratio, 1 * ratio);//线条

        let rankH = 450 * ratio - lineCha;
        item.text.forEach((innerItem, innerIndex) => {//rankn内容
          /* context.setFontSize(14 * ratio);//轮次
          context.setFillStyle('black');
          context.fillText(`${innerIndex}. ${innerItem}`, 35 * ratio, 420 * ratio - lineCha + 24 * (index + 1));
          context.stroke(); */

          let rankContent = that.canvasWorkBreakNornal(300 * ratio, 14 * ratio, innerItem);
          console.log(rankContent, 'rankContent')
          //循环绘制主题内容
          rankContent.forEach((rankItem, rankIndex) => {
            context.setFontSize(14 * ratio);
            context.setFillStyle("#000000");
            context.fillText(`${rankItem}`, 35 * ratio, rankH);
            rankH += 20 * ratio;
          })
          context.stroke();
        })
      }

    })

    context.draw();
  },

  circleImg: function (ctx, img, x, y, r) {
    ctx.save();
    var d = 2 * r;
    var cx = x + r;
    var cy = y + r;
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.clip();
    ctx.drawImage(img, x, y, d, d);
    ctx.restore();
  },

  canvasWorkBreak: function (maxWidth, fontSize, text) {
    const maxLength = maxWidth / fontSize
    const textLength = text.length;
    let textRowArr = []
    let tmp = 0;
    let line = 2;
    while (line--) {
      textRowArr.push(text.substr(tmp, maxLength))
      tmp += maxLength
      if (tmp >= textLength) {
        return textRowArr
      }
      if (line === 0) {
        //console.log(textRowArr[1][0],'line')
        let length = textRowArr[1].length;
        textRowArr[1] = textRowArr[1].substr(0, length - 1);
        textRowArr[1] += '…';
        return textRowArr
      }

    }
  },

  canvasWorkBreakNornal: function (maxWidth, fontSize, text) {
    const maxLength = maxWidth / fontSize
    const textLength = text.length;
    let textRowArr = []
    let tmp = 0;
    while (1) {
      textRowArr.push(text.substr(tmp, maxLength))
      tmp += maxLength
      if (tmp >= textLength) {
        return textRowArr
      }
    }
  },


  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  createNewImg: function () {
    var that = this;
    var context = wx.createCanvasContext('mycanvas');
    let star = that.data.circle;
    let circle = that.data.circle;
    //let kingImg = that.data.kingImg;
    let kingCircle = that.data.kingCircle;
    context.setFillStyle("#ffe200")
    context.fillRect(0, 0, 375, 667)

    //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
    //不知道是什么原因，手机环境能正常显示
    context.drawImage(star, 0, 0, 375, 183);

    //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
    context.drawImage(circle, 126, 186, 120, 120);
    //不知道是什么原因，手机环境能正常显示
    // context.save(); // 保存当前context的状态

    var name = that.data.name;
    //绘制名字
    context.setFontSize(24);
    context.setFillStyle('#333333');
    context.setTextAlign('center');
    context.fillText(name, 185, 340);
    context.stroke();
    //绘制一起吃面标语
    context.setFontSize(14);
    context.setFillStyle('#333333');
    context.setTextAlign('center');
    context.fillText("邀请你一起去吃面", 185, 370);
    context.stroke();
    //绘制验证码背景
    //context.drawImage(kingImg, 48, 390, 280, 84);
    //绘制code码
    context.setFontSize(40);
    context.setFillStyle('#ffe200');
    context.setTextAlign('center');
    context.fillText(that.data.code, 185, 435);
    context.stroke();
    //绘制左下角文字背景图
    context.drawImage(kingCircle, 25, 520, 184, 82);
    context.setFontSize(12);
    context.setFillStyle('#333');
    context.setTextAlign('left');
    context.fillText("进入小程序输入朋友的邀请", 35, 540);
    context.stroke();
    context.setFontSize(12);
    context.setFillStyle('#333');
    context.setTextAlign('left');
    context.fillText("码，朋友和你各自获得通用", 35, 560);
    context.stroke();
    context.setFontSize(12);
    context.setFillStyle('#333');
    context.setTextAlign('left');
    context.fillText("优惠券1张哦~", 35, 580);
    context.stroke();
    //绘制右下角扫码提示语
    //绘制头像
    context.arc(186, 246, 50, 0, 2 * Math.PI) //画出圆
    context.strokeStyle = "#ffe200";
    context.clip(); //裁剪上面的圆形
    context.draw();
    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: function (res) {
          var tempFilePath = res.tempFilePath;
          that.setData({
            imagePath: tempFilePath,
            canvasHidden: true
          });
        },
        fail: function (res) {
          console.log(res);
        }
      });
    }, 200);
  },

  listTap: function (e) {
    let Index = e.currentTarget.dataset.parentindex,//获取点击的下标值
      list = this.data.list;
    list[Index].show = !list[Index].show || false;//变换其打开、关闭的状态
    list[Index].colorShow = !list[Index].colorShow || false;//变换其打开、关闭的状态
    if (list[Index].show) {//如果点击后是展开状态，则让其他已经展开的列表变为收起状态
      this.packUpColor(list, Index);
    }

    this.setData({
      list
    });

  },
  personalListTap: function (e) {
    let Index = e.currentTarget.dataset.parentindex,//获取点击的下标值
      personalList = this.data.personalList;
    personalList[Index].personalShow = !personalList[Index].personalShow || false;//变换其打开、关闭的状态
    personalList[Index].personalColorShow = !personalList[Index].personalColorShow || false;
    if (personalList[Index].personalColorShow) {//如果点击后是展开状态，则让其他已经展开的列表变为收起状态
      this.packUp(personalList, Index);
    }

    this.setData({
      personalList
    });

  },

  packUp(data, index) {
    for (let i = 0, len = data.length; i < len; i++) {//其他最外层列表变为关闭状态
      if (index != i) {
        data[i].personalColorShow = false;
        /* for (let j = 0; j < data[i].item.length; j++) {//其他所有内层也为关闭状态
          data[i].item[j].show = false;
        } */
      }
    }
  },
  packUpColor(data, index) {
    for (let i = 0, len = data.length; i < len; i++) {//其他最外层列表变为关闭状态
      if (index != i) {
        data[i].colorShow = false;
        /* for (let j = 0; j < data[i].item.length; j++) {//其他所有内层也为关闭状态
          data[i].item[j].show = false;
        } */
      }
    }
  },
  listParentTap: function (e) {
    console.log(e, 'e');
    let that = this;
    this.setData({
      show: !that.data.show
    })
  },
  personalListParentTap: function (e) {
    //console.log(e, 'e');
    let that = this;
    this.setData({
      personalShow: !that.data.personalShow
    })
  },
  checkboxChange: function (e) {
    console.log(e);
    let that = this;
    if (e.detail.value) {
      that.setData({
        hasRank: !that.data.hasRank
      })
    }
    this.setData({
      tipsss: false,
      show: !that.data.show,
      rankbg: !that.data.rankbg
    })
  },
  personalCheckboxChange: function (e) {
    let that = this;
    if (e.detail.value) {
      that.setData({
        hasPersonal: !that.data.hasPersonal
      })
    }
    this.setData({
      personalShow: !that.data.personalShow,
      personalbg: !that.data.personalbg
    })
  },
  export: function () {
    let that = this;
    app.onUpdateThree('rooms', app.globalData.roomId, 'hasRank', that.data.hasRank, 'hasPersonal', that.data.hasPersonal, 'reportAgain', true)
      .then(res => {
        console.log('设置hasRank成功！')
        wx.redirectTo({
          url: `../report/report`
        })
      })


  },
  generate: function () {
    console.log('生成啦')
  },


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