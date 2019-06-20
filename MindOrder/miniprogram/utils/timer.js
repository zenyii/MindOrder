var app = getApp();

export function countDown(that){
  let minute = that.data.minute;
  let second = that.data.second;
  let timer = '';
  if(minute!='0'||second!='0'){
    minute = parseInt(that.data.minute);
    second = parseInt(that.data.second);
    if(second>=0){
    return new Promise(function(res,rej){
      timer = setTimeout(function () {
        that.setData({
          second: that.data.second - 1,
        })
        countDown(that);
      }, 1000)
    })
    .then(()=>{
      clearTimeout(timer);
    })
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
          wx.redirectTo({
            url: '/pages/show/show',
           })
          }
        }
      })
  }
}