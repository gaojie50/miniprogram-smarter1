import { View, Text, Image, ScrollView } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import utils from '../../utils/index.js'
import ListItem from './listItem';
import AtFloatLayout from '@components/m5/float-layout';
import '@components/m5/style/components/float-layout.scss';
import dayjs from 'dayjs';
import History from './history';
import './index.scss'

const { formatNumber } = utils;

class _C extends React.Component {
  static defaultProps = {
    show: false,
    filmDistributionItem: {},
  }

  state = {
    isSetSchedule:true,
  }

  handleSetSchedule = () =>{
    this.setState({ isSetSchedule : !this.state.isSetSchedule});
  }

  closeFn = () =>{
    this.props.ongetCostom({});
    this.setState({
      isSetSchedule:true,
    });
  }


  render() {
    const { isSetSchedule} = this.state;
    const { filmDistributionItem, show, titleHeight } = this.props;
    const { originalReleaseDate, releaseDate,estimateBox, hasFixEstimateBox, keyFilms=[] } = filmDistributionItem;
    const estimateBoxVal = formatNumber(isSetSchedule ? hasFixEstimateBox : estimateBox,'floor');
    const establishedFilmsNum = keyFilms.filter(v => v.scheduleType == 1).length;
    const hasEstimateBoxList = [];
    const noEstimateBoxList = [];
    (isSetSchedule ? keyFilms.filter(v => v.scheduleType == 1) : keyFilms).forEach(item=>{
      if( item.estimateBox ){
        hasEstimateBoxList.push(item);
      }else{
        noEstimateBoxList.push(item);
      }
    })
    console.log(originalReleaseDate)
    return (
      show &&
      filmDistributionItem.length !== 0 && (
        <AtFloatLayout 
          className='film-market-component'
          isOpened={ show && filmDistributionItem.length !== 0 }
          scrollY={false}
          title='预估大盘'
          onClose={this.closeFn}
        >
          <View className='title'>
            <View className='title-top'>
              <Text className='releaseDate-section'>{dayjs(originalReleaseDate.startDate).format('YYYY-MM-DD')} - {dayjs(originalReleaseDate.endDate).format('YYYY-MM-DD')}</Text>
              <View 
                className={`schedule ${isSetSchedule ? 'already' : 'notYet'}`}
                onClick={this.handleSetSchedule}
              >已定档</View>
            </View>
            
            <View className='overview'>
              <View className="cur-week-data">
                <View className='predict-panel'>
                  <View className='title'>预估大盘</View>
                  <View className='val'>
                    <Text className='detailVal'>{estimateBoxVal.posNum}</Text>
                    <Text className='unit'>{estimateBoxVal.unit}</Text>
                  </View>
                  { !isSetSchedule && <View className='maybe'>含可能定档{formatNumber(estimateBox - hasFixEstimateBox,'floor').text}</View>}
                </View>
                <View className='onshow-number'>
                  <View className='title'>上映影片</View>
                  <View className='val'>
                   <Text className='detailVal'>{isSetSchedule ? establishedFilmsNum : keyFilms.length}</Text>
                    <Text className='unit'>部</Text>
                  </View>
                  { !isSetSchedule && <View className='maybe'>含可能定档{keyFilms.length - establishedFilmsNum}部</View>}
                </View>
              </View>
              <History startDate={originalReleaseDate.startDate} endDate={originalReleaseDate.endDate} />
            </View>
          </View>

          <ScrollView
            className='film-list'
            style={`max-height: calc(100vh - 60rpx - 289rpx - ${isSetSchedule ? 0 : 53 }rpx - ${titleHeight}px)`}
            scrollY
          >
            <View className='has-estimate-box-list'>
              {(isSetSchedule ? hasEstimateBoxList.filter(v => v.scheduleType == 1) : hasEstimateBoxList).map((item, index) => {
                return (
                  <ListItem item={item} key={index} orderNum={index+1} showNumber />
                )
              })}
            </View>
            <View className='no-estimate-box-list'>
              <Text className='title-text'>以下{noEstimateBoxList.length}部影片暂无预估票房</Text>
              {(isSetSchedule ? noEstimateBoxList.filter(v => v.scheduleType == 1) : noEstimateBoxList).map((item, index) => {
                return (
                  <ListItem item={item} key={index} />
                )
              })}
            </View>
          </ScrollView>
          {filmDistributionItem.keyFilms.length === 1 && (
            <View className='noMore'>没有更多了</View>
          )}
        </AtFloatLayout>
      )
    )
  }
}


export default _C
