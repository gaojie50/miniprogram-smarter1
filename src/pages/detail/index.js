import { View, Image, Text } from '@tarojs/components'
import React from 'react';
import Taro from '@tarojs/taro';
import BasicData from './basicData';
import KeyData from './keyData';
import { set as setGlobalData, get as getGlobalData } from '../../global_data';
import People from '../../static/detail/people.png';
import File from '../../static/detail/file.png';
// import Edit from '../../static/detail/edit.png';
import './index.scss';

const reqPacking = getGlobalData('reqPacking');
export default class Detail extends React.Component {
  state = {
    basicData: {},
    judgeRole: {}, //包含role、cooperation、releaseStage
    keyData: {}
  }
  componentWillMount(){
    const page = Taro.getCurrentPages();
    console.log(page);
    this.fetchBasicData();
  }

  fetchBasicData() {
    reqPacking({
      url: '/api/management/projectInfo',
      data: {
        projectId: 810
      }
    })
    .then(res => {
      const { success, data = {} } = res;
      if (success) {
        const newDirector = [];
        const newMainRole = [];
        data.director.forEach(item => {
          newDirector.push(item.name);
        });
        data.mainRole.forEach(item => {
          newMainRole.push(item.name);
        });
        data.newDirector = newDirector;
        data.newMainRole = newMainRole;
        this.setState({
          basicData: data,
        }, () => {
          this.fetchJudgeRole();
          // this.fetchRole();
        });
      }
    });
  }

  fetchJudgeRole() {
    const { basicData } = this.state;
    reqPacking({
      url: '/api/management/judgeRole',
      data: { 
        projectId: basicData.projectId
      }
    }).then(res => {
        const { success, data = {} } = res;
        if (success) {
          this.setState({
            judgeRole: data
          }, () => {
            // this.fetchFollowStatus();
            // this.handleTabActive(1);
          });
        } 
      });
  }

  handleChangeKeyData(data) {
    console.log(data, 222)
    this.setState({
      keyData: data
    })
  }

  render() {
    const { basicData, judgeRole, keyData } = this.state;
    return (
      <View>
        <View className="detail-top">
          <View className="detail-top-icon">
            <View className="cooperStatus">合作已确定</View>
            <View className="edit"></View>
            <View className="opt">
              <Image src={File} alt=""></Image>
              <Text>1</Text>
            </View>
            <View className="opt">
            <Image src={People} alt=""></Image>
            <Text>1</Text>
            </View>
          </View>
        </View>
        <BasicData 
          data={ basicData } 
          judgeRole={ judgeRole }
          keyData={ keyData }
        />
        {
          judgeRole.role && judgeRole.role !== 2 ?  
          <KeyData 
            basicData={ basicData } 
            keyData={ keyData } 
            judgeRole={ judgeRole }
            changeKeyData={ data => this.handleChangeKeyData(data)}
          /> : ''
        }
      </View>
    )
  }
}