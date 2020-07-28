// pages/add-projectInfo/add-projectInfo.js
Page({

  data: {
    movieType: '',
    movieType: false,
    movieTypeButton: [
      {
          type: 'primary',
          className: '',
          text: '确定',
          value: 1
      }
   ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },

  buttontap(e) {
    console.log(e.detail)
},
  open: function () {
    this.setData({
      movieType: true
    })
},
})