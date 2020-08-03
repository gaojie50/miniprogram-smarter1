Page({
  data: {
    url:''
  },

  onLoad: function (options) {
    console.log(decodeURIComponent(options.url));
    this.setData({ url:decodeURIComponent(options.url) })
  },
})