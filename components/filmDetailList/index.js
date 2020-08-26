Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    filmDistributionItem: {
      type: Object,
      value: {}
    },
  },
  data: {
    scheduleType: {
      1: "已定档",
      2: "非常确定",
      3: "可能",
      4: "内部建议",
      5: "待定",
    },
  },
  methods: {
    tapClose(){
      this.setData({
        show: false
      })
      const myEventDetail = {
        backdropShow: false
      }
      this.triggerEvent('myevent', myEventDetail)
    },
    jumpDetail(e){
      console.log(e);
      const { item } = e.currentTarget.dataset;

      wx.navigateTo({
        url: '/pages/projectDetail/index',
        success: function (res){
          res.eventChannel.emit('acceptDataFromListPage', { 
            item,
           })
        }
      })
    }
  }
})