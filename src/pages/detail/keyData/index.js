import { View, Image, Text } from '@tarojs/components';
import React from 'react';
import { set as setGlobalData, get as getGlobalData } from '../../../global_data';

const reqPacking = getGlobalData('reqPacking')
export default class KeyData extends React.Component {
  state = {
    keyData: {}
  }
  componentDidMount() {
    this.fetchKeyData()
  }

  fetchKeyData() {
    const { projectId, changeKeyData } = this.props;
    reqPacking({
      url: '/api/management/keyData',
      data: { 
        projectId,
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

  render() {
    return (
      <View>111</View>
    )
  }
}