import utils from "./../../utils/index";

const {getFutureTimePeriod,calcWeek,assignDeep,checkDataType} = utils;
const  defaultCustomDate = getFutureTimePeriod();
const date = new Date();
let years = [];
let months = [];
let days = [];

for (let i = 2019; i <= date.getFullYear()+30; i++) years.push(i);
for (let i = 1; i <= 12; i++) months.push(i);
for (let i = 1; i <= 31; i++) days.push(i);

function formartDate(stamp){
  const dateObj = handleNewDate(stamp);
  const yearStr = dateObj.getFullYear();
  const monthInner = dateObj.getMonth()+1;
  const dayInner = dateObj.getDate();
  const monthStr = monthInner < 10 ? `0${monthInner}` : monthInner;
  const dayStr = dayInner< 10 ? `0${dayInner}`: dayInner;

  return `${yearStr}.${monthStr}.${dayStr}`;
}
function handleNewDate(param){
  return new Date(checkDataType(param) == 'string' ? 
  param.replace(/\.|\-/g, '/') : param);
}
function handleDays(day,long,sign='add'){
  const date = handleNewDate(day);

  if(sign == 'add') return date.setDate(date.getDate() + Number(long));

  return  date.setDate(date.getDate() - Number(long));
}
function dateValueCommon(timeStamp){
  const innerTimeStamp = handleNewDate(timeStamp);

  return [
    years.indexOf(innerTimeStamp.getFullYear()), 
    months.indexOf(innerTimeStamp.getMonth()+1), 
    days.indexOf(innerTimeStamp.getDate()),
  ]
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
    },
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
    projectBox: [
      {
        value: '筹备',
        active: false,
      },
      {
        value: '拍摄',
        active: false,
      },
      {
        value: '后期',
        active: false,
      },
      {
        value: '待过审',
        active: false,
      },
      {
        value: '已过审',
        active: false,
      },
      {
        value: '已上映',
        active: false,
      },
      {
        value: '未知',
        active: false,
      }
    ],
    costBox: [
      {
        value: '8000万以上',
        active: false,
      },
      {
        value: '5000万～8000万',
        active: false,
      },
      {
        value: '1000万～5000万',
        active: false,
      },
      {
        value: '1000万以下',
        active: false,
      },
      {
        value: '未知',
        active: false,
      }
    ],
    cooperBox: [
      {
        value: '评估中',
        active: false,
      },
      {
        value: '跟进中',
        active: false,
      },
      {
        value: '未合作',
        active: false,
      },
      {
        value: '开发中',
        active: false,
      },
      {
        value: '投资中',
        active: false,
      }
    ],
    years,
    months,
    days,
    dateValue: dateValueCommon(defaultCustomDate.startDate),
    customStartDate:{
      value:formartDate(defaultCustomDate.startDate),
      week:calcWeek(defaultCustomDate.startDate),
    },
    customEndDate:{
      value:formartDate(defaultCustomDate.endDate),
      week:calcWeek(defaultCustomDate.endDate),
    },
    dateShowFirstActive:true,
    showDateSureBtn:false,
  },
  methods: {
    dateSelect: function (e) {
      const val = e.detail.value;
      const {dateShowFirstActive,years,months,days,customEndDate,customStartDate} = this.data;
      let timeStamp = +new Date(`${years[val[0]]}/${months[val[1]]}/${days[val[2]]}`);
      let obj={};
      if(dateShowFirstActive){
        //开始时间大于结束时间 
        if(timeStamp > +handleNewDate(customEndDate.value)){
          timeStamp = +handleNewDate(customEndDate.value);
          obj.dateValue = dateValueCommon(customEndDate.value);
        }
        //一年时间限制 限制开始日期
        const minimumTimeStamp =  +handleDays(customEndDate.value,365,'subtract');
        if(timeStamp < minimumTimeStamp ){
          timeStamp = minimumTimeStamp;
          obj.dateValue = dateValueCommon(minimumTimeStamp);

          wx.showToast({
            title: '时间范围限制为1年',
            icon:'none',
          })
        }

        obj['customStartDate'] = {
          value:formartDate(timeStamp),
          week:calcWeek(timeStamp),
        }

        return this.setData(obj);
      }

      //结束时间小于开始时间
      if(timeStamp < +handleNewDate(customStartDate.value)){
        timeStamp = +handleNewDate(customStartDate.value);
        obj.dateValue = dateValueCommon(customStartDate.value);
      }

      //一年时间限制 限制结束日期
      const maxTimeStamp =  +handleDays(customStartDate.value,365);
      if(timeStamp > maxTimeStamp ){
        timeStamp = maxTimeStamp;
        obj.dateValue = dateValueCommon(maxTimeStamp);

        wx.showToast({
          title: '时间范围限制为1年',
          icon:'none',
        })
      }

      obj['customEndDate'] = {
        value:formartDate(timeStamp),
        week:calcWeek(timeStamp),
      }

      this.setData(obj);
    },

    switchDate:function(e){
      const {sign} = e.currentTarget.dataset;
      const {dateShowFirstActive,customStartDate,customEndDate} = assignDeep(this.data);
   
      if((dateShowFirstActive && sign =="begin")||(!dateShowFirstActive && sign != "begin") ) return;

      if(sign == 'begin'){
        return this.setData({
          dateShowFirstActive:true,
          dateValue:dateValueCommon(customStartDate.value)
        })
      };
      
      this.setData({ 
        dateShowFirstActive:false,
        dateValue:dateValueCommon(customEndDate.value)
      });
    },

    dateSelectEvent: function (e) {
      const { value } = e.target.dataset;
      let { dateSet,showDateSureBtn} = this.data;
    
      if(dateSet.some(item => item.value == value && item.checked=="checked" )) return;

      const dateSetVar = dateSet.map(item =>{
        item.checked = '';
        if(item.value == value) {
          item.checked = "checked";
          showDateSureBtn = item.label =='自定义'; 
        };
        return item;
      });

      this.setData({
        dateSet:dateSetVar,
        showDateSureBtn,
      },()=>{
        const {showDateSureBtn} = this.data;

        if(!showDateSureBtn) this.filterDefinedDate();
      })
    },
    tapEstimateBox: function (e) {
      const num = e.target.dataset.num;
      const newEstimateBox  = this.data.estimateBox;
      newEstimateBox[num].active = !newEstimateBox[num].active;
      this.setData({
        estimateBox: newEstimateBox
      })
    },
    tapProjectStatus: function (e) {
      const num = e.target.dataset.num;
      const newprojectBox  = this.data.projectBox;
      newprojectBox[num].active = !newprojectBox[num].active;
      this.setData({
        projectBox: newprojectBox
      })
    },
    tapCost: function (e) {
      const num = e.target.dataset.num;
      const newcostBox  = this.data.costBox;
      newcostBox[num].active = !newcostBox[num].active;
      this.setData({
        costBox: newcostBox
      })
    },
    tapCooper: function (e) {
      const num = e.target.dataset.num;
      const newcooperBox  = this.data.cooperBox;
      newcooperBox[num].active = !newcooperBox[num].active;
      this.setData({
        cooperBox: newcooperBox
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
    tapCompanyText: function (e) {
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
        if (dataList.company[num] !== '') {
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
        projectBox,
      } = this.data;
      if (filterShow == '1') {
        estimateBox.map(item => {
          item.active = false
        })
        this.setData({
          estimateBox
        })
      } else if (filterShow == '2') {
        projectBox.map(item => {
          item.active = false
        })
        this.setData({
          projectBox
        })
      } else if (filterShow == '3') {
        const dataList = this.data;
        dataList.costBox.map(item => {
          item.active = false
        })
        dataList.cooperBox.map(item => {
          item.active = false
        })
        for (let j = 0; j < dataList.companyList.length; j++) {
          dataList.company[j] = '';
        }
        this.setData({
          ...dataList
        })
      }
    },
    filterDefined: function () {
      const {
        filterShow,
        estimateBox,
        projectBox,
        costBox,
        cooperBox,
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
        const { 
          projectStatus,
        } = this.data;
        projectBox.map((item, index) => {
          if(item.active && projectStatus.indexOf(index + 1) === -1){
            projectStatus.push(index + 1);
          }
          if(!item.active && projectStatus.indexOf(index + 1) !== -1){
            const i = projectStatus.indexOf(index + 1);
            projectStatus.splice(i, 1)
          }
        })
      } else if (filterShow == 3) {
        const {
          companyList,
          cost,
          cooperStatus,
          company,
          pcId
        } = this.data;
        costBox.map((item, index) => {
          if(item.active && cost.indexOf(index + 1) === -1){
            cost.push(index + 1);
          }
          if(!item.active && cost.indexOf(index + 1) !== -1){
            const i = cost.indexOf(index + 1);
            cost.splice(i, 1)
          }
        })
        cooperBox.map((item, index) => {
          if(item.active && cooperStatus.indexOf(index + 1) === -1){
            cooperStatus.push(index + 1);
          }
          if(!item.active && cooperStatus.indexOf(index + 1) !== -1){
            const i = cooperStatus.indexOf(index + 1);
            cooperStatus.splice(i, 1)
          }
        })
        companyList.map((item, index) => {
          if(company[index] === 'active'){
            if (pcId.length !== 0) {
              let add = true;
              pcId.map(item1 => {
                if (item1.id == companyList[index].id) {
                  add = false
                }
              })
              if (add) {
                pcId.push(companyList[index])
              }
            } else {
              pcId.push(companyList[index])
            }
          }
          if(company[index] !== 'active'){
           pcId.map((item2, i) => {
             if(item2.id === companyList[index].id){
               pcId.splice(i, 1)
             }
           })
          }
        })
    }
    
      const {
        dimension,
        projectStatus,
        cost,
        cooperStatus,
        dateSet,
        pcId,
        company,
        customStartDate,
        customEndDate,
      } = this.data;
      const myEventDetail = {
        dimension,
        projectStatus,
        cost,
        cooperStatus,
        dateSet,
        pcId,
        estimateBox,
        projectBox,
        costBox,
        cooperBox,
        company,      
        customStartDate,
        customEndDate,
      }
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
        customStartDate,
        customEndDate,
      } = this.data;
      this.triggerEvent('myevent', {
        dimension,
        projectStatus,
        cost,
        cooperStatus,
        pcId,
        dateSet,
        customStartDate,
        customEndDate,
      })

    },
    movieAdd: function () {
      wx.navigateTo({
        url: '/pages/searchCompany/index',
      })
    }
  }
})