import Taro from '@tarojs/taro'
import projectConfig from '../constant/project-config.js'
import envConfig from '../constant/env-config.js'
import reqPacking from './reqPacking.js'
import utils from './index.js'

const { appkey, weixinAppTypeEnum } = projectConfig
const { errorHandle } = utils
const { keeper } = envConfig

export default function keepLogin(params) {
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
            const { accessToken, hasBindMobile } = data

            if (hasBindMobile) {
              Taro.setStorageSync('token', accessToken)
              return Taro.redirectTo({ url: `/pages/list/index` })
            }

            if (Taro.canIUse('web-view')) {
              const verifyPhoneNumUrl = `${keeper}/business/bindphone?token=${accessToken}&appkey=${appkey}&backToMiniprogram=true&continueUrl=%2Fpages%2Flist%2Findex`

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
