// miniprogram/pages/report/report.js
const app = getApp();
Page({
  data: {
    rank: [],
    personal: [],
    number: ["一", "二", "三", "四", "五", "六", "七", "八", "九"],
    list: [],
    personalList: [],
    show: false,
    personalShow: false,
    rankbg: false,
    tipsss: true,
    king:{},
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
    Array.from({ length: 3 }, (v, i) => {//app.globalData.term
      rank[i] = [];
      personal[i] = [];
    })
    app.onQuery('rooms', { roomNum: app.globalData.roomNum }, { title: true, date: true, totalTime: true}).then(res=>{
      let data=res.data[0];
      king.title = data.title;
      king.date = data.date;
      king.totalTime = data.totalTime;
    })
    //排序轮数排行榜数据 
    app.onQuery('words', { roomNum: app.globalData.roomNum }, { term: true, supportNum: true, text: true, openid: true ,avatarUrl:true})
    .then(res => {
      let data = res.data;
      king = data[0];
      console.log(data, 'data')
      data.forEach((item, index) => {
        if(item.supportNum>=king.supportNum) king=item;
        rank[item.term - 1].push(item);
        if (item.openid === 'oGw5W49WStN-HbdVgfbSxykI8SC0') {//属于自己的词条//app.globalData.selfOpenId
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
      console.log(king, 'king');
    })
  },

  listTap: function (e) {
    let Index = e.currentTarget.dataset.parentindex,//获取点击的下标值
      list = this.data.list;
    list[Index].show = !list[Index].show || false;//变换其打开、关闭的状态
    if (list[Index].show) {//如果点击后是展开状态，则让其他已经展开的列表变为收起状态
      //this.packUp(list, Index);
    }

    this.setData({
      list
    });

  },
  personalListTap: function (e) {
    let Index = e.currentTarget.dataset.parentindex,//获取点击的下标值
      personalList = this.data.personalList;
    personalList[Index].personalShow = !personalList[Index].personalShow || false;//变换其打开、关闭的状态
    if (personalList[Index].personalShow) {//如果点击后是展开状态，则让其他已经展开的列表变为收起状态
      //this.packUp(list, Index);
    }

    this.setData({
      personalList
    });

  },
  listParentTap: function (e) {
    console.log(e, 'e');
    let that = this;
    this.setData({
      show: !that.data.show
    })
  },
  personalListParentTap: function (e) {
    console.log(e, 'e');
    let that = this;
    this.setData({
      personalShow: !that.data.personalShow
    })
  },
  checkboxChange: function (e) {
    let that = this;
    this.setData({
      tipsss: false,
      show: !that.data.show,
      rankbg: !that.data.rankbg
    })
  },
  personalCheckboxChange: function (e) {
    let that = this;
    this.setData({
      personalShow: !that.data.personalShow,
      personalbg: !that.data.personalbg
    })
  },
  /* listItemTap:function(e){

  }, */


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