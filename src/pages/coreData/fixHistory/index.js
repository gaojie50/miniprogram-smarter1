import React, {useState} from 'react';
import { View, Image, Text, ScrollView, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import utils from '@utils/index.js';
import ArrowLeft from '@static/detail/arrow-left.png';
import { UseHistory } from '@pages/board/history';
import { get as getGlobalData } from '../../../global_data';
import './index.scss';


export default function fixHistory() {
  const systemInfo = Taro.getSystemInfoSync();
  const { rpxTopx } = utils;
  const capsuleLocation = getGlobalData('capsuleLocation');
  const headerBarHeight = capsuleLocation.bottom + rpxTopx(15);
  const url = Taro.getCurrentPages();
  const options  = url[url.length-1].options;
  const {projectId, name, isMovieScreening} = options

  const handleBack = () => {
    if(Taro.getCurrentPages().length>1){
      Taro.navigateBack();
    }else {
      Taro.redirectTo({
        url: `/pages/coreData/index?name=${name}&projectId=${projectId}&isMovieScreening=${isMovieScreening}`,
      })
    }
  }
  return(
    <View>
      <View className='detail-top' style={{ height: `${headerBarHeight}px` }}>
          <View className='top'>
            <View className='header'>
              <View className='backPage' onClick={handleBack}>
                <Image src={ArrowLeft}></Image>
              </View>
              <Text className='header-title'>变更记录</Text>
            </View>
          </View>
        </View>
        <ScrollView scrollY style={{ height: `${systemInfo.windowHeight - headerBarHeight}px`, marginTop: headerBarHeight, background: '#F8F8F8'}}>
          <View className='fix-history'>
            <UseHistory projectId={projectId} queryType='1'></UseHistory>
          </View>
        </ScrollView>
    </View>
  )
}