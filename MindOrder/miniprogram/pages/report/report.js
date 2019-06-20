// miniprogram/pages/report/report.js
const app = getApp();
Page({
  data: {
    rank: [],
    personal: [],
    number: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十"],
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
    maskHidden: false,

  },

  onLoad: function (options) {

    let that = this;
    let list = [];
    let personalList = [];
    if (options.reportAgain) {
      that.setData({
        reportAgain: true
      })
    }
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
    app.onQuery('rooms', { roomNum: app.globalData.roomNum }, { roomMaster: true, title: true, date: true, totalTime: true, validPlan: true, hasPersonal: true, hasRank: true })
      .then(res => {
        let data = res.data[0];
        let roomMasterId = data.roomMaster.openid;
        let title = data.title;
        //console.log(typeof title,'title11')
        let date = data.date;
        let totalTime = data.totalTime;
        let validPlan = data.validPlan;
        let hasPersonal = data.hasPersonal;
        let hasRank = data.hasRank;

        that.setData({
          title,
          date,
          totalTime,
          validPlan,
          hasPersonal,
          hasRank,
        })
      }).then(res => {
        //排序轮数排行榜数据 
        app.onQuery('words', { roomNum: app.globalData.roomNum }, { term: true, supportNum: true, text: true, openid: true, avatarUrl: true })
          .then(res => {
            if(res.data.length==0){
              wx.showToast({
                title: '无数据',
                duration:1000
              })
            }
            let data = res.data;
            king = data[0];
            data.forEach((item, index) => {
              if (item.supportNum >= king.supportNum) king = item;
              rank[item.term - 1].push(item);
              if (item.openid === app.globalData.selfOpenId) {//属于自己的词条//app.globalData.selfOpenId
                personal[item.term - 1].push(item);
              }
            })
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
            that.getImgTempPath(king.avatarUrl, 'kingImg');//
            //console.log(list, 'list');
            //console.log(personalList, 'person')
            //console.log(king, 'king');
            console.log('then2')
          }).then(res => {
            //绘制canvas生成图
            //初始化图片临时路径
            that.getImgTempPath('https://dmt-web-1257360276.cos.ap-guangzhou.myqcloud.com/%E5%A4%B4%E8%84%91%E6%99%BA%E5%BA%8F/stared.png', 'star')
            that.getImgTempPath('https://dmt-web-1257360276.cos.ap-guangzhou.myqcloud.com/%E5%A4%B4%E8%84%91%E6%99%BA%E5%BA%8F/circle.png', 'circle')

            that.getImgTempPath('https://dmt-web-1257360276.cos.ap-guangzhou.myqcloud.com/%E5%A4%B4%E8%84%91%E6%99%BA%E5%BA%8F/zanKing.png', 'kingCircle')
            //console.log(star,'star')     
            //console.log(that.data, 'data')
            console.log('then3')
          }).then(res => {
            if (that.data.reportAgain) {
              setTimeout(function () {
                that.drawCanvas();
                console.log('then4')
              }, 2000)
            }
          })
      })
  },

  hideCanvas: function (e) {
    let that = this;
    console.log(e);
    if (e.target.id === 'imagePathBox') {
      that.setData({
        maskHidden: false
      })
    }
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
    let ratio = that.data.ratio;
    let lineCha = 22 * Number(ratio);
    //console.log(ratio*375,'radio')
    context.setFillStyle("#ffffff");
    //context.setGlobalAlpha(0.8)
    context.fillRect(0, 0, 375 * ratio, 5000 * ratio);
    //h绘制header
    context.drawImage(star, 5 * ratio, 10 * ratio, 18 * ratio, 18 * ratio);//星星
    //console.log(lineCha,'ratio')
    let title = that.canvasWorkBreak(300 * ratio, 16 * ratio, that.data.title);
    //console.log(that.data.title,'title')
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

    if (this.data.hasRank) {

      //rank
      context.setFillStyle('#8AACFF');
      context.fillRect(0, 380 * ratio - lineCha, 375 * ratio, 25 * ratio);

      context.setFontSize(16 * ratio);//所有排行榜
      context.setFillStyle('white');
      context.fillText(`所有排行榜`, 15 * ratio, 399 * ratio - lineCha);
      context.stroke();
      let list = that.data.list;

      var rankH = 450 * ratio - lineCha;
      list.forEach((item, index) => {
        context.setFontSize(14 * ratio);//轮次
        context.setFillStyle('black');
        context.fillText(`第${that.data.number[index]}轮`, 25 * ratio, rankH - 50 * ratio + 23 * (index + 1));
        context.stroke();
        context.setFillStyle('#f2f2f2');
        context.fillRect(0, rankH - 45 * ratio + 24 * (index + 1), 375 * ratio, 1 * ratio);//线条
        item.text.forEach((innerItem, innerIndex) => {//rankn内容
          context.setFontSize(14 * ratio);//轮次
          context.setFillStyle('black');
          context.fillText(`${innerIndex + 1}.`, 40 * ratio, rankH + index * 20 * ratio);

          let rankContent = that.canvasWorkBreakNornal(350 * ratio, 14 * ratio, innerItem);
          //console.log(rankContent, 'rankContent')
          //循环绘制主题内容
          rankContent.forEach((rankItem, rankIndex) => {
            context.setFontSize(14 * ratio);
            context.setFillStyle("#000000");
            context.fillText(`${rankItem}`, 55 * ratio, rankH + index * 20 * ratio);
            rankH += 20 * ratio;
          })
          context.setFillStyle('#f2f2f2');
          context.fillRect(0, rankH - 16 * ratio + 20 * ratio * index, 375 * ratio, 1 * ratio);//线条
          context.stroke();
        })
        rankH += 10 * ratio;
      })

    } else {
      var rankH = 380 * ratio - lineCha;
    }
    if (this.data.hasPersonal) {
      //personal
      context.setFillStyle('#9AE3F0');
      context.fillRect(0, rankH, 375 * ratio, 25 * ratio);//380 * ratio - lineCha

      context.setFontSize(16 * ratio);//所有排行榜
      context.setFillStyle('white');
      context.fillText(`个人记录`, 15 * ratio, rankH + 19 * ratio);
      context.stroke();
      let personalList = that.data.personalList;

      var rankP = rankH + 70 * ratio;
      personalList.forEach((item, index) => {
        context.setFontSize(14 * ratio);//轮次
        context.setFillStyle('black');
        context.fillText(`第${that.data.number[index]}轮`, 25 * ratio, rankP - 50 * ratio + 23 * (index + 1));
        context.stroke();
        context.setFillStyle('#f2f2f2');
        context.fillRect(0, rankP - 45 * ratio + 24 * (index + 1), 375 * ratio, 1 * ratio);//线条
        item.text.forEach((innerItem, innerIndex) => {//rankn内容
          context.setFontSize(14 * ratio);//轮次
          context.setFillStyle('black');
          context.fillText(`${innerIndex + 1}.`, 40 * ratio, rankP + index * 20 * ratio);

          let rankContent = that.canvasWorkBreakNornal(350 * ratio, 14 * ratio, innerItem);
          //console.log(rankContent, 'rankContent')
          //循环绘制主题内容
          rankContent.forEach((rankItem, rankIndex) => {
            context.setFontSize(14 * ratio);
            context.setFillStyle("#000000");
            context.fillText(`${rankItem}`, 55 * ratio, rankP + index * 20 * ratio);
            rankP += 20 * ratio;
          })
          context.setFillStyle('#f2f2f2');
          context.fillRect(0, rankP - 16 * ratio + 20 * ratio * index, 375 * ratio, 1 * ratio);//线条
          context.stroke();
        })
        rankP += 10 * ratio;
      })

    } else {
      var rankP = rankH;
    }
    //console.log(rankP,'rankP')
    //console.log(lineCha,'linecha')
    context.setFillStyle('#A6B1F0');
    context.fillRect(0, rankP, 375 * ratio, 25 * ratio);//380 * ratio - lineCha

    context.setFontSize(16 * ratio);//所有排行榜
    context.setFillStyle('white');
    context.fillText(`筛选方案`, 15 * ratio, rankP + 18 * ratio);
    context.stroke();
    //方案
    let validPlan = this.data.validPlan;
    validPlan.forEach((innerItem, innerIndex) => {//rankn内容
      context.setFontSize(16 * ratio);//轮次
      context.setFillStyle('black');
      context.fillText(`方案${this.data.number[innerIndex]}:`, 25 * ratio, rankP + 48 * ratio);

      let rankContent = that.canvasWorkBreakNornal(250 * ratio, 16 * ratio, innerItem);
      //console.log(rankContent, 'rankContent')
      //循环绘制主题内容
      rankContent.forEach((rankItem, rankIndex) => {
        context.setFontSize(16 * ratio);
        context.setFillStyle("#000000");
        context.fillText(`${rankItem}`, 82 * ratio, rankP + 47 * ratio);
        rankP += 22 * ratio;
        //console.log(rankP,'rankP')
      })

      context.setFillStyle('#f2f2f2');
      context.fillRect(0, rankP + 33 * ratio, 375 * ratio, 1 * ratio);//线条
      context.stroke();
      rankP += 8 * ratio;
    })


    that.setData({
      canvasHeight: rankP + 30 * ratio
    })
    //console.log(that.data.canvasHeight, 'rankP');

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
    }, 300);
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

  canvasWorkBreak: function (maxWidth, fontSize, text) {//!!!!!!!!!!!!!!!!!!!!!!
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

  //点击保存到相册
  saveImg: function () {
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imagePath,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册!',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#333',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
              /* 该隐藏的隐藏 */
              that.setData({
                maskHidden: false
              })
            }
          }, fail: function (res) {
            console.log(11111)
            that.setData({
              maskHidden: false
            })
          }
        })
      }
    })
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
        //console.log('设置hasRank成功！')
        wx.redirectTo({
          url: `../report/report?reportAgain=true`
        })
      })
  },
  generate: function () {
    console.log('生成啦');
    let that = this;
    this.setData({
      maskHidden: false
    });
    wx.showToast({
      title: '生成中...',
      icon: 'loading',
      duration: 1000
    });
    setTimeout(function () {
      wx.hideToast()

      that.setData({
        maskHidden: true
      });
    }, 1000)
  },

  goIndex: function () {
    wx.redirectTo({
      url: '../index/index'
    })
  },
  cancel: function () {
    this.setData({
      maskHidden: false
    });
  },

})