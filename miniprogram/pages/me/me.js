// pages/me/me.js
const db = wx.cloud.database()
Page({
  data: {
    userInfo: wx.getStorageSync('userInfo')
  },
  scanCode() {
    wx.scanCode({
      success: res => {
        let code = res.result
        if (!code) {
          alert('请扫描正确的图书二维码')
          return false
        } 
        wx.showLoading({
          title: '请稍等...',
        })
        wx.cloud.callFunction({
          name: 'scanBook',
          data: {
            isbn: code
          },
          success: ({result}) => {
            console.log('result', result)
            
            db.collection('books').add({
              data: result,
              success: add => {
                if (add._id) {
                  wx.hideLoading()
                  wx.showModal({
                    title: '添加成功！',
                    content: `添加图书《${result.title}》`
                  })
                }
              }
            })
          }
        })
      }
    })
  },
  onGetUserInfo(e) {
    let userInfo = e.detail.userInfo

    wx.cloud.callFunction({
      name: 'loginTest',
      success: (res) => {
        userInfo.openid = res.result.openid
        wx.setStorageSync('userInfo', userInfo)
        console.log('userInfo', userInfo)
        this.setData({
          userInfo
        })
      }
    })
  }
})