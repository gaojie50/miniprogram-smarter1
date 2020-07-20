import {appkey} from '../constant/project-config';
import {keeper} from '../constant/env-config';
import {errorHandle} from './util';

export default function login() {  
  return new Promise((resolve,reject) => {
    wx.login({
      success(res) {
        if (res.code) {
          reqPacking({
            url: `${keeper}/getTokenByCode`,
            data: {
              code: res.code,
              appkey,
              // weixinAppTypeEnum: 1,
              // encryptedData,
              // iv
            },
          }).then((success,error,data) => {
            if(success){
              const { accessToken, hasBindMobile } = data;

              if(hasBindMobile) return wx.redirectTo({url: `/pages/index/index?token=${accessToken}`});

              wx.setStorageSync('token', accessToken);
              //_this.goto(`keeper@/business/bindphone?token=${accessToken}&appkey=${appkey}&backToMiniprogram=true&continueUrl=%2Fpages%2Fwelcome%2Findex`)
            }

          })
        } else {
          errorHandle({
            msg: '获取code失败',
            detail: res,
          });
        }
      },
      fail: err => errorHandle({
        msg: '微信登录失败',
        detail: err,
      }),
    });
  });
}