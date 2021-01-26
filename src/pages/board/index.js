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

const FILTER_ITEMS = [
  {
    name: '最近7天',
  },
  {
    name: '项目类型',
  },
  {
    name: '合作类型',
  },
  {
    name: '筛选',
  },
]

export default function Board() {
  const { component: tab } = useStatusTab();
  const { component: filter } = useBoardFilter();

  useEffect(() => {
    PureReq_ListInfo().then((data) => {
      console.log(data);
    })
  }, [])

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
        {tab}
        {filter}
        <View className="project-add-text">
          <Text>新增项目 4个</Text>
        </View>
        <ProjectItem />
      </View>
  )
}
const NAME_MAPPING_ARR = [
  {
    name: '确定合作',
    cooperStatus: 1,
    key: 'ensureCooperate'
  },
  {
    name: '接触中',
    cooperStatus: 0,
    key: 'inContact'
  },
  {
    name: '合作暂停',
    cooperStatus: 3,
    key: 'suspendCooperate'
  },
  {
    name: '正常完结',
    cooperStatus: 2,
    key: 'normalEnd'
  },
  {
    name: '合作取消',
    cooperStatus: 4,
    key: 'cancelCooperate'
  },
];

function useStatusTab() {
  const [cooperStatus, setCooperStatus] = useState(1)
  const [data, setData] = useState([]);

  useEffect(() => {
    PureReq_Cooperation().then((data) => {
      const arr = NAME_MAPPING_ARR.map(({ name, key }) => {
        return {
          p1: name,
          p2: data[key]?.value || '',
          p3: data[key]?.value ? '部' : '-',
          p4: data[key]?.add ? '近7日' : '',
          p5: data[key]?.add ? `+${data[key].add}` : '',
        }
      })
      setData(arr);
    });

  }, [])

  return {
    component: <NiceTab list={data} />
  }
}

function NiceTab(props) {
  const { list = [], active } = props;
  return (
    <ScrollView className="board-tab" scrollX>
      {list.map((item, i) => {
        const {p1 = '-', p2 = '-', p3 = '', p4 = '近7日', p5 = ''} = item;
        return (
          (
            <View key={item} className={`board-tab-item ${i === 0 ? 'board-tab-item-head' : i + 1 === list.length ? 'board-tab-item-tail' : ''}`} key={item}>
              <View className="board-tab-item-p1">{p1}</View>
              <View className="board-tab-item-p2">
                <Text>{p2}</Text>
                <Text className="board-tab-item-p3">{p3}</Text>
              </View>
              <View className="board-tab-item-p4">
                <View>{p4}</View>
                <View className="board-tab-item-p5">{p5}</View>
              </View>
            </View>
          )
        )
      })}
    </ScrollView>
  );
}

function useBoardFilter() {
  return {
    component: (
      <View>
        <View className="board-filter">
          {
            FILTER_ITEMS.map((item) => {
              return (
                <View className="board-filter-item">
                  <Text className="board-filter-item-name">{item.name}</Text>
                  <Image
                    className="board-filter-item-img"
                    src={
                      '../../static/' +
                      (false ? 'arrow-down-active' : 'arrow-down') +
                      '.png'
                    }
                  />
                </View>
              );
            })
          }
        </View>
        {/* <Filter titleHeight={HEAD_HEIGHT} filterShow={"4"} ongetFilterShow={() => {}} /> */}
      </View>
    ),
  };
}

function ProjectItem(props) {
  return (
    <View className="project-item">
      <View className="project-item-type">
        院线电影
      </View>
      <Image
        className=".project-item-img"
        src={'../../static/welcome/show.png'}
      />
      <View className="project-item-detail">
        <View className="project-item-title">
          <View className="project-item-title-name">小伟</View>
          <View className="project-item-title-predict">
            预估
            <Text className="project-item-title-predict-num">9.18</Text>亿
          </View>
        </View>
        <View className="project-item-ps">
          <View className="project-item-publication">开发 / 跟投 / 联发</View>
          <View className="project-item-score">8.5分</View>
        </View>
        <View className="project-item-date">
          <Text>2018-02-16</Text>
        </View>
        <View className="project-item-status">
          <View className="project-item-status-text">
            <Text className="project-item-status-text-status">[开发]&nbsp;</Text>
            本周三提交三幕分场，编辑,本周三提交三幕分场，编辑
          </View>
          <View className="project-item-status-btn">
            <View>5</View>
            <Image
              className="project-item-status-btn-dropdown"
              src="../../static/icon/arrow-down.svg"
            />
          </View>
        </View>
      </View>
    </View>
  );
}

function onHandleResponse(res) {
  const { success, data, error } = res;
  if (success) return data;
  return [];
}

function PureReq_ListInfo(params) {
  return reqPacking(
    {
      url: 'api/management/lisInfo',
      data: {
        startDate: 1611072000000,
        endDate: 1611676799999,
        cooperStatus: 1,
      }
    },
    'server',
  ).then((res) => onHandleResponse(res))
}

function PureReq_Cooperation(params) {
  return reqPacking(
    {
      url: 'api/management/stateCooperation',
    },
    'server',
  ).then((res) => onHandleResponse(res))
}

