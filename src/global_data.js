import Taro from "@tarojs/taro";
import envConfig from "./constant/env-config.js";
import reqPacking from "./utils/reqPacking.js";

const globalData = {
    APISet: envConfig,
    reqPacking,
    capsuleLocation: Taro.getMenuButtonBoundingClientRect(),
    barHeight: Taro.getSystemInfoSync().statusBarHeight
  }
export function set (key, val) {
  globalData[key] = val
}

export function get (key) {
  return globalData[key]
}
