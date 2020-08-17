Component({
  properties: {
    costomShow: {
      type: Boolean,
      value: ''
    }
  },
  data: {
    costom10: true,
    costom11: true,
  },
  methods: {
    tapCostom: function (e) {
      const num = e.target.dataset.num;
      const costomWrap = this.data;
      costomWrap[`costom${num}`] = !costomWrap[`costom${num}`];
      this.setData({
        ...costomWrap
      })
    },
    tapClose: function (){
      const costomWrap = this.data;
      costomWrap.costomShow = false;
      this.setData({
        ...costomWrap
      })
      const myEventDetail = {
        backdropShow: false
      }
      this.triggerEvent('myevent', myEventDetail)
    },
    tapDefined: function (){
      const costomList = [];
      for(let i=1; i<13; i++){
        if(this.data[`costom${i}`]){
          costomList.push(i)
        }
      }
      if(costomList.length < 9){
        this.triggerEvent('myevent', costomList)
      } else {
        wx.showToast({
          title: '至少保留4项！',
          icon: 'none',
          duration: 2000
        })
      }
    }
  }
})