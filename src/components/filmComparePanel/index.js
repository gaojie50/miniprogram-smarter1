import { View, Text, ScrollView } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import utils from '../../utils/index.js'
import ListItem from './listItem';
import AtFloatLayout from '@components/m5/float-layout';
import '@components/m5/style/components/float-layout.scss';
import dayjs from 'dayjs';
import History from './history';
import './index.scss'

const { formatNumber, calcWeek } = utils;

class _C extends React.Component {
  static defaultProps = {
    show: false,
    filmDistributionItem: {},
  }

  closeFn = () =>{
    this.props.closeFn();
  }


  render() {
    const { 
      showWeekType,
      weekType,
      data,
      show,
      titleHeight,
      isSetSchedule,
      hasFixEstimateBox,
      estimateBox,
      releaseDate,
      historyList,
    } = this.props;
    const { keyFilms=[] } = data;
    const { startDate, endDate } = releaseDate;
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


    return (
      show && (
        <AtFloatLayout 
          className='film-compare-panel-component'
          isOpened={ show }
          scrollY={false}
          title='预估大盘'
          onClose={this.closeFn}
        >
          {showWeekType && (
            <View className="week-type-btn">
              <View className={`release-week type-item ${weekType=='releaseWeek'?'active':''}`} onClick={()=>this.props.onWeekTypeChange('releaseWeek')}>按上映周</View>
              <View className={`nature-week type-item ${weekType=='natureWeek'?'active':''}`} onClick={()=>this.props.onWeekTypeChange('natureWeek')}>按自然周</View>
            </View>
          )}
          <View className='title'>
            <View className='title-top'>
              <Text className='releaseDate-section'>
              {dayjs(startDate).format('YYYY.MM.DD')}&nbsp;({calcWeek(startDate)}) - {dayjs(endDate).format('YYYY.MM.DD')}&nbsp;({calcWeek(endDate)})
              </Text>
              <View 
                className={'schedule-btn-wrap'}
                onClick={this.props.onChangeScheduleType}
              >
               <View className={`radio-btn ${isSetSchedule ? 'checked' : ''}`} />
               <View className="text">已定档</View>
              </View>
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
              <History  dataList={historyList} />
            </View>
          </View>

          <ScrollView
            className='film-list'
            style={{height: `1000rpx`}}
            scrollY
          >
            <View className='has-estimate-box-list'>
              {(isSetSchedule ? hasEstimateBoxList.filter(v => v.scheduleType == 1) : hasEstimateBoxList).map((item, index) => {
                return (
                  <ListItem item={item} key={index} orderNum={index+1} showNumber totalBox={isSetSchedule ? hasFixEstimateBox : estimateBox} />
                )
              })}
            </View>
            <View className='no-estimate-box-list'>
              <Text className='title-text'>以下{noEstimateBoxList.length}部影片暂无预估票房</Text>
              {(isSetSchedule ? noEstimateBoxList.filter(v => v.scheduleType == 1) : noEstimateBoxList).map((item, index) => {
                return (
                  <ListItem item={item} key={index} totalBox={isSetSchedule ? hasFixEstimateBox : estimateBox} />
                )
              })}
            </View>
          </ScrollView>
          {data.keyFilms.length === 1 && (
            <View className='noMore'>没有更多了</View>
          )}
        </AtFloatLayout>
      )
    )
  }
}


export default _C
