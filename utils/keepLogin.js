import projectConfig from '../constant/project-config';
import reqPacking from './reqPacking';

const {appkey,weixinAppTypeEnum } = projectConfig;

export default function keepLogin(params) {  
  return reqPacking({
    url: `getTokenByCode`,
    data: {
      appkey,
      weixinAppTypeEnum,
      ...params,
    },
  },'keeper').then(({success,data}) => {
    if(success){
      const { accessToken, hasBindMobile } = data;

      if(hasBindMobile) return wx.redirectTo({url: `/pages/index/index?token=${accessToken}`});

      wx.setStorageSync('token', accessToken);
      //_this.goto(`keeper@/business/bindphone?token=${accessToken}&appkey=${appkey}&backToMiniprogram=true&continueUrl=%2Fpages%2Fwelcome%2Findex`)
    }
  })
}