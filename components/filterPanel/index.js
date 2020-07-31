
Component({
  properties: {
    filterShow: {
      type: String,
      value: ''
    }
  },
  data: {
    estimateBoxActive1: false,
    estimateBoxActive2: false,
    estimateBoxActive3: false,
    estimateBoxActive4: false,
    estimateBoxActive5: false,
    projectStatusActive1: false,
    projectStatusActive2: false,
    projectStatusActive3: false,
    projectStatusActive4: false,
    projectStatusActive5: false,
    cost1: false,
    cost2: false,
    cost3: false,
    cost4: false,
    cooper1: false,
    cooper2: false,
    cooper3: false,
    cooper4: false,
    cooper5: false,
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