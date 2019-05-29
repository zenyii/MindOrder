// miniprogram/pages/report/report.js
const app = getApp();
Page({
  data: {
    rank:[],
    number:[ "一","二","三","四","五","六","七","八","九"],
    list:[],
    show:false,
    rankbg:false,
    tipsss:true
  },

  onLoad: function (options) {
    let that = this;
    let list = [];
    wx.setNavigationBarTitle({
      title: '会议报告',
    });
    let rank = [];//记得缓存
    //排序轮数排行榜数据
    app.onQuery('words',{'roomNum':'150720'},{term:true,supportNum:true,text:true}).then(res=>{
      let data = res.data;
      data.forEach(item=>{
        rank[item.term-1]=[];
      })
      
      data.forEach((item,index)=>{
        rank[item.term-1].push(item);
      })
      
      rank.forEach(item=>{
        item.sort((a,b)=>{
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
      rank.forEach((items,indexs)=>{
        list[indexs]={};
        let text = list[indexs].text = [];
        items.forEach(item=>{
          text.push(item.text);
        })
      })
      //console.log(list,'list');
      that.setData({
        rank,
        list
      })
    })
    

  },
  lunTimes:function(e){
  /*   let that = this;
>>>>>>> 66eb74bfdcd11256933b1a8b118474d76f1bac37
    let show = this.data.show;
    that.setData({
      show:!show
    })
<<<<<<< HEAD
    console.log(this.data.show)
=======
    console.log(this.data.show) */
    //let id = e.currentTarget.id;

   /*  let lun = id.slice(4);
    that.setData({
      [id]:!that.data[id]
    }) */

    //console.log(that.data,'dta')
  },

  listTap:function(e){
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
  listParentTap:function(e){
    console.log(e,'e');
    let that = this;
    this.setData({
      show:!that.data.show
    })
  },
  checkboxChange:function(e){
    let that = this;
    this.setData({
      tipsss:false,
      show:!that.data.show,
      rankbg:!that.data.rankbg
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