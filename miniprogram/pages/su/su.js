const db = wx.cloud.database()
const collection = db.collection('mini')
Page({
  data: {
    movies: [],
    inputValue: '123',
    message: 'I am suhong....',
    todos: [],
    view: '',
    staffA: {firstName: 'Hulk', lastName: 'Hu'},
    staffB: {firstName: 'Shang', lastName: 'You'},
    staffC: {firstName: 'Gideon', lastName: 'Lin'}
  },
  clickMe(event) {
    // wx.showToast({
    //   title: 'click me !!!'
    // })
    this.setData({
      message: '123',
      todos: this.data.todos.concat('aaaa')
    })
  },
  getPhoneNumber: function(event) {
    console.log(event)
    alert(event)
  },
  onLoad() {
    this.getDataList()
  },
  getDataList() {
    collection.get().then(res => {
      // console.log(res)
      this.setData({
        todos: res.data
      })
    })
  },
  bindKeyInput(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  addTodo() {
    let obj = {
      title: this.data.inputValue,
      done: false
    }
    wx.showLoading({
      title: '添加中...',
    })
    collection.add({
      data: obj
    }).then(res => {
      console.log('res', res)
      wx.hideLoading()
      this.setData({
        todos: this.data.todos.concat(obj)
      })
    })
  },
  remove(e) {
    console.log(e)
    console.log('e.currentTarget.item._id', e.currentTarget)
    let id = e.currentTarget.dataset.item._id
    collection.doc(id).remove({
      success: function(res) {
        console.log('res', res)
        console.log('删除成功')
        this.getDataList()
      }
    })
  },
  handleCloudFn() {
    wx.cloud.callFunction({
      name: 'top250',
      data: {
        a: 1,
        b: 2
      },
      success: (res) => {
        console.log('res', res)
        this.setData({
          movies: res.result.movies
        })
      }
    })
  }
})