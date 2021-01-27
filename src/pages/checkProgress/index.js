import { View, Image, Text } from '@tarojs/components';
import React from 'react';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { get as getGlobalData } from '../../global_data';
import utils from '../../utils/index.js';
import './index.scss';

const reqPacking = getGlobalData('reqPacking');

const { formatCreateTime } = utils;
const TAB_TITLES = [
  {
    label:'开发',
    color:'rgb(253, 156, 0)',
    value:1,
    key:'developStageList',
  },
  {
    label:'完片',
    color:'rgb(105, 191, 19)',
    value:2,
    key:'completedStageList',
  },
  {
    label:'宣发',
    color:'rgb(102, 102, 255)',
    value:3,
    key:'publicityStageList',
  },
  {
    label:'发行',
    color:'rgb(9, 179, 179)',
    value:4,
    key:'publishStageList',
  },
  {
    label:'上映',
    color:'rgb(217, 43, 217)',
    value:5,
    key:'showStageList',
  },
  {
    label:'映后',
    color:'rgb(159, 64, 255)',
    value:6,
    key:'showAfterStageList',
  },
];
export default class _C extends React.Component {
  state = {
    recordData: {},
    activeTab:1,
  }

  componentDidMount() {
    const { projectId } = getCurrentInstance().router.params;
    
    this.fetchRecordData(projectId);
  }

  fetchRecordData = projectId => {
    reqPacking({
      url: 'api/management/stage/list',
      data: { projectId },
      method: 'GET',
    })
      .then(res => {
        const { success, data = {}, err } = res;
        if (success) return this.setState({ recordData: data });

        Taro.showToast({
          title: err.message,
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
            const { success, error } = res;
            if (success) {
              fetchRecordData(projectId);

              return Taro.showToast({
                title: '删除成功',
                icon: 'none',
                duration: 2000
              });
            };

            return Taro.showToast({
              title: `删除失败：${error && error.message}`,
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