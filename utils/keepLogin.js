import projectConfig from '../constant/project-config';
import envConfig from '../constant/env-config';
import reqPacking from './reqPacking';
import utils from '../utils/index';

const {appkey,weixinAppTypeEnum } = projectConfig;
const {errorHandle} = utils;
const {keeper} = envConfig;

export default function keepLogin(params) {  
  return reqPacking({
    url: `getTokenByCode`,
    data: {
      appkey,
      weixinAppTypeEnum,
      ...params,
    },
  },'keeper').then(({success,error,data}) => {
    if(success){
      const { accessToken, hasBindMobile } = data;

      wx.setStorageSync('token', accessToken);
      if(hasBindMobile) return wx.redirectTo({url: `/pages/list/index`});

      if (wx.canIUse('web-view')) {
        const verifyPhoneNumUrl = `${keeper}/business/bindphone?token=${accessToken}&appkey=${appkey}&backToMiniprogram=true&continueUrl=%2Fpages%2Flist%2Findex`
        
        wx.navigateTo({ url:`/pages/webview/index?url=${encodeURIComponent(verifyPhoneNumUrl)}` })
      }
      return;
    }
    wx.redirectTo({url: `/pages/list/index`});
    errorHandle(error);
  })
}