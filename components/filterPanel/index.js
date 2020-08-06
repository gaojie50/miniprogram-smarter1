const date = new Date()
const years = []
const months = []
const days = []

for (let i = 1990; i <= date.getFullYear(); i++) {
  years.push(i)
}

for (let i = 1; i <= 12; i++) {
  months.push(i)
}

for (let i = 1; i <= 31; i++) {
  days.push(i)
}
Component({
  properties: {
    filterShow: {
      type: String,
      value: ''
    },
    companyList: {
      type: Array,
      value: []
    }
  },
  data: {
    dimension: [],
    projectStatus: [],
    cost: [],
    cooperStatus: [],
    pcId: [],
    company: {},
    dateSet: [{
        label: "未来30天",
        checked: "",
        value: 30,
      },
      {
        label: "未来90天",
        checked: "",
        value: 90,
      },
      {
        label: "未来1年",
        checked: "checked",
        value: 365,
      },
      {
        label: "自定义",
        checked: "",
        value: 'custom',
      },
    ],
    estimateBox: [
      {
        value: '10亿以上',
        active: false,
      },
      {
        value: '5亿～10亿',
        active: false,
      },
      {
        value: '1亿～5亿',
        active: false,
      },
      {
        value: '5000万～1亿',
        active: false,
      },
      {
        value: '5000万以下',
        active: false,
      },
      {
        value: '未知',
        active: false,
      }
    ],
    years: years,
    year: date.getFullYear(),
    months: months,
    month: 2,
    days: days,
    day: 2,
    value: [9999, 1, 1],
  },
  onLoad: function (){
    console.log(111)
  },
  methods: {
    bindChange: function (e) {
      const val = e.detail.value
      this.setData({
        year: this.data.years[val[0]],
        month: this.data.months[val[1]],
        day: this.data.days[val[2]]
      })
    },
    dateSelectEvent: function (e) {
      const { value } = e.target.dataset;
      const { dateSet } = this.data;

      if(dateSet.some(item => item.value == value && item.checked=="checked" )) return;

      this.setData({
        dateSet:dateSet.map(item =>{
          item.checked = '';
          if(item.value == value) item.checked = "checked";
          return item;
        })
      })
    },
    tapEstimateBox: function (e) {
      const num = e.target.dataset.num;
      const newEstimateBox  = this.data.estimateBox;
      newEstimateBox[num].active = !newEstimateBox[num].active;
      this.setData({
        estimateBox: newEstimateBox
      },()=>{
        console.log(this.data)
      })
    },
    tapProjectStatus: function (e) {
      const num = e.target.dataset.num;
      const projectStatusActiveWrap = this.data;
      projectStatusActiveWrap[`projectStatusActive${num}`] = !projectStatusActiveWrap[`projectStatusActive${num}`];
      this.setData({
        ...projectStatusActiveWrap
      })
    },
    tapCost: function (e) {
      const num = e.target.dataset.num;
      const costWrap = this.data;
      costWrap[`cost${num}`] = !costWrap[`cost${num}`];
      this.setData({
        ...costWrap
      })
    },
    tapCooper: function (e) {
      const num = e.target.dataset.num;
      const cooperWrap = this.data;
      cooperWrap[`cooper${num}`] = !cooperWrap[`cooper${num}`];
      this.setData({
        ...cooperWrap
      })
    },
    tapCompany: function (e) {
      const num = e.target.dataset.num;
      const {
        companyList
      } = this.data;
      const dataList = this.data;
      if (JSON.stringify(dataList.company) == "{}") {
        for (let m = 0; m < companyList.length; m++) {
          dataList.company[m] = ''
        }
      }
      if (num != null) {
        if (dataList.company[num] == '') {
          dataList.company[num] = 'active';
        } else {
          dataList.company[num] = '';
        }
      }
      this.setData({
        ...dataList
      })
    },
    filterReset: function () {
      const {
        filterShow,
        estimateBox,
      } = this.data;
      const allData = this.data;
      if (filterShow == '1') {
        estimateBox.map(item => {
          item.active = false
        })
      } else if (filterShow == '2') {
        for (let i = 1; i < 8; i++) {
          allData[`projectStatusActive${i}`] = false;
        }
      } else if (filterShow == '3') {
        const {
          companyList
        } = this.data;
        const dataList = this.data;
        if (companyList.length > 6) {
          for (let j = 1; j < companyList.length; j++) {
            dataList[`cost${j}`] = false;
            dataList[`cooper${j}`] = false;
            dataList.company[j - 1] = '';
          }
        } else {
          for (let j = 1; j < 7; j++) {
            dataList[`cost${j}`] = false;
            dataList[`cooper${j}`] = false;
            dataList.company[j - 1] = '';
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
    filterDefined: function () {
      const {
        filterShow,
        estimateBox,
      } = this.data;
      if (filterShow == 1) {
        const { 
          dimension,
        } = this.data;
        estimateBox.map((item, index) => {
          if(item.active && dimension.indexOf(index + 1) === -1){
            dimension.push(index + 1);
          }
          if(!item.active && dimension.indexOf(index + 1) !== -1){
            const i = dimension.indexOf(index + 1);
            dimension.splice(i, 1)
          }
        })
      } else if (filterShow == 2) {
        for (let i = 1; i < 8; i++) {
          if (this.data[`projectStatusActive${i}`] && this.data.projectStatus.indexOf(i) == -1) {
            this.data.projectStatus.push(i)
          }
        }
        for (let j = 0; j < 8; j++) {
          const index = this.data.projectStatus[0];
          if (!this.data[`projectStatusActive${index}`]) {
            const i = this.data.projectStatus.indexOf(index);
            if (i != -1) {
              this.data.projectStatus.splice(i, 1)
            }
          }
        }
        const {
          dimension,
          projectStatus,
          cost,
          cooperStatus,
          dateSet,
          pcId
        } = this.data;
        const myEventDetail = {
          dimension,
          projectStatus,
          cost,
          cooperStatus,
          dateSet,
          pcId
        }
        this.triggerEvent('myevent', myEventDetail)
      } else if (filterShow == 3) {
        const {
          companyList
        } = this.data;
        if (companyList.length > 6) {
          for (let j = 1; j < companyList.length; j++) {
            if (this.data[`cost${j}`] && this.data.cost.indexOf(j) == -1) {
              this.data.cost.push(j)
            }
            if (this.data[`cooper${j}`] && this.data.cooperStatus.indexOf(j) == -1) {
              this.data.cooperStatus.push(j)
            }
            if (this.data.company[j - 1] == 'active') {
              if (this.data.pcId.length != 0) {
                let add = true;
                this.data.pcId.map(item => {
                  if (item.id == companyList[j - 1].id) {
                    add = false
                  }
                })
                if (add) {
                  this.data.pcId.push(companyList[j - 1])
                }
              } else {
                this.data.pcId.push(companyList[j - 1])
              }
            }
          }
          for (let n = 0; n < companyList.length; n++) {
            const index1 = this.data.cost[n];
            const index2 = this.data.cooperStatus[n];
            if (!this.data[`cost${index1}`]) {
              const i = this.data.cost.indexOf(index1);
              if (i != -1) {
                this.data.cost.splice(i, 1)
              }
            }
            if (!this.data[`cooper${index2}`]) {
              const i = this.data.cooperStatus.indexOf(index2);
              if (i != -1) {
                this.data.cooperStatus.splice(i, 1)
              }
            }
            if (this.data.company[n] != 'active') {
              if (companyList[n] && this.data.pcId.length != 0) {
                this.data.pcId.map((item, index) => {
                  if (item.id == companyList[n].id) {

                    this.data.pcId.splice(index, 1)
                  }
                })
              }
            }
          }
        } else {
          const {
            companyList
          } = this.data;

          for (let j = 1; j < 7; j++) {
            if (this.data[`cost${j}`] && this.data.cost.indexOf(j) == -1) {
              this.data.cost.push(j)
            }
            if (this.data[`cooper${j}`] && this.data.cooperStatus.indexOf(j) == -1) {
              this.data.cooperStatus.push(j)
            }
            if (this.data.company[j - 1] == 'active') {
              if (this.data.pcId.length != 0) {
                let add = true;
                this.data.pcId.map(item => {
                  if (item.id == companyList[j - 1].id) {
                    add = false
                  }
                })
                if (add) {
                  this.data.pcId.push(companyList[j - 1])
                }
              } else {
                this.data.pcId.push(companyList[j - 1])
              }
            }
          }
          for (let n = 0; n < 7; n++) {
            const index1 = this.data.cost[0];
            const index2 = this.data.cooperStatus[0];
            if (!this.data[`cost${index1}`]) {
              const i = this.data.cost.indexOf(index1);
              if (i != -1) {
                this.data.cost.splice(i, 1)
              }
            }
            if (!this.data[`cooper${index2}`]) {
              const i = this.data.cooperStatus.indexOf(index2);
              if (i != -1) {
                this.data.cooperStatus.splice(i, 1)
              }
            }
            if (this.data.company[n] != 'active') {
              if (companyList[n] && this.data.pcId.length != 0) {
                this.data.pcId.map((item, index) => {
                  if (item.id == companyList[n].id) {
                    this.data.pcId.splice(index, 1)
                  }
                })
              }
            }
          }
        }
        const {
          dimension,
          projectStatus,
          cost,
          cooperStatus,
          dateSet,
          pcId
        } = this.data;
        const myEventDetail = {
          dimension,
          projectStatus,
          cost,
          cooperStatus,
          dateSet,
          pcId
        }
        console.log(this.data)
        this.triggerEvent('myevent', myEventDetail)
      }
    
      const {
        dimension,
        projectStatus,
        cost,
        cooperStatus,
        dateSet,
        pcId
      } = this.data;
      const myEventDetail = {
        dimension,
        projectStatus,
        cost,
        cooperStatus,
        dateSet,
        pcId,
        estimateBox,
      }
      console.log(dimension)
      this.triggerEvent('myevent', myEventDetail)
    },
    filterDefinedDate:function(){
      const {
        dimension,
        projectStatus,
        cost,
        cooperStatus,
        pcId,
        dateSet,
      } = this.data;
      this.triggerEvent('myevent', {
        dimension,
        projectStatus,
        cost,
        cooperStatus,
        pcId,
        dateSet,
      })

    },
    movieAdd: function () {
      wx.navigateTo({
        url: '/pages/searchCompany/index',
      })
    }
  }
})