import {
    View,
    ScrollView,
    Text,
    Image
  } from '@tarojs/components';
import React, { useState, Fragment } from 'react';
import Taro, { useDidShow, useShareAppMessage } from '@tarojs/taro';
import Tab from '@components/tab';
import lx from '@analytics/wechat-sdk';
import { get as getGlobalData } from '../../global_data';
import { EvaluationList } from './evaluate';
import reqPacking from '../../utils/reqPacking';
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
  const [offset, setOffset] = useState(0);

  useDidShow(() => {
    setOffset(0)
    const { userInfo } = Taro.getStorageSync('authinfo');
    lx.pageView('c_movie_b_8gwiwttn', {
      custom: {
        user_id: userInfo.keeperUserId,
      }
    });
  })


  useShareAppMessage(res => {
    const { target, from } = res;
    if (from != 'button') return;
    const { userInfo } = Taro.getStorageSync('authinfo');
    const { dataset } = target;
    const { realName = "" } = userInfo;
    const { projectId, pic } = dataset;
    return new Promise((resolve, reject) => {
      let shareMessage = {}
      switch (dataset.sign) {
        case 'invite': {
          Taro.showLoading({
            title: '分享信息获取中',
          })
          reqPacking(
            {
              url: `api/management/shareEvaluation?roundId=${dataset.roundId}`,
              method: 'POST'
            },
            'server',
          ).then(_res => {
            Taro.hideLoading();
            const { success, error, data } = _res;
            if (success) {
              const { inviteId, participationCode } = data;
              shareMessage = {
                title: `${realName} 邀请您参与《${dataset.roundTitle}》项目评估`,
                imageUrl: pic ? pic : 'https://s3plus.meituan.net/v1/mss_e2821d7f0cfe4ac1bf9202ecf9590e67/cdn-prod/file:96011a7c/logo.png',
                path: `/pages/assess/index/index?projectId=${projectId}&roundId=${dataset.roundId}&inviteId=${inviteId}&participationCode=${participationCode}`
              };
              resolve(shareMessage)
            } else {
              Taro.showToast({
                title: error.message,
                icon: 'none'
              })
              reject('分享信息获取失败');
            }
          }).catch(() => {
            reject('分享信息获取失败');
          })
          break;
        };
        case 'attend': {
          shareMessage = {
            title: `${realName} 分享给您关于《${dataset.roundTitle}》项目的报告`,
            imageUrl: pic ? pic : 'https://s3plus.meituan.net/v1/mss_e2821d7f0cfe4ac1bf9202ecf9590e67/cdn-prod/file:96011a7c/logo.png',
            path: `/pages/result/index?projectId=${projectId}&roundId=${dataset.roundId}`
          }
          resolve(shareMessage)
          break;
        }
        default: {
          shareMessage = {
            title: '分享报告',
            path: `/pages/result/index?projectId=${projectId}&roundId=${dataset.roundId}`,
          };
          resolve(shareMessage);
        }
      }
    })
  })

  

  return <Fragment>
      <View className='assess-list-title' style={{height: height, marginTop: top,}}>
        <Image className='assess-list-title-image' src='https://p0.meituan.net/ingee/84c53e3349601b84eb743089196457d52891.png'
          onClick={() => {
            Taro.navigateTo({
              url: "/pages/searchProject/index",
            });
        }}
        ></Image>
        <Text className='assess-list-title-text'>评估列表</Text>
      </View>
      <ScrollView 
        className='assess-list-content' 
        scrollY
        id={`start${current}`}
        style={{height: `calc(100vh - ${height}px - ${top}px)`,marginBottom: '56px'}}
        scrollIntoView={`start${current}`}
        scrollWithAnimation
        onScrollToLower={() => {
          setOffset(offset + 10);
        }}
      >
        <View className='assess-list-content-title' style={{top: `calc(${height}px + ${top}px)`}}  >
          {
            HEADER_LIST.map((item, index) => {
              return <View 
                className={index === current ? 'assess-list-content-title-item active' : 'assess-list-content-title-item'} 
                key={index} 
                style={{width: `${100/HEADER_LIST.length}%`}}
                onClick={() => {setCurrent(index); setOffset(0)}}
              >
                  {item.value}
                </View>
            })
          }
        </View>
        
        <View className='assess-list-content-body'>
          <EvaluationList type={current} offset={offset} />
        </View>
      </ScrollView>
      <Tab />
  </Fragment>
}