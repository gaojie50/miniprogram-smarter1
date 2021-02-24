import Taro from '@tarojs/taro'
import projectConfig from '../constant/project-config.js'
import envConfig from '../constant/env-config.js'
import reqPacking from './reqPacking.js'
import utils from './index.js'

const { appkey, weixinAppTypeEnum } = projectConfig
const { errorHandle } = utils
const { keeper } = envConfig

export default function keepLogin(params) {
  let target = params.target ? decodeURIComponent(params.target) : '';
  let continueUrl = '';

  if( target.split('?')[0] === '/pages/list/index' ){
    continueUrl = `/pages/list/index`;
  }else{
    continueUrl = `/pages/list/index?target=${encodeURIComponent(params.target)}`;
  }

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
              return Taro.redirectTo({ url: `/pages/list/index?token=${accessToken}` })
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
