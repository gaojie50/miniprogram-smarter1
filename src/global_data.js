import Taro from "@tarojs/taro";
import envConfig from "./constant/env-config.js";
import reqPacking from "./utils/reqPacking.js";

const globalData = {
  APISet: envConfig,
  reqPacking,
  capsuleLocation: null,
  systemInfo: Taro.getSystemInfoSync(),
}

let rect = null;
try {
  rect = Taro.getMenuButtonBoundingClientRect ? Taro.getMenuButtonBoundingClientRect() : null;
  if (rect === null) {
    throw 'getMenuButtonBoundingClientRect error';
  }
  //取值为0的情况
  if (!rect.width) {
    throw 'getMenuButtonBoundingClientRect error';
  }
  //取值为0的情况
  if (!rect.width) {
    throw 'getMenuButtonBoundingClientRect error';
  }
} catch (error) {
  let gap = ''; //胶囊按钮上下间距 使导航内容居中
  let width = 96; //胶囊的宽度，android大部分96，ios为88
  if (systemInfo.platform === 'android') {
    gap = 8;
    width = 96;
  } else if (systemInfo.platform === 'devtools') {
    if (ios) {
      gap = 5.5; //开发工具中ios手机
    } else {
      gap = 7.5; //开发工具中android和其他手机
    }
  } else {
    gap = 4;
    width = 88;
  }
  if (!systemInfo.statusBarHeight) {
    //开启wifi的情况下修复statusBarHeight值获取不到
    systemInfo.statusBarHeight = systemInfo.screenHeight - systemInfo.windowHeight - 20;
  }
  rect = {
    //获取不到胶囊信息就自定义重置一个
    bottom: systemInfo.statusBarHeight + gap + 32,
    height: 32,
    left: systemInfo.windowWidth - width - 10,
    right: systemInfo.windowWidth - 10,
    top: systemInfo.statusBarHeight + gap,
    width: width
  };
}
globalData.capsuleLocation = rect;


export function set (key, val) {
  globalData[key] = val
}

export function get (key) {
  return globalData[key]
}
