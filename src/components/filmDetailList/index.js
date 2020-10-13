import { Block, View, Text, Image, ScrollView } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import withWeapp from '@tarojs/with-weapp'
import MaoyanSign from '../maoyanSign/index'
import ScheduleType from '../scheduleType/index'
import './index.scss'

@withWeapp({
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    filmDistributionItem: {
      type: Object,
      value: {}
    }
  },
  data: {
    scheduleType: {
      1: '已定档',
      2: '非常确定',
      3: '可能',
      4: '内部建议',
      5: '待定'
    }
  },
  methods: {
    tapClose() {
      this.setData({
        show: false
      })
      const myEventDetail = {
        backdropShow: false
      }
      this.triggerEvent('myevent', myEventDetail)
    },
    jumpDetail(e) {
      console.log(e)
      const { item } = e.currentTarget.dataset
      const { maoyanId, projectId } = item;
      Taro.navigateTo({
        url: `/pages/projectDetail/index?maoyanId=${maoyanId}&projectId=${projectId}`,
      })
    },
    handleTouchMove() {
      return
    }
  }
})
class _C extends React.Component {
  render() {
    const { filmDistributionItem, scheduleType, show } = this.data
    return (
      show &&
      filmDistributionItem.length !== 0 && (
        <View className="filmDetailList" onTouchMove={this.handleTouchMove}>
          <View className="title">
            <View>
              <Text className="num">{filmDistributionItem.releaseDate}</Text>
              <Text>上映</Text>
              <Text className="num">
                {filmDistributionItem.keyFilms.length}
              </Text>
              <Text>部影片</Text>
            </View>
            <View onClick={this.tapClose} className="close-wrap">
              <Image src='../../static/close.png'></Image>
            </View>
          </View>
          <ScrollView
            className="film-list"
            style={
              'margin-bottom: ' +
              (filmDistributionItem.keyFilms.length === 1 ? '0' : '60rpx')
            }
            scrollY
          >
            {filmDistributionItem.keyFilms.map((item, index) => {
              return (
                <View
                  className="item"
                  onClick={this.jumpDetail}
                  data-item={item}
                  key="maoyanId"
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
                            <MaoyanSign
                              className="maoyanSign"
                              key="index"
                              signContent={item}
                            ></MaoyanSign>
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
                    <View>
                      <Text style={{ marginRight: 10}}>{item.releaseDesc}</Text>
                      <ScheduleType
                        className="scheduleType"
                        signContent={scheduleType[item.scheduleType]}
                      ></ScheduleType>
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
