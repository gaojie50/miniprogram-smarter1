
Component({
  properties: {
    filterShow: {
      type: String,
      value: ''
    }
  },
  data: {
    companyList: [
      {
        name: "北京猫眼",
        pcId: 123
      },
      {
        name: "天津猫眼",
        pcId: 123
      },
      {
        name: "霍尔果斯猫眼",
        pcId: 123
      },
      {
        name: "阿里巴巴影业",
        pcId: 123
      },
      {
        name: "阿里巴巴（娱乐宝）",
        pcId: 123
      }
    ],
    dimension: [],
    projectStatus: [],
    cost: [],
    cooperStatus: [],
    pcId: []
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
    tapCompany: function(e){
      const num = e.target.dataset.num;
      const CompanyWrap = this.data;
      CompanyWrap[`company${num+1}`] = !CompanyWrap[`company${num+1}`];
      this.setData({
        ...CompanyWrap
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
          for(let i=1; i<8; i++){
            allData[`projectStatusActive${i}`] = false;
          }
       }else if(filterShow == '3'){
        
       }
       this.setData({
         ...allData
       })
    },
    filterDefined: function (){
      const { filterShow } = this.data;
      if(filterShow == 1){
        for(let i = 1; i < 7; i++){
          if(this.data[`estimateBoxActive${i}`] && this.data.dimension.indexOf(i) == -1){
              this.data.dimension.push(i)
          }
        }
       const { dimension,projectStatus,cost,cooperStatus,pcId } = this.data;
       const myEventDetail = {
            dimension,
            projectStatus,
            cost,
            cooperStatus,
            pcId
       }
        this.triggerEvent('myevent', myEventDetail)
      }else if(filterShow == 2){
        for(let i = 1; i < 8; i++){
          if(this.data[`projectStatusActive${i}`] && this.data.projectStatus.indexOf(i) == -1){
            this.data.projectStatus.push(i)
          }
        }
        const { dimension,projectStatus,cost,cooperStatus,pcId } = this.data;
        const myEventDetail = {
              dimension,
              projectStatus,
              cost,
              cooperStatus,
              pcId
        }
        this.triggerEvent('myevent', myEventDetail)
      }else if(filterShow == 3){

      }
    },
    movieAdd: function (){
      wx.navigateTo({
        url: '/pages/searchCompany/index',
      })
    }
  }
})