var utils = require('../utils/util.js');
/**
 * 网路请求
 */
function request(url, data, method,header) {
  let that = this;
  wx.showNavigationBarLoading();
  return new utils.promise((resolve, reject) => {
    wx.request({
      url: url,
      data: data,
      method: method,
      /* header: {
        'Content-Type': 'application/json'
      }, */
      header:{
        'Content-Type':header
      },
      success: function (res) {
        resolve(res.data);
      },
      error:function(res){
        reject('网络出错！')
        wx.hideNavigationBarLoading()
      }
    });
  })
}

module.exports = {
  request: request,
}

