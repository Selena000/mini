// pages/books/books.js
const db = wx.cloud.database()
Page({

  /**
   * Page initial data
   */
  data: {
    books: [],
    page: 0,
    error: ''
  },

  subscribe() {
    let templateId = 'kfUjRh1qWkmIR-KFjT2joQGBHagZK6KWqP7pSGOHxBU'
    const _this = this
    const item = {
      phrase6: {
        value: '活动'
      },
      thing1: {
        value: '这个是活动签到类型222'
      }
    }

    wx.requestSubscribeMessage({
      tmplIds: [templateId],
      success: res => {
        wx.cloud.callFunction({
          name: 'message',
          data: {
            data: item,
            templateId
          }
        }).then(res => {
          wx.showToast({
            title: '订阅成功！',
            icon: 'success'
          })
          _this.setData({
            error: JSON.stringify(res)
          })
          _this.sendSubscribe()
        }).catch(err => {
          wx.showToast({
            title: '订阅失败',
            icon: 'none'
          })
        })
      },
      complete: res => {
        console.log('complete', res)
      }
    })
  },

  sendSubscribe() {
    wx.cloud.callFunction({
      name:'sendMessage',
      complete: res => {
        // alert(ret)
        this.setData({
          error: JSON.stringify(res)
        })
        console.log(123,res)
      }
    })
  },

  getList() {
    const PAGER = 3
    const offset = this.data.page * PAGER
    const init = this.data.page === 0

    wx.showLoading({
      title: '加载中',
    })
    wx.showNavigationBarLoading()

    let ret = db.collection('books').orderBy('create_time', 'desc')

    if (offset > 0) {
      ret = ret.skip(offset)
    } 
    ret.limit(PAGER).get().then(books => {
      if (init) {
        this.setData({
          books: books.data
        })
      } else {
        this.setData({
          books: this.data.books.concat(books.data)
        })
      }
      wx.hideLoading()
      wx.hideNavigationBarLoading()
    })
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.getList()
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {
    this.setData({
      page: 0
    }, () => {
      this.getList()
    })
  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {
    this.setData({
      page: this.data.page + 1
    }, () => {
      console.log(111)
      this.getList()
    })
  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})