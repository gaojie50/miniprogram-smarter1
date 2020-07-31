
Component({
  properties: {
    filterShow: {
      type: String,
      value: ''
    }
  },
  data: {

  },
  methods:{
    tapEstimateBox: function (e){
      const num = e.target.dataset.num;
      const estimateBoxActiveWrap = this.data;
      estimateBoxActiveWrap[`estimateBoxActive${num}`] = !estimateBoxActiveWrap[`estimateBoxActive${num}`];
      this.setData({
        ...estimateBoxActiveWrap
      })
    },
    tapProjectStatus: function (e){
      const num = e.target.dataset.num;
      const projectStatusActiveWrap = this.data;
      projectStatusActiveWrap[`projectStatusActive${num}`] = !projectStatusActiveWrap[`projectStatusActive${num}`];
      this.setData({
        ...projectStatusActiveWrap
      })
    },
    tapCost: function (e){
      const num = e.target.dataset.num;
      const costWrap = this.data;
      costWrap[`cost${num}`] = !costWrap[`cost${num}`];
      this.setData({
        ...costWrap
      })
    },
    tapCooper: function (e){
      const num = e.target.dataset.num;
      const cooperWrap = this.data;
      cooperWrap[`cooper${num}`] = !cooperWrap[`cooper${num}`];
      this.setData({
        ...cooperWrap
      })
    },
    filterReset: function (){
      const { filterShow } = this.data;
      const allData = this.data;
       if(filterShow == '1'){
         for(let i=1; i<7; i++){
          allData[`estimateBoxActive${i}`] = false;
         }
       } else if(filterShow == '2') {

       }else if(filterShow == '3'){
        
       }
       this.setData({
         ...allData
       })
    }
  }
})