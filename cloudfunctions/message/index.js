// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  const ret = await db.collection('subscribe').add({
    data: {
      touser: OPENID,
      page: 'books',
      data: event.data,
      templateId: event.templateId,
      done: false
    }
  })
  return ret
}