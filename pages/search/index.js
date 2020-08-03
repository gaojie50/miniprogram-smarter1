import reqPacking from '../../utils/reqPacking';
import utils from '../../utils/index';
import projectConfig from '../../constant/project-config';

const {throttle} = utils;
const {getScheduleType} = projectConfig;

function fn(e) {
  const { value } = e.detail;

  if(value.trim() == '') return this.setData({list:[]})

  reqPacking({
    url: '/api/management/list',
    data: { name: value },
    method:'POST'
  }).then(({
    success,
    data
  }) => {
    if (success && data && data.length > 0) {
      return this.setData({ 
        list: data.map(item =>{
          item.scheduleObj = getScheduleType(item.scheduleType);
          item.pic = item.pic ? `${item.pic.replace('/w.h/', '/')}@460w_660h_1e_1c`: `../../static/icon/default-pic.svg`;

          return item;
        }) 
      })
    }

    this.setData({ list: [] })
  })
};

Page({
  data: {
    inputValue: '',
    list: [],
  },

  bindKeyInput: throttle(fn,500),

  jumpDetail:function(e){
    const {id} = e.currentTarget.dataset;
    const {list} = this.data;

    wx.navigateTo({
      url:`/pages/projectDetail/index`,
      success: function(res) {
        res.eventChannel.emit('acceptDataFromOpenerPage', { 
          item:list.filter(item => item.maoyanId == id)[0]
         })
      }
    })
  }
})