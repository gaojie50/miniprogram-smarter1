import reqPacking from '../../utils/reqPacking';
import utils from './../../utils/index';

const {throttle} = utils;

function fn(e) {
  const { value } = e.detail;

  if(value.trim() == '') return this.setData({list:[]})

  reqPacking({
    url: '/api/company/search',
    data: {
      keyword: value,
    }
  }).then(({
    success,
    data
  }) => {
    if (success && data.respList && data.respList.length > 0) {
      return this.setData({
        list: data.respList.map(item=>{
          item.checked='';
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
    checked:[],
    hadItem:function(checked,id){
      return checked.some(item => item.id == id);
    }
  },

  bindKeyInput: throttle(fn,500),
  
  touchCheckEvent:function(e) {
    const {name,id} = e.target.dataset;
    const {checked,list} = this.data;
    
    if(checked.some(item => item.id == id)){
      return this.setData({
        checked:checked.filter(item => item.id != id),
        list:list.map(item => {
          if(id == item.id) item.checked ='';
          return item;
        })
      })
    }

    checked.push({ id,name })
    this.setData({ 
      checked,
      list:list.map(item => {
        if(id == item.id) item.checked='checked';
        return item;
      })
     })
  },

  jumpList:function(){
    const {checked} = this.data;

    wx.navigateTo({
      url:`/pages/list/index`,
      success: function(res) {
        //向list页面传递数据
        res.eventChannel.emit('acceptDataFromOpenerPage', { companyChecked : checked })
      }
    })
  }
})