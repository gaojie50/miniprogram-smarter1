import { View, Image, Text, Block } from '@tarojs/components';
import React from 'react';
import dayjs from 'dayjs';
import { set as setGlobalData, get as getGlobalData } from '../../../global_data';
import NoFollow from '../../../static/detail/noFollows.png';
import { FollowList } from '../constant';
import Gray from '../../../static/detail/gray.png';
import Path from '../../../static/detail/path.png';
import './index.scss';

const reqPacking = getGlobalData('reqPacking'); 
export default class FollowStatus extends React.Component {
  state = {
    followData: {},
    fetch: false,
    showFollows: [],
    loading: true,
  }
  
  componentDidUpdate() {
    if(!this.state.fetch) {
      this.fetFollowStatus();
    }
  }

  followResult(item) {
    const { projectId } = this.props.basicData;
    wx.navigateTo({
      url: `/pages/checkProgress/index?projectId=${projectId}&activeTab=${FollowList[item].value}`,
    })
  }

  fetFollowStatus = () => {
    const { basicData, judgeRole } = this.props;
    if(judgeRole.role !== 2) {
      reqPacking({
        url: '/api/management/stage/list',
        data: { 
          projectId: basicData.projectId,
        }
      }).then(res => {
          const { success, data = {} } = res;
          if (success) {
            const followList = [];
            Object.keys(data).map(item => {
              if (data[ item ] && data[ item ].length > 0) {
                followList.push(item);
              }
              return followList;
            });
            this.setState({
              followData: data,
              showFollows: followList,
              fetch: true,
              loading: false
            });
          } 
        });
    }
  }

  handleAllProgress = () => {
    const { projectId } = this.props.basicData;
    wx.navigateTo({
      url: `/pages/checkProgress/index?projectId=${projectId}&activeTab=1`,
    })
  }

  render() {
    const { judgeRole, basicData } = this.props;
    const { followData, showFollows, loading } = this.state;
    return (
      <View className={basicData.cooperStatus === 2 ? "followStatus follow-reault" : "followStatus"} style={{backgroundColor: basicData.cooperStatus === 2 && showFollows.length > 0 ? '#F8F8F8' : ''}}>
        {
          judgeRole.role === 2 ? <View className="noPermission">暂无查看权限</View>
          : <Block>
            {
              loading ? '' :
              showFollows.length === 0 ? 
              <View className="nodata">
                <Image src={ NoFollow } alt=""></Image>
                <View className="text">暂无跟进记录</View>
              </View>
              : <Block>
                {
                  showFollows.length > 0 && showFollows.map((item, index) => {
                    return basicData.cooperStatus !== 2 ? <View key={index} className="followStatus-item" style={{backgroundColor: FollowList[item].bgColor}}>
                      <View className="first">
                        <View className="name" style={{color: FollowList[item].color}}>{FollowList[item].name}</View>
                        <View className="date">{followData[item][0].updater} {dayjs(followData[item][0].updateTime || 0).format('MM月DD日 HH:mm')}</View>
                      </View>
                      <View className="second">
                        {
                          followData[item][0].stageStatus && followData[item][0].stageStatus.length > 0 ?
                          followData[item][0].stageStatus.map((x, xindex) => {
                            return <Text style={{color: FollowList[item].tipColor, backgroundColor: FollowList[item].tipBgColor}} className="tag" key={xindex}>{x}</Text> 
                          }) : ''
                        }
                      </View>
                      <View className="three">{followData[item][0].describe}</View>
                    </View> : <View className="followStatus-result" onClick={this.followResult.bind(this, item)}>
                      <View className="result-name">
                        <View className="name" style={{color: FollowList[item].color}}>{FollowList[item].name}</View>
                        <Image src={Gray} alt=""></Image>
                      </View>
                      <View className="result-num">
                        <Text className="num">{followData[item].length}</Text>条
                      </View>
                      <View className="result-time">最后更新时间</View>
                      <View className="result-time">{dayjs(followData[item][0].updateTime || 0).format('YYYY-MM-DD HH:mm')}</View>
                    </View>
                  })
                }
                {
                  showFollows.length > 0 && basicData.cooperStatus !== 2 ?
                  <View className="allProgress" onClick={this.handleAllProgress}>查看所有进展 <Image src={Path} alt=""></Image></View> : null
                }
              </Block>
            }
          </Block>
        }
      </View>
    )
  }
}