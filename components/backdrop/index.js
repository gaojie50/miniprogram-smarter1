
Component({
  properties: {
    backdropShow: {
      type: String,
      value: ''
    }
  },
  methods: {
    tapFilterBackdrop: function () {
      const cancelPanel = {
        backdropShow: '',
        filterActive: '',
      }
      this.triggerEvent('myevent', cancelPanel)
    },
    tapCostomBackdrop: function () {
      const cancelPanel = {
        backdropShow: '',
        costomShow: false,
      }
      this.triggerEvent('myevent', cancelPanel)
    },
  }
})