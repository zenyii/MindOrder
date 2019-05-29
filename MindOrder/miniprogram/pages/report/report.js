// miniprogram/pages/report/report.js
const app = getApp();
Page({
  data: {
    rank:[],
    number:[ "一","二","三","四","五","六","七","八","九"],
    show:false
  },

  onLoad: function (options) {
    let that = this;
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
      that.setData({
        rank:rank
      })
      //console.log(rank,'rank')
    })
    
    console.log(that.data,'haha');

  },
  lunTimes:function(e){
    let that = this;
    let show = this.data.show;
    that.setData({
      show:!show
    })
    console.log(this.data.show)
    //let id = e.currentTarget.id;

   /*  let lun = id.slice(4);
    that.setData({
      [id]:!that.data[id]
    }) */

    //console.log(that.data,'dta')
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