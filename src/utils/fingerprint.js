import React, { useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Image, Text, ScrollView, Canvas } from '@tarojs/components';
import utils from './index.js'

const { rpxTopx, } = utils;

export default function FingerPrint({ text = Taro.getStorageSync('authinfo')?.userInfo?.id, }) {
  const styleStr = () => {
    return `
      pointer-events: none;
      width:100vw;
      height:100vh;
      overflow:hidden;
      position:fixed;
      top:0;
      left:0;
      zIndex:1;
    `
  };

  useEffect(() => {
    const ctx = Taro.createCanvasContext('fingerprint');

    ctx.beginPath();
    ctx.setFontSize(16);
    ctx.font = "lighter 28";
    ctx.setFillStyle("rgba(139, 148, 166, 0.4)");

    ctx.rotate(-20 * Math.PI / 180);

    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 8; j++) ctx.fillText(text, rpxTopx(-360 + j * 180), rpxTopx((1 + i) * 100));
    }

    ctx.draw(false, () => {
      Taro.canvasToTempFilePath({
        canvasId: 'fingerprint',
        fileType: 'png',
        success: function (res) {
          const fingerprintBoxDom = document.getElementById('fingerprintBox');
          const fingerprintCanvasDom = document.getElementById('fingerprint');

          fingerprintBoxDom.setAttribute('src', res.tempFilePath);
          fingerprintCanvasDom.style.display = 'none';
        },
      });
    })
  }, []);

  return <View style={styleStr()} >
    <Image id="fingerprintBox" style="width:100%; height:100%; opacity:0.4;" />
    <Canvas
      canvasId="fingerprint"
      className="finger-print"
      id="fingerprint"
      style="width: 100%;height: 100%;"
    />
  </View>
}