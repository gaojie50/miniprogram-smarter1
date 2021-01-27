import { View, Image, Text } from '@tarojs/components';
import React from 'react';
import { CategoryList } from '../constant';
import Cover from '../../../static/detail/cover.png';
import ReaseTime from './releaseTime';
import './index.scss';

export default class BasicData extends React.Component {
  render() {
    const { data, keyData, judgeRole } = this.props;
    const newPic = data.pic ? `${data.pic.replace('/w.h/', '/')}@200w_274h_1e_1c` : Cover;
    return (
      <View className="basic-data">
        <View className="basic-data-top">
          <View className="img">
            <View className="border"></View>
            <Image src={ newPic } alt=""></Image>
            {data.category && <View className="label" style={{ backgroundImage: `url(${CategoryList[ data.category ].icon})`}}>{CategoryList[ data.category ].label}</View>}
          </View>
          <View className="basic-data-top-right">
            <View className="title">{data.name}</View>
            <View className="tag-list">
              {
                data.cooperType && data.cooperType.length > 0 ?
                data.cooperType.map((item, index) => {
                  return <Text key={index} className="tag">{item}</Text>
                }) : ''
              }
            </View>
            {data.type && data.type.length > 0 ? <View className="text">{data.type.join('/')}</View> : ''}
            {(data.category === 3 || data.category === 4) && data.duration ? <View className="text">{data.duration}分钟</View> : ''}
            {(data.category === 1 || data.category === 2) && data.duration && data.totalTvNumber ? <View className="text">共{data.totalTvNumber}集，每集{basicData.duration}分钟</View> : ''}
            {data.category === 5 && data.duration && data.totalTvNumber ? <View className="text">共{data.totalTvNumber}集</View> : ''}
            {data.movieSource && data.movieSource.length > 0 ? <View className="text">{data.movieSource.join('/')}</View> : ''}
          </View>
          {keyData.releaseTime ? <ReaseTime data={keyData} judgeRole={ judgeRole } /> : ''}
        </View>
        <View>
          <View className="basic-data-bottom">
            <View className="itemWrap">
              {data.newDirector &&  <View className="item">导演：{data.newDirector.join('/')}</View>}
              {data.newMainRole &&  <View className="item">主演：{data.newMainRole.join('/')}</View>}
              {data.mainProduct &&  <View className="item">出品方：{data.mainProduct.join('/')}</View>}
              {data.mainIssue &&  <View className="item">发行方：{data.mainIssue.join('/')}</View>}
            </View>
            <View className="arrow"></View>
          </View>
        </View>
      </View>
    )
  }
}