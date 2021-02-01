import { View, Image, Text, Block } from '@tarojs/components';
import React from 'react';
import { set as setGlobalData, get as getGlobalData } from '../../../global_data';
import NoFollow from '../../../static/detail/noFollows.png';
import './index.scss';

const reqPacking = getGlobalData('reqPacking'); 
export default class FollowStatus extends React.Component {
  state = {
    followData: {},
    fetch: false,
    showFollows: []
  }
  componentDidUpdate() {
    if(!this.state.fetch) {
      this.fetFollowStatus();
    }
  }

  fetFollowStatus() {
    const { basicData, judgeRole } = this.props;
    console.log(basicData)
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
              fetch: true
            });
          } 
        });
    }
  }

  render() {
    const { judgeRole } = this.props;
    const { followData, showFollows } = this.state;
    console.log(followData, 111)
    return (
      <View className="followStatus">
        {
          judgeRole.role === 2 ? <View className="noPermission">暂无查看权限</View>
          : <Block>
            {
              showFollows.length === 0 ? 
              <View className="nodata">
                <Image src={ NoFollow } alt=""></Image>
                <View className="text">暂无跟进记录</View>
              </View>
              : <View >

              </View>
            }
          </Block>
        }
      </View>
    )
  }
}