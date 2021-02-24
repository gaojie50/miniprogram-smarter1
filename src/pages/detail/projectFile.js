import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { AtFloatLayout } from '@components/m5';
import { CooperStatus } from './constant';
import { set as setGlobalData, get as getGlobalData } from '../../global_data';
import Enclosure from '@static/detail/file.png';
import Close from '@static/close.png';
import './projectFile.scss';
import dayjs from 'dayjs';

const reqPacking = getGlobalData('reqPacking');
export default function ProjectFile(props) {
  const { fileData } = props;

  return (
    <AtFloatLayout scrollY={false} className="projectFile" onClose={() => props.cancelShow()} isOpened>
      <View className="title">
        <Text>项目文件({fileData.length})</Text>
        <View className="img" onClick={() => props.cancelShow()}>
          <Image src={Close} alt=""></Image>
        </View>
      </View>
      <View className="file-item">
        <ScrollView className="scroll" scrollY>
        {
          fileData.map((item, index) => {
            return  <View className="item" key={index} onClick={() => handleFile(item)}>
            <Image className="left" src={Enclosure} alt=""></Image>
            <View className="right">
              <View className="name">{item.profileName}</View>
              <View className="describe">
                <Text>{item.uploader} {dayjs(item.uploadTime).format('YYYY.MM.DD HH:mm')}</Text>
                <Text style={{marginLeft: '40rpx'}}>{item.profileSize}</Text>
              </View>
            </View>
          </View>
          })
        }
        </ScrollView>
      </View>
    </AtFloatLayout>
  )
}

function handleFile(item) {
  Taro.downloadFile({
    url: item.url.replace('s3plus.vip.sankuai.com', 's3plus.sankuai.com'),
    success: function (res) {
      var filePath = res.tempFilePath
      Taro.openDocument({
        filePath: filePath,
        success: function (res) {
          console.log('打开文档成功')
        },
        fail: function(res){
          console.log(res);
        }
      })
    }
  })
}
