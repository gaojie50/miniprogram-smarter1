import reqPacking from '../../utils/reqPacking';
import utils from '../../utils/index';
import projectConfig from '../../constant/project-config';

const {debounce,} = utils;
const {getScheduleType} = projectConfig;

function fn(e) {
  const { value } = e.detail;
  const innerVal = value.trim();
  
  if(innerVal == '') return this.setData({
    inputVal:'',
    list:[],
  })
  this.setData({
    loading:true
  },()=>{
    reqPacking({
      url: 'api/management/list',
      data: { name: innerVal },
      method:'POST'
    }).then(({ success,data}) => {
      if (success && data && data.length > 0) {
        return this.setData({ 
          inputVal:innerVal,
          loading:false,
          list: data.map(item =>{
            item.scheduleObj = getScheduleType(item.scheduleType);
            item.pic = item.pic ? `${item.pic.replace('/w.h/', '/')}@460w_660h_1e_1c`: `../../static/icon/default-pic.svg`;
  
            return item;
          }) 
        })
      }
  
      this.setData({ 
        inputVal:innerVal,
        loading:false,
        list: [] })
    })
  })
};

Page({
  data: {
    inputVal: '',
    list: [],
    loading:false,
  },

  bindKeyInput: debounce(fn,500),

  jumpDetail:function(e){
    const {id} = e.currentTarget.dataset;
    const {list} = this.data;
    const filterList = JSON.parse(JSON.stringify(list)).filter(({maoyanId,projectId}) => `${maoyanId}-${projectId}` == id)[0];
    console.log(filterList)
    wx.navigateTo({
      url:`/pages/projectDetail/index`,
      success: function(res) {
        res.eventChannel.emit('acceptDataFromListPage', { 
          item:filterList
         })
      }
    })
  }
})