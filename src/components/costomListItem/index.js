import { View, Text, Image } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import './index.scss'

class _C extends React.Component {
  static defaultProps = {
    costomShow: '',
  }

  state = {
    costom10: true,
    costom11: true,
  }

  tapCostom = (e) => {
    const num = e.target.dataset.num
    const costomWrap = this.state
    const costomActiveList = []
    costomWrap[`costom${num}`] = !costomWrap[`costom${num}`]
    for (let i = 1; i < 13; i++) {
      if (costomWrap[`costom${i}`]) {
        costomActiveList.push(costomWrap[`costom${i}`])
      }
    }
    if (costomActiveList.length > 8) {
      costomWrap[`costom${num}`] = false
      Taro.showToast({
        title: '至少保留4项！',
        icon: 'none',
        duration: 2000
      })
      this.setState({
        ...costomWrap
      })
    } else {
      this.setState({
        ...costomWrap
      })
    }
  };

  tapClose = () => {
    const costomWrap = this.state
    costomWrap.costomShow = false
    this.setState({
      ...costomWrap
    })
    const myEventDetail = {
      backdropShow: false
    }
    this.props.ongetCostom(myEventDetail)
  };

  tapDefined = () => {
    const costomList = []
    for (let i = 1; i < 13; i++) {
      if (this.state[`costom${i}`]) {
        costomList.push(i)
      }
    }
    if (costomList.length < 9) {
      this.props.ongetCostom(costomList)
    }
  };

  handleTouchMove = () => {
    return;
  }

  render() {
    const {
      costom1,
      costom2,
      costom3,
      costom4,
      costom5,
      costom6,
      costom7,
      costom8,
      costom9,
      costom10,
      costom11,
      costom12,
    } = this.state
    const { costomShow } = this.props;
    return (
      costomShow && (
        <View className="costomListItem" onTouchMove={this.handleTouchMove}>
          <View className="listTitle">
            <Text style="font-size: 32rpx; font-weight: 500;">指标自定义</Text>
            <Text style="color:rgba(153,153,153,1);margin-left: 10rpx;">
              至少保留4项
            </Text>
            <View onClick={this.tapClose} className="closeImg">
              <Image src='../../static/close.png'></Image>
            </View>
          </View>
          <View className="listWrap">
            <View
              data-num="1"
              onClick={this.tapCostom}
              className={'listWrapItem ' + (costom1 ? 'costomActive' : '')}
            >
              上映时间
            </View>
            <View
              data-num="2"
              onClick={this.tapCostom}
              className={'listWrapItem ' + (costom2 ? 'costomActive' : '')}
            >
              制作成本
            </View>
            <View
              data-num="3"
              onClick={this.tapCostom}
              className={'listWrapItem ' + (costom3 ? 'costomActive' : '')}
              style="margin-right: 0;"
            >
              预估票房
            </View>
            <View
              data-num="4"
              onClick={this.tapCostom}
              className={'listWrapItem ' + (costom4 ? 'costomActive' : '')}
            >
              预估评分
            </View>
            <View
              data-num="5"
              onClick={this.tapCostom}
              className={'listWrapItem ' + (costom5 ? 'costomActive' : '')}
            >
              主出品
            </View>
            <View
              data-num="6"
              onClick={this.tapCostom}
              className={'listWrapItem ' + (costom6 ? 'costomActive' : '')}
              style="margin-right: 0;"
            >
              主发行
            </View>
            <View
              data-num="7"
              onClick={this.tapCostom}
              className={'listWrapItem ' + (costom7 ? 'costomActive' : '')}
            >
              类型
            </View>
            <View
              data-num="8"
              onClick={this.tapCostom}
              className={'listWrapItem ' + (costom8 ? 'costomActive' : '')}
            >
              导演
            </View>
            <View
              data-num="9"
              onClick={this.tapCostom}
              className={'listWrapItem ' + (costom9 ? 'costomActive' : '')}
              style="margin-right: 0;"
            >
              项目状态
            </View>
            <View
              data-num="10"
              onClick={this.tapCostom}
              className={'listWrapItem ' + (costom10 ? 'costomActive' : '')}
            >
              合作状态
            </View>
            <View
              data-num="11"
              onClick={this.tapCostom}
              className={'listWrapItem ' + (costom11 ? 'costomActive' : '')}
            >
              跟进人
            </View>
            <View
              data-num="12"
              onClick={this.tapCostom}
              className={'listWrapItem ' + (costom12 ? 'costomActive' : '')}
            >
              映前想看人数
            </View>
          </View>
          <View onClick={this.tapDefined} className="confirm">
            确定
          </View>
        </View>
      )
    )
  }
}

export default _C
