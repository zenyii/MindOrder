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
        console.log('请求成功')
        resolve(res.data);
       /*  if (res.statusCode == 200) {
          resolve(res.data);//对应(data)=>{ }
        } else
          reject(res.data);
          console.log('请求已发送但响应失败')
          wx.hideNavigationBarLoading() */
      },
      error:function(res){
        reject('网络出错！')
        console.log('请求失败')
        wx.hideNavigationBarLoading()
      }
    });
  })
}

module.exports = {
  request: request,
}

