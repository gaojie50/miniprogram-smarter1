import Taro from '@tarojs/taro'
import projectConfig from '../constant/project-config.js'
import envConfig from '../constant/env-config.js'
import reqPacking from './reqPacking.js'
import utils from './index.js'
import { addUrlArg } from './url.js';
import auth from './auth.js';
import { set as setGlobalData, get as getGlobalData } from '../global_data.js'

const { errorHandle } = utils;
const { appkey, weixinAppTypeEnum } = projectConfig
const { keeper } = envConfig

export default function keepLogin(params) {
  let continueUrl = decodeURIComponent(params.target);

  Taro.login({
    success: ({ code }) => {
      if (code) {
        params.code = code

        return reqPacking(
          {
            url: `getTokenByCode`,
            data: {
              appkey,
              weixinAppTypeEnum,
              ...params
            }
          },
          'keeper'
        ).then(({ success, error, data }) => {
          if (success) {
            let { accessToken, hasBindMobile } = data
            
            if (hasBindMobile) {
              Taro.setStorageSync('token', accessToken);
              // 校验账号状态
              auth.checkLogin().then(res=>{
                const { authInfo } = res;
                if(res.isLogin){
                  Taro.redirectTo({ url: addUrlArg(continueUrl, 'token', accessToken) })
                  setGlobalData('authinfo', authInfo)
                  Taro.setStorageSync('authinfo', authInfo);
                }
              }).catch(res=>{
                errorHandle(res);
              })
              return;
            }

            if (Taro.canIUse('web-view')) {
              const verifyPhoneNumUrl = `${keeper}/business/bindphone?token=${accessToken}&appkey=${appkey}&backToMiniprogram=true&continueUrl=${encodeURIComponent(continueUrl)}`

              Taro.navigateTo({
                url: `/pages/webview/index?url=${encodeURIComponent(
                  verifyPhoneNumUrl
                )}`
              })
            }
            return
          }

          errorHandle(error)
        })
      }
    }
  })
}
