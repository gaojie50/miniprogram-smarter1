import Taro from "@tarojs/taro";
import envConfig from "./constant/env-config.js";
import reqPacking from "./utils/reqPacking.js";

const globalData = {
    APISet: envConfig,
    reqPacking,
    capsuleLocation: Taro.getMenuButtonBoundingClientRect(),
    systemInfo: Taro.getSystemInfoSync(),
  }

if(globalData.capsuleLocation.top===0){
  globalData.capsuleLocation = { width: 87, height: 32, top: 24, left: 278, right: 365, bottom: 56 };
}
export function set (key, val) {
  globalData[key] = val
}

export function get (key) {
  return globalData[key]
}
