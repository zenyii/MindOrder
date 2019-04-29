var app = getApp();

export function countDown(that,index){
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
      countDown(that,index);
    },1000);
    }
    if(second<0){
      if(minute>0){
        that.setData({
          minute:that.data.minute-1,
          second : 59
        })
        countDown(that, index);
      }
      else{
        console.log("空")
      }
    }
    app.globalData.minute=that.data.minute;
    app.globalData.second=that.data.second;
  }
  else {
    if(index==1){
      console.log(1);
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
    if (index==2){
    console.log(2);
    wx.showModal({
      title: '',
      content: '评论环节已经结束，休息片刻后进行下一轮',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          wx.redirectTo({
            url: '../try/try',
          })
        }
      }
    })
    }
  }
}