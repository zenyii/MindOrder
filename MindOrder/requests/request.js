var utils = require('../utils/util.js');
/**
 * 网路请求
 */
function request(url, data, method) {
  let that = this;
  wx.showNavigationBarLoading();
  return new utils.promise((resolve, reject) => {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (res.statusCode == 200) {
          resolve(res.data);//对应(data)=>{ }
        } else
          reject(res.data);
          wx.hideNavigationBarLoading()
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

