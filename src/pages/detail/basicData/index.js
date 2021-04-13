import { View, Image, Text, ScrollView } from '@tarojs/components';
import React from 'react';
import FloatCard from '@components/m5/float-layout';
import { defaultMovieCover as Cover } from '@utils/imageUrl';
import Close from '@static/close.png';
import OmitTip from '@components/omitTip';
import '@components/m5/style/components/float-layout.scss';
import { CategoryList, BasicItem } from '../constant';
import ReaseTime from './releaseTime';
import './index.scss';

export default class BasicData extends React.Component {
  state = {
    showFloat: false,
  }

  judgeShowBasicItem = item => {
    const { data } = this.props;
    return data[item] && data[item].length > 0
  }

  handleClick = () => {
    this.props.changeStopScroll();
    this.setState({
      showFloat: true
    })
  }

  handleClose = () => {
    this.props.changeStopScroll()
    this.setState({
      showFloat: false
    })
  }

  render() {
    const { data, keyData, judgeRole } = this.props;
    const newPic = data.pic ? `${data.pic.replace('/w.h/', '/')}@200w_274h_1e_1c` : Cover;
    return (
      <View className="basic-data">
        <View className="basic-data-top">
          <View className="img">
            <View className="border"></View>
            <Image src={ newPic } alt=""></Image>
            {data.category >= 0 ? <View className="label" style={{ backgroundImage: `url(${CategoryList[ data.category ].icon})`}}>{CategoryList[ data.category ].label}</View> : null}
          </View>
          <View className="basic-data-top-right">
            <View className="title">
              <OmitTip content={data.name} tag="Text"></OmitTip>
            </View>
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
            {(data.category === 1 || data.category === 2) && data.duration && data.totalTvNumber ? <View className="text">共{data.totalTvNumber}集，每集{data.duration}分钟</View> : ''}
            {data.category === 5 && data.duration && data.totalTvNumber ? <View className="text">共{data.totalTvNumber}集</View> : ''}
            {data.movieSource && data.movieSource.length > 0 ? <View className="text">{data.movieSource.join('/')}</View> : ''}
          </View>
          {keyData.releaseTime ? <ReaseTime data={keyData} judgeRole={ judgeRole } onClose={this.handleClose.bind(this)} /> : ''}
        </View>
        <View>
            {
              this.judgeShowBasicItem('newDirector') || this.judgeShowBasicItem('newMainRole') || this.judgeShowBasicItem('mainControl') || this.judgeShowBasicItem('mainProduct') || this.judgeShowBasicItem('mainIssue') ? 
              <View className="basic-data-bottom" onClick={this.handleClick}>
                <View className="itemWrap">
                  {data.newDirector && data.newDirector.length > 0 &&  <View className="item">导演：{data.newDirector.join('/')}</View>}
                  {data.newMainRole && data.newMainRole.length > 0 &&  <View className="item">主演：{data.newMainRole.join('/')}</View>}
                  {data.mainControl && data.mainControl.length > 0 && <View className="item">主控方：{data.mainControl}</View>}
                  {data.mainProduct && data.mainProduct.length > 0 && <View className="item">出品方：{data.mainProduct.join('/')}</View>}
                  {data.mainIssue && data.mainIssue.length > 0 && <View className="item">发行方：{data.mainIssue.join('/')}</View>}
                </View> 
                <View className="arrow"></View>  
              </View>: ''
            }
        </View>

        <FloatCard className="float" isOpened={this.state.showFloat} onClose={this.handleClose} >
          <View className="title">
            <Text className="text">项目基础信息</Text>
            <View className="img" onClick={this.handleClose}><Image src={Close} alt=""></Image></View>
          </View>
          <ScrollView className="content-scroll" scrollY>
          {
            BasicItem.map((item, index) => {
              return data[item.key] && data[item.key].length > 0 ? <View key={index} className="line"><Text className="name">{item.name}：</Text>{Array.isArray(data[item.key]) ? data[item.key].join('/') : data[item.key]}</View> : ''
            })
          }
          </ScrollView>
        </FloatCard>
      </View>
    )
  }
}