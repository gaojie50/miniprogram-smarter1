import { View, Text, Image, ScrollView } from '@tarojs/components'
import React from 'react'
import utils from '../../utils/index.js'
import Taro from '@tarojs/taro'
import './index.scss'

const { formatNumber } = utils;
const scheduleType = {
  1: '已定档',
  2: '非常确定',
  3: '可能',
  4: '内部建议',
  5: '待定',
};
class _C extends React.Component {
  static defaultProps = {
    show: false,
    filmDistributionItem: {},
  }

  state = {
    isSetSchedule:true,
  }

  jumpDetail = (e) => {
    const { item } = e.currentTarget.dataset
    const { maoyanId, projectId } = item
    Taro.navigateTo({
      url: `/pages/projectDetail/index?maoyanId=${maoyanId}&projectId=${projectId}`,
    })
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
    const { releaseDate,estimateBox, hasFixEstimateBox,keyFilms=[] } = filmDistributionItem;
    const estimateBoxVal = formatNumber(isSetSchedule ? hasFixEstimateBox : estimateBox,'floor');
    const establishedFilmsNum = keyFilms.filter(v => v.scheduleType == 1).length;

    return (
      show &&
      filmDistributionItem.length !== 0 && (
        <View className="filmDetailList">
          <View className="title">
            <View className="title-top">
              <View onClick={this.closeFn} className="close-wrap">
                <Image src="../../static/close.png"></Image>
              </View>
              <Text className="num">{releaseDate}</Text>
              <View 
                className={ `schedule ${isSetSchedule ? 'already' : 'notYet'}` }
                onClick={this.handleSetSchedule}>只看已定档</View>
            </View>
            
            <View className="title-bottom">
              <View>
                <View className="p">预估大盘</View>
                <View className="val">
                  <Text className="detailVal">{estimateBoxVal.posNum}</Text>
                  <Text className="unit">{estimateBoxVal.unit}</Text>
                </View>
                { !isSetSchedule && <View className="maybe">含可能定档{formatNumber(estimateBox - hasFixEstimateBox,'floor').text}</View>}
              </View>
              <View>
                <View className="p">上映影片</View>
                <View className="val">
                  <Text className="detailVal">{isSetSchedule ? establishedFilmsNum : keyFilms.length}</Text>
                  <Text className="unit">部</Text>
                </View>
                { !isSetSchedule && <View className="maybe">含可能定档{keyFilms.length - establishedFilmsNum}部</View>}
              </View>
            </View>
          </View>

          <ScrollView
            className="film-list"
            style={`max-height: calc(100vh - 60rpx - 289rpx - ${isSetSchedule ? 0 : 53 }rpx - ${titleHeight}px)`}
            scrollY
          >
            {(isSetSchedule ? keyFilms.filter(v => v.scheduleType == 1) : keyFilms).map((item, index) => {
              return (
                <View
                  className="item"
                  onClick={this.jumpDetail}
                  data-item={item}
                  key={item.maoyanId}
                >
                  <Image src={item.pic} alt></Image>
                  <View className="main">
                    <View className="firstLine">
                      <View className="name">{item.movieName}</View>
                      {item.estimateBox && (
                        <View className="yello">
                          <Text>{item.estimateBox.num}</Text>
                          <Text>{item.estimateBox.unit + '预估票房'}</Text>
                        </View>
                      )}
                      {!item.estimateBox && item.wishNum !== '-' && (
                        <View className="yello">
                          <Text>{item.wishNum.num}</Text>
                          <Text>{item.wishNum.unit + '想看数'}</Text>
                        </View>
                      )}
                    </View>
                    <View className="secondLine">
                      <View className="left">
                        {(item.maoyanSignLabel || []).map((item, index) => {
                          return (
                            <maoyansign
                              key={index}
                              signContent={item}
                            ></maoyansign>
                          )
                        })}
                        <View className="director">
                          {'导演：' + (item.director || '--')}
                        </View>
                      </View>
                      {item.estimateBox && item.wishNum !== '-' && (
                        <View className="wishNum">
                          <Text>{item.wishNum.num}</Text>
                          <Text>{item.wishNum.unit + '想看数'}</Text>
                        </View>
                      )}
                    </View>
                    <View className="thirdLine">
                      <Text>{item.releaseDesc}</Text>
                      <scheduletype
                        signContent={scheduleType[item.scheduleType]}
                      ></scheduletype>
                    </View>
                  </View>
                </View>
              )
            })}
          </ScrollView>
          {filmDistributionItem.keyFilms.length === 1 && (
            <View className="noMore">没有更多了</View>
          )}
        </View>
      )
    )
  }
}

export default _C
