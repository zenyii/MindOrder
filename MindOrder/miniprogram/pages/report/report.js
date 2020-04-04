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
    reportAgain: false,//是否点击了生成按钮
    maskHidden: false,
  },

  onLoad: function (options) {

    let that = this;
    let list = [];
    let personalList = [];
    //由于导出和生成页面布局是差不多的，而且生成页面时通过导出页面点击“生成”按钮，
    //那么可以给按钮指定路径的同时传参来辨识是哪个页面
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
          ratio: res.windowWidth / 375,//适应不同手机大小，以i6为标准
        })
      },
    })

    Array.from({ length: app.globalData.term }, (v, i) => {//app.globalData.term
      rank[i] = [];
      personal[i] = [];
    })
    app.onQuery('rooms', { roomNum: app.globalData.roomNum }, { roomMaster: true, title: true, date: true, totalTime: true, validPlan: true, hasPersonal: true, hasRank: true })
      .then(res => {//初始化此次讨论的数据
        let data = res.data[0];
        let roomMasterId = data.roomMaster.openid;
        let title = data.title;
        //console.log(typeof title,'title11')
        let date = data.date;
        let totalTime = data.totalTime;
        let validPlan = data.validPlan;
        let hasPersonal = data.hasPersonal;//用户是否点击了要导出个人记录
        let hasRank = data.hasRank;//用户是否点击了要导出所有排行

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
        //这里每个词条都是一条记录，因为词条需要有所属者，集了多少赞，是第几轮发的……等等这些属性，缺一不可
        app.onQuery('words', { roomNum: app.globalData.roomNum }, { term: true, supportNum: true, text: true, openid: true, avatarUrl: true })
          .then(res => {
            if (res.data.length == 0) {
              wx.showToast({
                title: '无数据',
                duration: 1000
              })
            }
            let data = res.data;
            king = data[0];
            data.forEach((item, index) => {
              let term = item.term - 1 //第几轮数
              if (item.supportNum >= king.supportNum) king = item;//获取点赞王
              rank[term].push(item);//二维数组
              if (item.openid === app.globalData.selfOpenId) {//属于自己的词条//app.globalData.selfOpenId
                personal[term].push(item);//二维数组
              }
            })
            rank.forEach(item => {//排序
              item.sort((a, b) => b.supportNum - a.supportNum)
            })
            personal.forEach(item => {
              item.sort((a, b) => b.supportNum - a.supportNum)
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
            that.getImgTempPath(king.avatarUrl, 'kingImg'); //将网络图片转成临时路径
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
      url: url, //
      success: function (res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          //console.log(res.tempFilePath, "reererererer")
          that.setData({
            [data]: res.tempFilePath //动态生成属性
          })
        }
      }
    })
  },

  drawCanvas: function () {//绘制canvas，这里会比较繁杂，每个图案的绘制都要精确到px
    let that = this;
    let context = wx.createCanvasContext('mycanvas');
    let star = that.data.star;//获取临时路径，
    let circle = that.data.circle;
    let kingImg = that.data.kingImg;
    let kingCircle = that.data.kingCircle;
    let ratio = that.data.ratio;//获取比例调整整体大小
    let lineChaNum = 1;//如果title超过2行，绘制时需多倍的lineCha
    let lineCha = 22 * Number(ratio);//考虑到主题字多的话会折行，如果title是多行，那下面的绘制整体都需要往下移“lineCha*lineChaNum”px
    //console.log(ratio*375,'radio')
    context.setFillStyle("#ffffff");
    //context.setGlobalAlpha(0.8)
    context.fillRect(0, 0, 375 * ratio, 5000 * ratio);
    //h绘制header
    context.drawImage(star, 5 * ratio, 10 * ratio, 18 * ratio, 18 * ratio);//星星
    //console.log(lineCha,'ratio')
    let title = that.canvasWordBreak(300 * ratio, 16 * ratio, that.data.title);//限制在两行以内显示
    //console.log(that.data.title,'title')
    context.setFontSize(16 * ratio);
    context.setFillStyle('#000000');
    context.fillText(`主题:`, 25 * ratio, 25 * ratio);//主题
    //循环绘制主题内容
    var height = 25 * ratio;
    title.forEach((item, index) => {//由于主题可能会很长，拆分成几个数组，一个数组一行显示
      //if (index === 1) lineCha = 0;
      //由于一开始我是设置了2行文字显示，所以下面的所有高度都是基于此的，
      //那么如果title是1行的话lineChaNum默认为1，即减去lineCha
      //如果是2行，则lineChaNum为0，2行以上则lineChaNum为1，即整体高度加lineCha，以此类推，本项目限制了最多只能2行显示
      if (index >= 1) { lineChaNum = -1 * (index - 1) }
      context.setFontSize(16 * ratio);
      context.setFillStyle("#000000");
      context.fillText(item, 70 * ratio, height);
      height += 20 * ratio;
    })
    context.stroke();


    context.setFontSize(14 * ratio);//日期
    context.setFillStyle('gray');
    context.fillText(`日期: ${that.data.date}`, 25 * ratio, 68 * ratio - lineCha * lineChaNum);
    context.fillText(`时长: ${that.data.totalTime}`, 25 * ratio, 85 * ratio - lineCha * lineChaNum);
    context.stroke();

    context.drawImage(circle, 100 * ratio, 80 * ratio - lineCha * lineChaNum, 170 * ratio, 170 * ratio);//圈圈  2-80

    context.setFontSize(16 * ratio);
    context.setFillStyle('#000000');
    context.fillText(`本次会议有效方案`, 120 * ratio, 167 * ratio - lineCha * lineChaNum);
    context.fillText(`${that.data.validPlan.length}个`, 173 * ratio, 188 * ratio - lineCha * lineChaNum);
    context.stroke();

    context.setFillStyle('#f2f2f2');
    context.fillRect(0, 270 * ratio - lineCha * lineChaNum, 375 * ratio, 8 * ratio);

    //context.drawImage(kingImg, 165, 300-lineCha, 44, 44);//点赞王

    this.circleImg(context, kingImg, 165 * ratio, 300 * ratio - lineCha * lineChaNum, 22 * ratio);//点赞王
    context.drawImage(kingCircle, 162 * ratio, 297 * ratio - lineCha * lineChaNum, 50 * ratio, 50 * ratio);

    context.setFontSize(14 * ratio);//
    context.setFillStyle('black');
    context.fillText(`本次获赞王`, 155 * ratio, 365 * ratio - lineCha * lineChaNum);
    context.stroke();

    context.setFontSize(14 * ratio);//
    context.setFillStyle('#ffe46c');
    context.fillText(`+${that.data.king.supportNum}`, 226 * ratio, 365 * ratio - lineCha * lineChaNum);
    context.stroke();

    context.setFillStyle('#f2f2f2');
    context.fillRect(0, 375 * ratio - lineCha * lineChaNum, 375 * ratio, 4 * ratio);

    if (this.data.hasRank) {//需要绘制排行榜

      //rank
      context.setFillStyle('#8AACFF');
      context.fillRect(0, 380 * ratio - lineCha * lineChaNum, 375 * ratio, 25 * ratio);

      context.setFontSize(16 * ratio);//所有排行榜
      context.setFillStyle('white');
      context.fillText(`所有排行榜`, 15 * ratio, 399 * ratio - lineCha * lineChaNum);
      context.stroke();
      let list = that.data.list;

      var rankH = 450 * ratio - lineCha * lineChaNum;//排行榜区块距离clientTop的距离，算式是可以不固定的，
      //需要你自己每次去测试最佳高度然后纪录下来，一下高度的计算都是基于这个rankH来变化的，注意每行应该要有的高度即可
      list.forEach((item, index) => {
        context.setFontSize(14 * ratio);//轮次
        context.setFillStyle('black');//CanvasContext.fillText(string text, number x, number y, number maxWidth)
        context.fillText(`第${that.data.number[index]}轮`, 25 * ratio, rankH - 50 * ratio + 23 * (index + 1));
        context.stroke();
        context.setFillStyle('#f2f2f2');
        context.fillRect(0, rankH - 45 * ratio + 24 * (index + 1), 375 * ratio, 1 * ratio);//线条
        item.text.forEach((innerItem, innerIndex) => {//rankn内容
          context.setFontSize(14 * ratio);//轮次
          context.setFillStyle('black');
          context.fillText(`${innerIndex + 1}.`, 40 * ratio, rankH + index * 20 * ratio);

          let rankContent = that.canvasWordBreakNormal(350 * ratio, 14 * ratio, innerItem);//如果文字太多，切割成数组处理
          //console.log(rankContent, 'rankContent')
          //循环绘制主题内容
          rankContent.forEach((rankItem, rankIndex) => {//绘制每行文字
            context.setFontSize(14 * ratio);
            context.setFillStyle("#000000");
            context.fillText(`${rankItem}`, 55 * ratio, rankH + index * 20 * ratio);
            rankH += 20 * ratio;
          })
          context.setFillStyle('#f2f2f2');
          context.fillRect(0, rankH - 16 * ratio + 20 * ratio * index, 375 * ratio, 1 * ratio);//线条
          context.stroke();
        })
        rankH += 10 * ratio;//累计排行榜中每一轮绘制时应该有的初始高度
      })

    } else {
      var rankH = 380 * ratio - lineCha * lineChaNum;//如果不需要排行榜，则记录此值为绘制下一部分的起始高度
    }
    if (this.data.hasPersonal) {//绘制个人纪录，思路同排行榜一样
      //personal
      context.setFillStyle('#9AE3F0');
      context.fillRect(0, rankH, 375 * ratio, 25 * ratio);//380 * ratio - lineCha

      context.setFontSize(16 * ratio);//所有排行榜
      context.setFillStyle('white');
      context.fillText(`个人记录`, 15 * ratio, rankH + 19 * ratio);
      context.stroke();
      let personalList = that.data.personalList;

      var rankP = rankH + 70 * ratio;//承接排行榜的高度数值并调整成个人纪录需要的高度
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

          let rankContent = that.canvasWordBreakNormal(350 * ratio, 14 * ratio, innerItem);
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
      //如果没有个人纪录，则将前头的rankH赋值给rankP，之后部分的绘制再依据rankP的数值调整即可
      var rankP = rankH;//也就是说排行榜和个人纪录都各自需要一个变量（rankH和rankP）来连接彼此（关系式），最后归为一个变量（rankP）来处理，
      //数值有什么变化，最后的变量也会相应更改，下面的部分的高度都依据rankP这个变量的改动而自我调节
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

      let rankContent = that.canvasWordBreakNormal(250 * ratio, 16 * ratio, innerItem);
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

    //把当前画布指定区域的内容导出生成指定大小的图片，需要延迟一会，绘制期间耗时，生成文件的临时路径
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

  canvasWordBreak: function (maxWidth, fontSize, text) {//切割文字
    const maxNum = maxWidth / fontSize//每行最多显示几个字
    const textLength = text.length;//title字符串的长度
    let textRowArr = []
    let tmp = 0;
    let line = 2;//你需要显示的最多行数
    while (line--) {
      textRowArr.push(text.substr(tmp, maxNum))
      tmp += maxNum
      if (tmp >= textLength) {//原文的字数以及小于每次累加的最大字数
        return textRowArr
      }
      if (line === 0) {
        //console.log(textRowArr[1][0],'line')
        let length = textRowArr[1].length;
        textRowArr[1] = textRowArr[1].substr(0, length - 1);//将最后一个字符变为...
        textRowArr[1] += '…';
        return textRowArr
      }

    }
  },

  canvasWordBreakNormal: function (maxWidth, fontSize, text) {
    const maxNum = maxWidth / fontSize
    const textLength = text.length;
    let textRowArr = []
    let tmp = 0;
    while (1) {
      textRowArr.push(text.substr(tmp, maxNum))
      tmp += maxNum
      if (tmp >= textLength) {
        return textRowArr
      }
    }
  },

  //点击保存到相册
  saveImg: function () {
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imagePath,//图片的临时路径
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
  listParentTap: function (e) {//切换整块列表显示状态
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
  export: function () {//跳转到生成页面
    let that = this;
    app.onUpdateThree('rooms', app.globalData.roomId, 'hasRank', that.data.hasRank, 'hasPersonal', that.data.hasPersonal, 'reportAgain', true)
      .then(res => {
        //console.log('设置hasRank成功！')
        wx.redirectTo({//url传参，会在onload(options)函数里的options扑捉到
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

