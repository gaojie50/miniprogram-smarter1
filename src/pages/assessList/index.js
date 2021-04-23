import {
    View,
    ScrollView,
    Text,
    Image
  } from '@tarojs/components';
import React, { useState, useMemo, useEffect, useCallback,Fragment } from 'react';
import Taro from '@tarojs/taro';
import reqPacking from '../../utils/reqPacking.js';
import Tab from '@components/tab';
import { get as getGlobalData } from '../../global_data';
import { EvaluationList } from './evaluate';
import './index.scss';

const { height, top } = getGlobalData('capsuleLocation');
const HEADER_LIST = [
  {
    key: 0,
    value: '全部',
  },
  {
    key: 1,
    value: '我发起的',
  },
  {
    key: 2,
    value: '我参与的',
  },
]

export default function AssessList() {
  const [current, setCurrent] = useState(0);

  return <Fragment>
      <View className="assess-list-title" style={{height: height, marginTop: top,}}>
        <Image className="assess-list-title-image" src="https://p0.meituan.net/ingee/84c53e3349601b84eb743089196457d52891.png"
          onClick={() => {
            Taro.navigateTo({
              url: "/pages/searchProject/index",
            });
        }}></Image>
        <Text className="assess-list-title-text">评估列表</Text>
      </View>
      <ScrollView className="assess-list-content">
        <View className="assess-list-content-title">
          {
            HEADER_LIST.map((item, index) => {
              return <View 
                className={index === current ? 'assess-list-content-title-item active' : 'assess-list-content-title-item'} 
                key={index} 
                style={{width: `${100/HEADER_LIST.length}%`}}
                onClick={() => setCurrent(index)}
                >
                  {item.value}
                </View>
            })
          }
        </View>
        <View className="assess-list-content-body">
          <EvaluationList />
        </View>
      </ScrollView>
      <Tab />
  </Fragment>
}