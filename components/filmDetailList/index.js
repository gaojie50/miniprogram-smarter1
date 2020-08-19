Component({
  properties: {
    show: {
      type: Boolean,
      value: ''
    }
  },
  data: {
   
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
    }
  }
})