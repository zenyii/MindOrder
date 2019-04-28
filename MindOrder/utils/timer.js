var app = getApp();

export function countDown(that){
  let minute = that.data.minute;
  let second = that.data.second;
  let timer = '';
  if(minute!='0'||second!='0'){
    minute = parseInt(that.data.minute);
    second = parseInt(that.data.second);
    if(second>=0){
    timer = setTimeout(function(){
      that.setData({
        second:that.data.second-1,
      })
      countDown(that);
    },1000);
    }
    if(second<0){
      if(minute>0){
        that.setData({
          minute:that.data.minute-1,
          second : 59
        })
        countDown(that);
      }
      else{
        console.log("空")
      }
    }
    app.globalData.minute=that.data.minute;
    app.globalData.second=that.data.second;
  }
  else {
    wx.showModal({
      title: '',
      content: '个人头脑写作环节已经结束，点击"确定"前往点赞区',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../show/show',
          })
        }
      }
    })
  }
}