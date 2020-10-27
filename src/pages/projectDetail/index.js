import { Block, View, Text, Image } from '@tarojs/components'
import React from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import projectConfig from '../../constant/project-config.js'
import reqPacking from '../../utils/reqPacking.js'
import utils from '../../utils/index.js'

import './index.scss'
const { getMaoyanSignLabel, getProjectStatus, getCooperStatus } = projectConfig
const { formatNumber, formatDirector, formatReleaseDate } = utils

class _C extends React.Component {
  state = {
    loading: true,
    isFlod: true,
    isChange: false,
    count: 0,
    calHeight: '',
    flod: {
      height: '200rpx',
      rotateZ: 'rotateZ(180deg)',
    },
    resData: {},
  }

  componentWillMount() {
    const { maoyanId, projectId } = getCurrentInstance().router.params
    this.fetchData(maoyanId, projectId)
  }

  reload(that) {
    if (that.state.count > 4) {
      Taro.createSelectorQuery()
        .selectAll('.info')
        .boundingClientRect(function (rect) {
          Taro.getSystemInfo({
            success: (result) => {
              const allHeight =
                rect.length !== 1
                  ? rect[0]?.height +
                    rect[1]?.height +
                    rect[2]?.height +
                    rect[3]?.height
                  : rect[0].height * 4
              that.setState({
                isChange: true,
                flod: {
                  height: allHeight * (750 / result.windowWidth) + 215 + 'rpx',
                  rotateZ: 'rotateZ(180deg)',
                },
                calHeight: allHeight * (750 / result.windowWidth) + 215 + 'rpx',
              })
            },
          })
        })
        .exec()
    } else if (that.state.count == 4) {
      Taro.createSelectorQuery()
        .selectAll('.info')
        .boundingClientRect(function (rect) {
          Taro.getSystemInfo({
            success: (result) => {
              const allHeight =
                rect.length !== 1
                  ? rect[0]?.height +
                    rect[1]?.height +
                    rect[2]?.height +
                    rect[3]?.height
                  : rect[0].height * 4
              that.setState({
                isChange: false,
                flod: {
                  height: allHeight * (750 / result.windowWidth) + 176 + 'rpx',
                },
              })
            },
          })
        })
        .exec()
    } else {
      Taro.createSelectorQuery()
        .selectAll('.info')
        .boundingClientRect(function (rect) {
          Taro.getSystemInfo({
            success: (result) => {
              let height = 96
              if (rect.length !== that.state.count) {
                height =
                  rect[0].height *
                    that.state.count *
                    (750 / result.windowWidth) +
                  176
              } else {
                for (let i = 0; i < rect.length; i++) {
                  height =
                    height + 20 + rect[i].height * (750 / result.windowWidth)
                }
              }
              that.setState({
                isChange: false,
                flod: {
                  height: height + 'rpx',
                },
              })
            },
          })
        })
        .exec()
    }
  }

  componentDidUpdate(preProps, preState) {
    if (preState.resData !== this.state.resData) {
      this.reload(this)
    }
  }

  fold = (e) => {
    e.stopPropagation()
    if (!this.state.isChange) {
      return
    }
    if (this.state.isFlod) {
      this.setState({
        isFlod: !this.state.isFlod,
        flod: {
          height: 'auto',
          rotateZ: 'rotateZ(0deg)',
        },
      })
    } else {
      this.setState({
        isFlod: !this.state.isFlod,
        flod: {
          height: this.state.calHeight,
          rotateZ: 'rotateZ(180deg)',
        },
      })
    }
  }

  fetchData = (movieId, projectId) => {
    let that = this
    reqPacking({
      url: 'api/applet/management/projectDetail',
      data: { movieId: movieId, projectId: projectId },
      method: 'GET',
    }).then((res) => {
      if (!res.success) {
        Taro.showToast({
          title: res.error.message,
          icon: 'none',
          duration: 2000,
        })
      } else {
        this.setState({
          resData: this.formData(res.data),
          loading: false,
        })
      }
    })
  }

