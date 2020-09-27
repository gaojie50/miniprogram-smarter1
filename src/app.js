import { Block } from "@tarojs/components";
import React from "react";
import Taro from "@tarojs/taro";
import withWeapp from "@tarojs/with-weapp";
import envConfig from "./constant/env-config.js";
import reqPacking from "./utils/reqPacking.js";

import "./app.scss";

@withWeapp({
  globalData: {
    APISet: envConfig,
    reqPacking,
    capsuleLocation: Taro.getMenuButtonBoundingClientRect(),
    barHeight: Taro.getSystemInfoSync().statusBarHeight
  }
})
class App extends React.Component {
  render() {
    return this.props.children;
  }

}

export default App;