import { View, Image, Text, ScrollView } from '@tarojs/components';
import React from 'react';
import Taro from '@tarojs/taro'
import { set as setGlobalData, get as getGlobalData } from '../../../global_data';
import utils from '@utils/index.js';
import './index.scss';

const reqPacking = getGlobalData('reqPacking'); 
const { formatNumber } = utils;
export default class KeyData extends React.Component {
  state = {
    keyData: {}
  }

  fetchKeyData = () => {
    const { basicData, changeKeyData } = this.props;
    reqPacking({
      url: '/api/management/keyData',
      data: { 
        projectId: basicData.projectId,
      }
    }).then(res => {
        const { success, data = {} } = res;
        if (success) {
          changeKeyData(data);
          this.setState({
            keyData: data
          });
        } 
      });
  }
  goCoreData = () =>{
    console.log(this.props);
    Taro.redirectTo({
      url: `/pages/coreData/index?name=${this.props.basicData.name}`,
    })
  }

  render() {
    const { basicData, keyData, judgeRole } = this.props;
    return (
      <View className="keyData">
        <ScrollView className="keyData-top" style={{borderBottomLeftRadius: judgeRole.role !== 1 ? '10rpx': '0',borderBottomRightRadius: judgeRole.role !== 1 ? '10rpx': '0',}} scrollX>
          {
            basicData.category === 3 && judgeRole.releaseStage === 1 ?
            <View className="item" style={{width: '33.33%'}}>
              <View className="title">预估票房</View>
              {
                keyData.estimateBox && keyData.estimateBox.num ?
                  <View className="number"><Text className="num" style={{fontSize: '36rpx'}}>{formatNumber(keyData.estimateBox.num, 'floor').num || '-'}</Text>{formatNumber(keyData.estimateBox.num, 'floor').unit}</View> 
                  : <View className="number num" style={{fontSize: '36rpx'}}>-</View>
              }
              {
                keyData.estimateBox && keyData.estimateBox.compare && basicData.cooperStatus !== 2 ?
                  <View>较上次
                    <Text className="compare" style={ { color: keyData.estimateBox.compare >= 0 ? '#F1303D' : '#14CC14' } }>
                      {keyData.estimateBox.compare > 0 ? '+' : ''}{keyData.estimateBox.compare}亿
                    </Text>
                  </View> : ''
              }
            </View> : ''
          }
          {
            basicData.category === 3 && judgeRole.releaseStage === 1 ?
            <View className="item" style={{width: '33.33%'}}>
              <View className="title">预估评分</View>
              {
                keyData.estimateScore && keyData.estimateScore.num ?
                  <View className="number"><Text className="num" style={{fontSize: '36rpx'}}>{keyData.estimateScore.num}</Text>分</View> 
                  : <View className="number num" style={{fontSize: '36rpx'}}>-</View>
              }
              {
                keyData.estimateScore && keyData.estimateScore.compare && basicData.cooperStatus !== 2 ?
                  <View>较上次
                    <Text className="compare" style={ { color: keyData.estimateScore.compare >= 0 ? '#F1303D' : '#14CC14' } }>
                      {keyData.estimateScore.compare > 0 ? '+' : ''}{keyData.estimateScore.compare}分
                    </Text>
                  </View> : ''
              }
            </View> : ''
          }
          {
            basicData.category !== 3 && judgeRole.releaseStage === 1 ?
              <View className="item" style={{width: '50%'}}>
                <View className="title">评估总得分</View>
                {
                  keyData.assessTotalScore && keyData.assessTotalScore.num ?
                    <View className="number">
                      <Text className="num" style={{fontSize: '36rpx'}}>{keyData.assessTotalScore.num}</Text>分
                    </View> : 
                    <View className="number">
                      <View className="num" style={{fontSize: '36rpx'}}>-</View>
                    </View>
                }
                {
                  keyData.assessTotalScore && keyData.assessTotalScore.compare && basicData.cooperStatus !== 2 ?
                    <View>较上次
                      <Text className="compare" style={ { color: keyData.assessTotalScore.compare >= 0 ? '#F1303D' : '#14CC14' } }>
                      {keyData.assessTotalScore.compare > 0 ? '+' : ''}{keyData.assessTotalScore.compare}分
                      </Text>
                    </View> : ''
                }
              </View> : ''
          }
          {
            basicData.category === 3 && judgeRole.releaseStage === 2 ?
              <View className="item" style={{width: '30.43%'}}>
                <View className="title">累计票房</View>
                <View className="number" style={ { color: '#F1303D'} }>
                  <Text className="num" style={{fontSize: '36rpx', color: '#F1303D'}}>{formatNumber(keyData.cumulateBox, 'floor').num}</Text>
                  <Text>{formatNumber(keyData.cumulateBox, 'floor').unit}</Text>
                </View>
                {
                  keyData.estimateBox && basicData.cooperStatus === 2 ?
                    <View className="compare">预估票房 <Text className="num">
                        {formatNumber(keyData.estimateBox.num, 'floor').num}
                      </Text>
                        {formatNumber(keyData.estimateBox.num, 'floor').unit}
                    </View> : ''
                }
              </View> : ''
          }
          {
            judgeRole.releaseStage === 2 ?
              <View className="item" style={ { width: basicData.category === 3 ? '30.43%' : '33.33%' } }>
                <View className="title">猫眼评分</View>
                <View style={ { color: '#FD9C00'} } className="number">
                  <Text className="num" style={{fontSize: '36rpx',color: '#FD9C00'}}>{keyData.maoyanScore || '-'}</Text>
                  <Text>{keyData.maoyanScore ? '分' : ''}</Text>
                </View>
                {
                  keyData.estimateScore && basicData.cooperStatus === 2 ? <View className="compare">预估评分 <Text className="num">{keyData.estimateScore.num || '-'}{keyData.estimateScore.num ? '分' : ''}</Text></View> : ''
                }
              </View> : ''
          }
          {
            judgeRole.releaseStage === 2 ?
              <View className="item" style={ { width: basicData.category === 3 ? '30.43%' : '33.33%' } }>
                <View className="title">豆瓣评分</View>
                <View style={ { color: '#2D963D'} } className="number">
                  <Text className="num" style={{fontSize: '36rpx', color: '#2D963D'}}>{keyData.doubanScore || '-'}</Text>
                  <Text>{keyData.doubanScore ? '分' : ''}</Text>
                </View>
              </View> : ''
          }
          <View className="item"
          style={ {
            width: basicData.category !== 3 && ((judgeRole.cooperation === 1 && judgeRole.releaseStage === 1) || (judgeRole.cooperation === 2 && judgeRole.releaseStage === 1)) ? '50%' :
              (basicData.category === 3 && judgeRole.releaseStage === 2) ? '30.43%' : '33.33%'
          } }>
            <View className="title">想看人数</View>
            {
              keyData.wishNum && <View className="number"><Text className="num" style={{fontSize: '36rpx'}}>{formatNumber(keyData.wishNum.num, 'floor').num || '-'}</Text>{formatNumber(keyData.wishNum.num, 'floor').unit || ''}</View>
            }
            {
              keyData.wishNum && keyData.wishNum.compare && ((judgeRole.cooperation === 1 && basicData.cooperStatus !== 2) || (judgeRole.cooperation === 2 && judgeRole.releaseStage === 1)) ?
                <View className="compare">昨日<Text className="num" style={{color: '#F1303D'}}>+{keyData.wishNum.compare}</Text></View> : ''
            }
          </View>
        </ScrollView>
        {
          judgeRole.role !== 1 ? ''  
          :<View className="keyData-bottom">
            <View className="left">
              <View className="first-line">
                <Text className="left-label">制作成本</Text>
                <Text><Text className='num'>{formatNumber(keyData.cost, 'floor').num}</Text>{formatNumber(keyData.cost, 'floor').unit}</Text>
              </View>
              <View className="second-line">
                <Text className="left-label">猫眼投资成本</Text>
                <Text><Text className='num'>{formatNumber(keyData.investingCost, 'floor').num}</Text>{formatNumber(keyData.investingCost, 'floor').unit}</Text>
              </View>
            </View>
            <View className="right">
              <View className="first-line">
                <Text className="right-label">宣发费用</Text>
                <Text><Text className='num'>{formatNumber(keyData.advertisingCost, 'floor').num}</Text>{formatNumber(keyData.advertisingCost, 'floor').unit}</Text>
              </View>
              <View className="second-line">
                <Text className="right-label">猫眼份额</Text>
                <Text className='num'>{keyData.share || '-'}{keyData.share ? '%' : ''}</Text>
              </View>
              <View className=''></View>
            </View>
          </View>
        }
        <View className="keyData-detail" onClick={this.goCoreData}>
          <View className="detail-box">
            <View className="detail-left">累计收入预估</View>
            <View className="detail-middle">1.3亿</View>
            <View className="detail-right">查看详情</View>
            <Image src='http://p0.meituan.net/scarlett/82284f5ad86be73bf51bad206bead653595.png'></Image>
          </View>
        </View>
      </View>
    )
  }
}