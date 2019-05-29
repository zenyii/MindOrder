/* eslint-disable camelcase */
/* eslint-disable no-return-await */
// 云函数入口文件
const cloud = require('wx-server-sdk')
const {
  SECRET,
  bucketPrefix
} = require('./config')

// 初始化云能力
cloud.init()

async function getQR(method, path, fileID) {
  const {
    APPID,
  } = cloud.getWXContext()

  try {
    await cloud.downloadFile({
      fileID: bucketPrefix + fileID
    })
    console.log('get from cos!!!')

    return { fileID: bucketPrefix + fileID }
  } catch (e) {
    console.log('get cos failed, invoke api generate!')

    const {
      WXMINIUser,
      WXMINIQR
    } = require('wx-js-utils')

    // 获取access_token
    const wXMINIUser = new WXMINIUser({
      appId: APPID,
      secret: SECRET
    })
    const access_token = await wXMINIUser.getCacheAccessToken()

    console.log('access_token: ', access_token)
    // 生成小程序码
    const wXMINIQR = new WXMINIQR()
    const qrResult = await wXMINIQR[method]({
      scene: '?code=123',
      access_token,
      path,
      is_hyaline: true
    })

    console.log(bucketPrefix + fileID)
    return await cloud.uploadFile({
      cloudPath: fileID,
      fileContent: qrResult
    })
  }
}

/**
 * 根据类型生成对应的二维码
 * @param {String} type 取值有square,mina,unlimitmina
 */
async function getQRByType(type = 'square', path = 'pages/index1/index1') {
      return await getQR('getMiniQRLimit', path, 'wcCode/limit.png')
  
}


// 云函数入口函数
exports.main = async (event) => await getQRByType(event.type)
