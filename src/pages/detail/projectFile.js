import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { AtFloatLayout } from '@components/m5';
import { CooperStatus } from './constant';
import { set as setGlobalData, get as getGlobalData } from '../../global_data';
import utils from '@utils/index';
import Enclosure from '@static/detail/file.png';
import Close from '@static/close.png';
import './projectFile.scss';
import dayjs from 'dayjs';

const { previewFile } = utils;
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
          fileData.length ===0 ? <View className="noFiles">
            <Image className="img" src="../../static/detail/noFollows.png"></Image>
            <View className="text">暂无项目文件</View>
          </View> 
          : fileData.map((item, index) => {
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
  const {profileName, url} = item;
  previewFile( url, profileName );
}
