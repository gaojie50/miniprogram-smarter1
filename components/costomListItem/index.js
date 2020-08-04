
Component({
  properties: {
    costomShow: {
      type: Boolean,
      value: ''
    }
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
      }
    }
  }
})