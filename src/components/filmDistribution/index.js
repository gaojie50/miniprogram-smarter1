import { View, Image, Text, ScrollView, Canvas } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import lineChart from '../../utils/chart.js'
import utils from './../../utils/index'
import './index.scss'

const { rpxTopx } = utils
class _C extends React.Component {
  static defaultProps = {
    filmItemWidth: 0,
    filmItemMarginRight: 0,
    item: {},
  }

  state = {
    imgSrc: '',
    scrollLeft: 0,
    scroll: 0,
  }

  componentDidMount() {
    const { filmDistributionList } = this.props.filmInfo
    if (filmDistributionList) {
      setTimeout(() => {
        this.chartDraw()
      }, 500)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.filmInfo.filmDistributionList !==
      nextProps.filmInfo.filmDistributionList
    ) {
      this.chartDraw()
    }
  }

  chartDraw = () => {
    const { filmDistributionList } = this.props.filmInfo

    let key = []
    let value = []
    let redDot = []

    filmDistributionList.map((item, index) => {
      key.push(index)
      value.push(item.filmNum)
      if (item.company && item.company.indexOf(1) !== -1) {
        redDot.push(1)
      } else {
        redDot.push(0)
      }
    })
    const windowWidth = Taro.getSystemInfoSync().windowWidth
    lineChart(
      'chart',
      {
        tipsCtx: 'chart-tips',
        width: (key.length - 1) * ((windowWidth * 5) / 10) + 33,
        height: rpxTopx(350),
        marginLR: rpxTopx(30),
        xAxis: key,
        yUnit:'亿',
        lines: [
          {
            points: value,
            redDot,
            color:"#3C7DF2"
          },
        ],
      },
      this,
    )
  }

  render() {
    const {
      filmInfo: {
        filmItemWidth,
        filmItemMarginRight,
        filmDistributionList,
        filmLoading,
      },
    } = this.props
    const { imgSrc, scrollLeft, scroll } = this.state

    return (
      <ScrollView
        lowerThreshold={10}
        onScrollToLower={() => this.props.onFilmScroll()}
        onScroll={(e) => {
          this.setState({
            scroll: e.detail.scrollLeft,
          })
        }}
        scrollX={true}
        scrollLeft={scrollLeft}
      >
        <View className="filmChart">
          <Canvas
            canvasId="chart"
            id="chart"
            style={`width:${filmDistributionList.length * (216+10) + 20}rpx`} />
          <Image
            src={imgSrc}
            style={`width:${filmDistributionList.length * (216+10) + 20}rpx`} />
          {!imgSrc && (
            <View className="list-loading">
              <mpLoading type="circle" show={true} tips=""></mpLoading>
            </View>
          )}
        </View>
        <View className="filmList" style={`width:${filmDistributionList.length * (216+10) + 52}rpx`}>
          {filmDistributionList.map((item, index) => {
            return (
              <View
                className="filmItem"
                style={`width:${filmItemWidth}px;margin-right:${filmItemMarginRight}px`}
                key={item.yearWeek}>
                <View className="schedule-wrap">
                  <View className={item.filmSchedule && item.filmSchedule.length > 0 ? "schedule":"no-schedule"}>{item.filmSchedule}</View>
                </View>
                <View className="time">{item.releaseDate}</View>
                <View
                  className={item.filmNum == 0 ? 'no-filmBox' : 'filmBox'}
                  onClick={() => {
                    this.setState(
                      {
                        scrollLeft: scroll,
                      },
                      () => {
                        this.props.onTapfilmBox(index)
                      },
                    )
                  }}
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
