import { Block, View, Image, Text, ScrollView } from '@tarojs/components'
import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import utils from '../../utils/index.js'
import projectConfig from '../../constant/project-config.js'
import { set as setGlobalData, get as getGlobalData } from '../../global_data'
import Filter from './filterPanel';


import './index.scss'
const { getMaoyanSignLabel } = projectConfig

const {
  rpxTopx,
  formatNumber,
  formatDirector,
  getFutureTimePeriod,
  handleReleaseDesc,
  handleNewDate,
  formatWeekDate,
} = utils

const reqPacking = getGlobalData('reqPacking')
const capsuleLocation = getGlobalData('capsuleLocation')
const barHeight = getGlobalData('barHeight')

function strip(num, precision = 12) {
  return +parseFloat(num.toPrecision(precision));
}

const HEAD_HEIGHT = capsuleLocation.bottom - capsuleLocation.top;
const SYSTEM_BAR_HEIGHT = capsuleLocation.top;

export default function Board() {

  const { component: filter } = useBoardFilter();

  return (
    <View className="board">
        <View
          className="board-header"
          style={{
            height: `${HEAD_HEIGHT}px`,
            paddingTop: `${SYSTEM_BAR_HEIGHT}px`,
          }}
        >
          <Image
            className="board-header-search"
            src="https://p0.meituan.net/ingee/84c53e3349601b84eb743089196457d52891.png"
          />
          <Text className="board-header-title">项目看板</Text>
        </View>
        <NiceTab />
        {filter}
      </View>
  )
}

class NiceTab extends React.Component {

  state = {
    list: [1, 2, 3, 4, 5]
  }

  render() {
    const { list } = this.state;
    return (
      <ScrollView className="board-tab" scrollX>
        {list.map((item) => (
          <View className="board-tab-item" key={item}>
            {item}
          </View>
        ))}
      </ScrollView>
    );
  }
}

function useBoardFilter() {
  return {
    component: (
      <View>
        <Filter titleHeight={HEAD_HEIGHT} filterShow={"1"} ongetFilterShow={() => {}} />
      </View>
    ),
  };
}