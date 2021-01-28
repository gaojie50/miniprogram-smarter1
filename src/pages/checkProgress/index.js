import React,{useState} from 'react';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import { get as getGlobalData } from '../../global_data';
import projectConfig from '../../constant/project-config';
import utils from '../../utils/index.js';
import './index.scss';

const reqPacking = getGlobalData('reqPacking');

const { formatCreateTime } = utils;
const {getProjectStages} = projectConfig
export default class _C extends React.Component {
  state = {
    recordData: {},
    activeTab:1,
  }

  componentDidMount() {
    const { projectId,activeTab } = getCurrentInstance().router.params;

    if(activeTab && activeTab != 1) this.setState({activeTab});
    this.fetchRecordData(projectId);
  }

  fetchRecordData = projectId => {
    reqPacking({
      url: 'api/management/stage/list',
      data: { projectId },
      method: 'GET',
    })
      .then(res => {
        const { success, data = {}, message } = res;
        if (success) return this.setState({ recordData: data });

        Taro.showToast({
          title: message,
          icon: 'none',
          duration: 2000
        });
      });
  }

  changeTab = ({target}) => this.setState({activeTab:target.dataset.value});

  render() {
    const { 
      recordData,
      activeTab,
    } = this.state;
    const TAB_TITLES = getProjectStages();
    
    return (
      <View className="check-progress">
        <View className="tab-title">
          { TAB_TITLES.map(({label,color,value}) => 
            <View 
              onClick={this.changeTab}
              data-value={value}
              className={value == activeTab ? `active-${value}` : ''}> {label} </View>
          )}
        </View>
        
        <View className='tab-content'>
          <Tab 
            value ={activeTab} 
            fetchRecordData={this.fetchRecordData}
            data={ recordData[ TAB_TITLES.filter(item => item.value == activeTab)[0].key]} />
        </View>
      </View>
    )
  }
};

function Tab ({value, data=[],fetchRecordData}){
  if(!data || data.length  == 0) return <View className='no-update'>
    <Image src="../../static/zwgxjl.png" />
    <View>暂无更新记录</View>
  </View>
  
  return <View className="main">
    {data.map( (item,index) => <TabItem fetchRecordData={fetchRecordData} key={index} value={value} {...item} />)}
    <View className="no-more">没有更多了</View>
  </View>
}

function TabItem (
  { fetchRecordData,
    value,
    updater,
    updateTime,
    stageStatus,
    describe,
    editorUserId,
    recordId,
    projectId
  }){
  const ownDelete = Taro.getStorageSync('authinfo').userInfo.id == editorUserId;
  const deleteIt = () =>{
    Taro.showModal({
      title: '提示',
      content:'确认要删除这条记录吗？',
      success (res) {
        if (res.confirm) {
          return reqPacking({
            url:'api/management/stage/delete',
            data:{recordId,projectId},
            method: 'POST',
          }).then(res => {
            const { success, error,message } = res;
            if (success) {
              fetchRecordData(projectId);

              return Taro.showToast({
                title: '删除成功',
                icon: 'none',
                duration: 2000
              });
            };

            return Taro.showToast({
              title: `删除失败：${error && message}`,
              icon: 'none',
              duration: 2000
            });
          });
        } 
      }
    });
  }

  return <View>
    <View className="item-title">{updater} 添加于 {formatCreateTime(updateTime)}</View>
    <View className={`item-${value}`}>
      <View className="content-top">
        {stageStatus.map((item,index) => <Text key={index}>{item}</Text>)}
      </View>
      { ownDelete &&  <Image src="../../static/icon/delete.svg" className="delete" onClick={deleteIt} />}
      <View className="content-bottom">{describe}</View>
    </View>
  </View>
}