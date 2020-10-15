import {
  View,
  Image,
  Text,
  ScrollView,
  Canvas,
} from '@tarojs/components'
import React from 'react'

import './index.scss'

class _C extends React.Component {
  static defaultProps = {
    filmItemWidth: 0,
    filmItemMarginRight: 0,
    item: {},
  }

  tapfilmBox = (e) => {
    const filmDistributionItem = e.target.dataset.item

    if (filmDistributionItem.filmNum == 0) return
    filmDistributionItem && this.props.onTapfilmBox(filmDistributionItem)
  }
  render() {
    const { filmInfo: {filmItemWidth, filmItemMarginRight, filmDistributionList, filmLoading} } = this.props
    return (
      <ScrollView lowerThreshold="2" onScrollToLower={() => this.props.filmScroll()} scrollX>
        <View className="filmChart" style="width: 100%;">
          <Canvas
            canvasId="chart"
            style={'width:' + (filmDistributionList.length * 218 + 20) + 'rpx;'}
          ></Canvas>
        </View>
        <View
          className="filmList"
          style={'width:' + (filmDistributionList.length * 216 + 52) + 'rpx;'}
        >
          {filmDistributionList.map((item, index) => {
            return (
              <View
                className="filmItem"
                style={
                  'width:' +
                  filmItemWidth +
                  'px;margin-right:' +
                  filmItemMarginRight +
                  'px'
                }
                key="yearWeek"
              >
                <View className="schedule">{item.filmSchedule || ''}</View>
                <View className="time">{item.releaseDate}</View>
                <View
                  className={item.filmNum == 0 ? 'no-filmBox' : 'filmBox'}
                  data-item={item}
                  onClick={this.tapfilmBox}
                >
                  <View data-item={item}>
                    <Text data-item={item}>{item.keyFilms.length}</Text>
                    <Text data-item={item}>部</Text>
                    {item.filmNum !== 0 && (
                      <Image
                        data-item={item}
                        src="../../static/film.png"
                        alt
                      ></Image>
                    )}
                  </View>
                  {item.keyFilms.length === 0 && (
                    <View data-item={item}>-</View>
                  )}
                  {item.keyFilms.length >= 1 && (
                    <View data-item={item}>{item.keyFilms[0].movieName}</View>
                  )}
                  {item.keyFilms.length >= 2 && (
                    <View data-item={item}>{item.keyFilms[1].movieName}</View>
                  )}
                  {item.keyFilms.length >= 3 && (
                    <View data-item={item}>{item.keyFilms[2].movieName}</View>
                  )}
                </View>
              </View>
            )
          })}
          {filmLoading && (
            <View className="filmLoading">
              <mpLoading show={true} type="circle" tips=""></mpLoading>
            </View>
          )}
        </View>
      </ScrollView>
    )
  }
}

export default _C