  formData = (resData) => {
    let count = 0
    if (
      resData.productInfo.maoyanSign &&
      resData.productInfo.maoyanSign.length > 0
    ) {
      resData.productInfo.maoyanSign = getMaoyanSignLabel(
        resData.productInfo.maoyanSign,
      )
    }
    if (resData.productInfo.filmSource) {
      count++
    }
    if (resData.productInfo.director) {
      count++
      if (resData.productInfo.director.length > 6) {
        resData.productInfo.director.splice(6)
      }
      resData.productInfo.director = formatDirector(
        resData.productInfo.director,
      )
    }
    if (resData.productInfo.movieType) {
      count++
      resData.productInfo.movieType = resData.productInfo.movieType.join(' / ')
    }
    if (resData.productInfo.protagonist) {
      count++
      if (resData.productInfo.protagonist.length > 6) {
        resData.productInfo.protagonist.splice(6)
      }
      resData.productInfo.protagonist = formatDirector(
        resData.productInfo.protagonist,
      )
    }
    if (resData.productInfo.producer) {
      count++
      resData.productInfo.producer = formatDirector(
        resData.productInfo.producer,
      )
    }
    if (resData.productInfo.issuer) {
      count++
      resData.productInfo.issuer = formatDirector(resData.productInfo.issuer)
    }
    if (resData.productInfo.supervisor) {
      count++
      resData.productInfo.supervisor = formatDirector(
        resData.productInfo.supervisor,
      )
    }
    if (resData.productInfo.screenWriter) {
      count++
      resData.productInfo.screenWriter = formatDirector(
        resData.productInfo.screenWriter,
      )
    }
    if (resData.marketIntelligence.estimateBox) {
      resData.marketIntelligence.estimateBox = formatNumber(
        resData.marketIntelligence.estimateBox,
      )
    }
    if (resData.marketIntelligence.cost) {
      resData.marketIntelligence.cost = formatNumber(
        resData.marketIntelligence.cost,
      )
    }
    if (resData.marketIntelligence.publicityCost) {
      resData.marketIntelligence.publicityCost = formatNumber(
        resData.marketIntelligence.publicityCost,
      )
    }
    if (resData.marketIntelligence.maoyanInvest) {
      resData.marketIntelligence.maoyanInvest = formatNumber(
        resData.marketIntelligence.maoyanInvest,
      )
    }
    if (resData.productInfo.cooperStatus !== null) {
      resData.productInfo.cooperStatus = getCooperStatus(
        resData.productInfo.cooperStatus,
      )
    }

    if (resData.marketIntelligence.projectStatus !== null) {
      resData.marketIntelligence.projectStatus = getProjectStatus(
        resData.marketIntelligence.projectStatus,
      )
    }
    if (resData.createInfo.createTime) {
      let date = new Date(resData.createInfo.createTime)
      resData.createInfo.createTime = `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
    }
    // if(count === 1) {
    //   this.setState({
    //     showArrow: false,
    //     isChange: false,
    //     flod: {
    //       height: "200rpx"
    //     }
    //   })
    // } else if(count === 3) {
    //   this.setState({
    //     showArrow: false,
    //     isChange: false,
    //     flod: {
    //       height: "330rpx"
    //     }
    //   })
    // }else {
    //   this.setState({
    //     showArrow: true,
    //     flod: {
    //       height: "417rpx",
    //       rotateZ: "rotateZ(180deg)"
    //     }
    //   })
    // }
    this.setState({
      count: count,
    })
    return resData
  }

  render() {
    const { resData, flod, loading, isChange } = this.state

    return (
      <Block>
        <View className="project-detail">
          <View className="header">
            <Text className="name">{resData.productInfo?.name}</Text>
            {(resData.productInfo?.maoyanSign || []).map((item, index) => {
              return (
                <Text className="sign" key={index}>
                  {'猫眼' + item}
                </Text>
              )
            })}
          </View>
        </View>
        <View className="main-container">
          <View className="main">
            <View
              className="detail"
              id="detail"
              style={'height:' + flod.height + ';'}
              onClick={this.fold}
            >
              <View className="title">基础信息</View>
              {loading && <mpLoading></mpLoading>}
              <View className="type">
                <View className="info">
                  <Text className="special">
                    {resData.productInfo?.category}
                  </Text>
                  <Text className="movietype">
                    {resData.productInfo?.movieType}
                  </Text>
                </View>
              </View>
              {resData.productInfo?.filmSource && (
                <View className="info">
                  <View className="left">片源地：</View>
                  <View className="right">
                    {resData.productInfo?.filmSource}
                  </View>
                </View>
              )}
              {resData.productInfo?.adaptSource && (
                <View className="info">
                  <View className="left">改编源：</View>
                  <View className="right">
                    {resData.productInfo?.adaptSource}
                  </View>
                </View>
              )}
              {resData.productInfo?.director && (
                <View className="info">
                  <View className="left">导 演：</View>
                  <View className="right">{resData.productInfo?.director}</View>
                </View>
              )}
              {resData.productInfo?.protagonist && (
                <View className="info">
                  <View className="left">主 演：</View>
                  <View className="right">
                    {resData.productInfo?.protagonist}
                  </View>
                </View>
              )}
              {resData.productInfo?.cooperStatus && (
                <View className="info">
                  <View className="left">合作类型：</View>
                  <View className="right">
                    {resData.productInfo?.cooperStatus}
                  </View>
                </View>
              )}
              {resData.productInfo?.startupTime && (
                <View className="info">
                  <View className="left">开机时间：</View>
                  <View className="right">
                    {resData.productInfo?.startupTime}
                  </View>
                </View>
              )}
              {resData.productInfo?.killingTime && (
                <View className="info">
                  <View className="left">杀青时间：</View>
                  <View className="right">
                    {resData.productInfo?.killingTime}
                  </View>
                </View>
              )}
              {resData.productInfo?.producer && (
                <View className="info">
                  <View className="left">出品方：</View>
                  <View className="right">{resData.productInfo?.producer}</View>
                </View>
              )}
              {resData.productInfo?.issuer && (
                <View className="info">
                  <View className="left">发行方：</View>
                  <View className="right">{resData.productInfo?.issuer}</View>
                </View>
              )}
              {resData.productInfo?.supervisor && (
                <View className="info">
                  <View className="left">监 制：</View>
                  <View className="right">
                    {resData.productInfo?.supervisor}
                  </View>
                </View>
              )}
              {resData.productInfo?.screenWriter && (
                <View className="info">
                  <View className="left">编 剧：</View>
                  <View className="right">
                    {resData.productInfo?.screenWriter}
                  </View>
                </View>
              )}
              {isChange && (
                <View className="arrow-container" onClick={this.fold}>
                  <Image
                    className="arrow"
                    style={'transform:' + flod.rotateZ}
                    src="../../static/projectDetail/arrow.png"
                  ></Image>
                </View>
              )}
            </View>
            <View className="project">
              <View className="title">市场情报</View>
              <View>
                <View className="market">
                  <View className="line-container">
                    <View className="line"></View>
                  </View>
                  <View className="infoo">
                    <View className="item">
                      {loading && <mpLoading></mpLoading>}
                      {!loading && (
                        <View className="item-up">
                          <Text>
                            {resData.marketIntelligence?.estimateBox?.posNum ||
                              '-'}
                          </Text>
                          <Text>
                            {resData.marketIntelligence?.estimateBox?.unit}
                          </Text>
                        </View>
                      )}
                      <View>预估票房</View>
                    </View>
                    <View className="item">
                      {loading && <mpLoading></mpLoading>}
                      {!loading && (
                        <View className="item-up">
                          <Text>
                            {resData.marketIntelligence?.estimateScore || '-'}
                          </Text>
                          {resData.marketIntelligence?.estimateScore && (
                            <Text>分</Text>
                          )}
                        </View>
                      )}
                      <View>预估评分</View>
                    </View>
                    <View className="item">
                      {loading && <mpLoading></mpLoading>}
                      {!loading && (
                        <View className="item-up">
                          <Text>
                            {resData.marketIntelligence?.cost?.posNum || '-'}
                          </Text>
                          <Text>{resData.marketIntelligence?.cost?.unit}</Text>
                        </View>
                      )}
                      <View>制作成本</View>
                    </View>
                  </View>
                  <View className="line-container">
                    <View className="line"></View>
                  </View>
                  <View className="infoo">
                    <View className="item">
                      {loading && <mpLoading></mpLoading>}
                      {!loading && (
                        <View className="item-up">
                          <Text>
                            {resData.marketIntelligence?.publicityCost
                              ?.posNum || '-'}
                          </Text>
                          <Text>
                            {resData.marketIntelligence?.publicityCost?.unit}
                          </Text>
                        </View>
                      )}
                      <View>宣发费用</View>
                    </View>
                    <View className="item">
                      {loading && <mpLoading></mpLoading>}
                      {!loading && (
                        <View className="item-up">
                          <Text>
                            {resData.marketIntelligence?.maoyanShare || '-'}
                          </Text>
                          {resData.marketIntelligence?.maoyanShare && (
                            <Text>%</Text>
                          )}
                        </View>
                      )}
                      <View>猫眼份额</View>
                    </View>
                    <View className="item">
                      {loading && <mpLoading></mpLoading>}
                      {!loading && (
                        <View className="item-up">
                          <Text>
                            {resData.marketIntelligence?.maoyanInvest?.posNum ||
                              '-'}
                          </Text>
                          <Text>
                            {resData.marketIntelligence?.maoyanInvest?.unit}
                          </Text>
                        </View>
                      )}
                      <View>猫眼投资成本</View>
                    </View>
                  </View>
                  <View className="line-container">
                    <View className="line"></View>
                  </View>
                </View>
                <View className="details">
                  <View className="infoo">
                    <View className="left">项目状态：</View>
                    <View className="right">
                      {resData.marketIntelligence?.projectStatus?.label || '-'}
                    </View>
                  </View>
                  <View className="infoo">
                    <View className="left">上映时间：</View>
                    <View className="right">
                      {(resData.productInfo?.releaseDesc || '-') +
                        ' ' +
                        (resData.productInfo?.alias?.length > 0
                          ? '(' + resData.productInfo?.alias + ')'
                          : '')}
                    </View>
                  </View>
                  <View className="infoo">
                    <View className="left">主出品：</View>
                    <View className="right">
                      {resData.marketIntelligence?.mainPublish || '-'}
                    </View>
                  </View>
                  <View className="infoo">
                    <View className="left">主发行：</View>
                    <View className="right">
                      {resData.marketIntelligence?.mainIssuer || '-'}
                    </View>
                  </View>
                  <View className="infoo">
                    <View className="left">备 注 ：</View>
                    <View className="right">
                      {resData.marketIntelligence?.remark || '-'}
                    </View>
                  </View>
                </View>
              </View>
            </View>
            {resData.createInfo?.creator && (
              <View className="update">
                {resData.createInfo?.avatar && (
                  <View className="img-container">
                    <Image src={resData.createInfo?.avatar}></Image>
                  </View>
                )}
                <View className="text-container">
                  <Text>
                    <Text className="name">{resData.createInfo?.creator}</Text>
                    {'更新于 ' + resData.createInfo?.createTime}
                  </Text>
                </View>
              </View>
            )}
            <View style="height:80rpx"></View>
            {/*  <button type="primary" class="edit">编辑情报信息</button>  */}
          </View>
        </View>
      </Block>
    )
  }
}

export default _C
