import projectConfig from '../../constant/project-config';
import utils from '../../utils/index';

const {getMaoyanSignLabel,getProjectStatus,getCooperStatus} = projectConfig;
const {formatNumber} = utils;

Page({
  data: {},

  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel();

    eventChannel.on && eventChannel.on('acceptDataFromOpenerPage', ({item={}}) => {
      if(item.maoyanSign && item.maoyanSign.length>0){
       item.maoyanSignLabel =  getMaoyanSignLabel(item.maoyanSign);
      }
      
      item.movieType = item.movieType.split(',').join('/');
      item.cost = (item.cost !== null && `${Math.ceil(item.cost)}万`) || '-';
      item.estimateBox = (item.estimateBox !== null && formatNumber(item.estimateBox / 100, 'floor').text) || '-';
      item.wishNum = formatNumber(item.wishNum).text;
      item.projectStatus = getProjectStatus(item.projectStatus).label;
      item.cooperStatus = getCooperStatus(item.cooperStatus).label;
      this.setData({data:item});
    })
  },
})