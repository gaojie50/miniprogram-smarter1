import { View, Image, Text, ScrollView, Canvas } from '@tarojs/components'
import React from 'react'
import lineChart from '../../utils/chart.js'
import utils from './../../utils/index'
import './index.scss'

const { rpxTopx, formatNumber,arrayMaxItem,throttle } = utils;
function carryBit(num){
  if(num < 100) return num;

  const numStr = `${num}`;
  const {length} = numStr;
  const numLen = Number(`1e+${length-2}`);

  return (Math.ceil(num/numLen) * numLen);
};

function yMaxValueCalc(scrollLeft,points=[]){
  const turn = Math.ceil((scrollLeft-rpxTopx(66))/rpxTopx(216+10));
  const filterPointsMaxItem = arrayMaxItem(points.filter((item,index) => {
    return (index <3 + turn) && (index >= turn);
  }));
  let yMaxValue = filterPointsMaxItem == 0 ? arrayMaxItem(points) : filterPointsMaxItem;
  return Math.ceil(carryBit(yMaxValue));
}
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

  // componentWillReceiveProps(nextProps) {
  //   if (
  //     this.props.filmInfo.filmDistributionList !==
  //     nextProps.filmInfo.filmDistributionList
  //   ) {
  //     this.chartDraw()
  //   }
  // }

  getOpts = () => {
    const { filmDistributionList } = this.props.filmInfo;
    let key = [];
    let lines1 = {points:[],redDot:[],color:"#666",dash: true};
    let lines2 = {points:[],redDot:[],color:"#3C7DF2"};

    filmDistributionList.map(({
      hasFixEstimateBox,
      estimateBox,
      hasFixMaoyanJoin,
      maoyanJoin,
    }, index) => {
      key.push(index);
      
      lines1['points'].push(estimateBox/1e8);
      lines2['points'].push(hasFixEstimateBox/1e8);

      lines1['redDot'].push(maoyanJoin ? 1 : 0);
      lines2['redDot'].push(hasFixMaoyanJoin ? 1 : 0);
    });

    return {
      width: rpxTopx(30 + (216 + 10)* key.length + 20),
      height: rpxTopx(348),
      xAxis: key,
      lines: [ lines1,lines2 ],
    }
  }

  chartDraw = (scrollLeft=0) => {
    const opt = this.getOpts();

    opt['yMaxLength'] = yMaxValueCalc(scrollLeft,opt.lines[0]['points']);
    lineChart('chart',opt,this);
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
        onScroll={ throttle(e => {
          this.chartDraw(e.detail.scrollLeft)
          this.setState({ scroll: e.detail.scrollLeft,})
        },200)
        }
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
                    {
                      item.filmNum !== 0 ? <React.Fragment>
                        <Text data-item={item}>{formatNumber(item.hasFixEstimateBox,'floor').posNum}</Text>
                        <Text data-item={item}>{formatNumber(item.hasFixEstimateBox,'floor').unit}</Text>
                        <Text className="numbers">{item.keyFilms.length}部</Text>
                        <Image data-item={item} src="../../static/film.png" alt />
                      </React.Fragment> :
                      <React.Fragment>
                        <Text data-item={item}>0</Text>
                        <Text data-item={item}>部</Text>
                      </React.Fragment>
                    }
                    
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
