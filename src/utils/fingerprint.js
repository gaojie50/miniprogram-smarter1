import React from 'react';
import Taro from '@tarojs/taro';
import { View, Image, Text, ScrollView, Canvas } from '@tarojs/components';
import utils from './index.js'

const { rpxTopx, } = utils;
const width = 200;
const height = 100;

export default function FingerPrint({text=Taro.getStorageSync('authinfo')?.userInfo?.mis,}){
  const styleStr = () =>{
    return `
      pointer-events: none;
      width:100vw;
      height:100vh;
      position:fixed;
      top:0;
      left:0;
    `
  };
  
  const ctx = Taro.createCanvasContext('fingerprint');

  ctx.rotate(-20 * Math.PI / 180); 

  ctx.beginPath();
  ctx.setFontSize(16);
  ctx.font = "lighter 28";
  ctx.setFillStyle("rgba(139, 148, 166, 0.4)");

  ctx.fillText(text, 0, rpxTopx(height),rpxTopx(height));
  
  ctx.draw(false,()=>{
    Taro.canvasToTempFilePath({
      canvasId: 'fingerprint',
      fileType: 'png',
      success: function (res) {
        document.getElementById('fingerprintBox')
          .style
          .background = `url(${res.tempFilePath}) repeat`;
      },
    });
  });

  return <View id='fingerprintBox' style={styleStr()} >
    <Canvas 
      canvasId="fingerprint" 
      className="finger-print"
      id="fingerprint" 
      style={`
        width: ${width}rpx;
        height: ${height}rpx;
        visibility:hidden;
      `}
      />
  </View> 
}