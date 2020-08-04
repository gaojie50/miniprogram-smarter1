
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
        pcId: 1231
      },
      {
        name: "天津猫眼",
        pcId: 1232
      },
      {
        name: "霍尔果斯猫眼",
        pcId: 1233
      },
      {
        name: "阿里巴巴影业",
        pcId: 1234
      },
      {
        name: "阿里巴巴（娱乐宝）",
        pcId: 1235
      }
    ],
    dimension: [],
    projectStatus: [],
    cost: [],
    cooperStatus: [],
    pcId: [],
    company: {}
  },
  methods:{
    tapEstimateBox:function(e){
      console.log(e);
    },
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
      const { companyList } = this.data;
      const dataList = this.data;
      if(JSON.stringify(dataList.company) == "{}"){
        for(let m=0;m < companyList.length; m++){
          dataList.company[m] = ''
        }
      }
      if(num != null){
        if(dataList.company[num] == ''){
          dataList.company[num] = 'active';
        }else{
          dataList.company[num] = '';
        }
      }
      this.setData({
        ...dataList
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
          const { companyList } = this.data;
          const dataList = this.data;
          if(companyList.length > 6){
            for(let j=1; j < companyList.length; j++){
              dataList[`cost${j}`] = false;
              dataList[`cooper${j}`] = false;
              dataList.company[j-1] = '';
            }
          }else{
            for(let j=1; j < 7; j++){
              dataList[`cost${j}`] = false;
              dataList[`cooper${j}`] = false;
              dataList.company[j-1] = '';
            }
          }
          this.setData({
            ...dataList
          })
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
        for(let j =0; j < 7; j++){
          const index = this.data.dimension[0];
          if(!this.data[`estimateBoxActive${index}`]){
            const i = this.data.dimension.indexOf(index);
            if(i != -1){
              this.data.dimension.splice(i, 1)
            }
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
        for(let j =0; j < 8; j++){
          const index = this.data.projectStatus[0];
          if(!this.data[`projectStatusActive${index}`]){
            const i = this.data.projectStatus.indexOf(index);
            if(i != -1){
              this.data.projectStatus.splice(i, 1)
            }
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
          const { companyList } = this.data;
          if(companyList.length > 6){
            for(let j=1; j < companyList.length; j++){
              if(this.data[`cost${j}`] && this.data.cost.indexOf(j) == -1){
                this.data.cost.push(j)
              }
              if(this.data[`cooper${j}`] && this.data.cooperStatus.indexOf(j) == -1){
                this.data.cooperStatus.push(j)
              }
              if(this.data.company[j-1] == 'active'){
                if(this.data.pcId.length != 0){
                  let add = true;
                  this.data.pcId.map(item => {
                    if(item.pcId == companyList[j-1].pcId){
                      add = false
                    }
                  })
                  if(add){
                    this.data.pcId.push(companyList[j-1])
                  }
                }else{
                  this.data.pcId.push(companyList[j-1])
                }
              }
            }
            for(let n =0; n < companyList.length; n++){
              const index1 = this.data.cost[n];
              const index2 = this.data.cooperStatus[n];
              if(!this.data[`cost${index1}`]){
                const i = this.data.cost.indexOf(index1);
                if(i != -1){
                  this.data.cost.splice(i, 1)
                }
              }
              if(!this.data[`cooper${index2}`]){
                const i = this.data.cooperStatus.indexOf(index2);
                if(i != -1){
                  this.data.cooperStatus.splice(i, 1)
                }
              }
              if(this.data.company[n] != 'active'){
                if(companyList[n] && this.data.pcId.length != 0 ){
                  this.data.pcId.map((item, index) => {
                    if(item.pcId == companyList[n].pcId){
                      this.data.pcId.splice(index, 1)
                    }
                  })
                }
              }
            }
          }else{
            const { companyList } = this.data;
            for(let j=1; j < 7; j++){
              if(this.data[`cost${j}`] && this.data.cost.indexOf(j) == -1){
                this.data.cost.push(j)
              }
              if(this.data[`cooper${j}`] && this.data.cooperStatus.indexOf(j) == -1){
                this.data.cooperStatus.push(j)
              }
              if(this.data.company[j-1] == 'active'){
                if(this.data.pcId.length != 0){
                  let add = true;
                  this.data.pcId.map(item => {
                    if(item.pcId == companyList[j-1].pcId){
                      add = false
                    }
                  })
                  if(add){
                    this.data.pcId.push(companyList[j-1])
                  }
                }else{
                  this.data.pcId.push(companyList[j-1])
                }
              }
            }
            for(let n =0; n < 7; n++){
              const index1 = this.data.cost[0];
              const index2 = this.data.cooperStatus[0];
              if(!this.data[`cost${index1}`]){
                const i = this.data.cost.indexOf(index1);
                if(i != -1){
                  this.data.cost.splice(i, 1)
                }
              }
              if(!this.data[`cooper${index2}`]){
                const i = this.data.cooperStatus.indexOf(index2);
                if(i != -1){
                  this.data.cooperStatus.splice(i, 1)
                }
              }
              if(this.data.company[n] != 'active'){
                if(companyList[n] && this.data.pcId.length != 0 ){
                  this.data.pcId.map((item, index) => {
                    if(item.pcId == companyList[n].pcId){
                      this.data.pcId.splice(index, 1)
                    }
                  })
                }
              }
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
      }
    },
    movieAdd: function (){
      wx.navigateTo({
        url: '/pages/searchCompany/index',
      })
    }
  }
})