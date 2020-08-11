import envConfig from './constant/env-config';
import reqPacking from './utils/reqPacking';

App({
  globalData: {
    APISet:envConfig,
    reqPacking,
    capsuleLocation : wx.getMenuButtonBoundingClientRect(),
    barHeight : wx.getSystemInfoSync().statusBarHeight,
  }
})