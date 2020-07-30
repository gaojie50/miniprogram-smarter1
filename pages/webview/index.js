Page({
  data: {
    url:''
  },

  onLoad: function (options) {
    console.log(options);
    this.setData({
      url:decodeURIComponent('http%3A%2F%2Fkeeper.movie.st.sankuai.com%2Fbusiness%2Fbindphone%3Ftoken%3Dkeeper_eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTYwNzcyNDYsIm5iZiI6MTU5NjA3NzI0NiwiZXhwIjoxNjAxMjYxMjQ2LCJhY2NvdW50SWQiOjEwMDAwMDAwMTgwMDc1LCJzYWx0Ijoic3F4bmhvIiwiaXNUZXN0IjpmYWxzZSwiYnVzaW5lc3NJZCI6NSwidmVyc2lvbiI6IjEuNyJ9.1Owbu9gaSUbuFF0kC-9XeCTz4pGnQom9azUDFAiPU6A%26appkey%3Dcom.sankuai.keeper.data%26backToMiniprogram%3Dtrue%26continueUrl%3D%252Fpages%252Flist%252Findex')
    })
  },
})