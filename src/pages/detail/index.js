import { View, Image, Text } from '@tarojs/components'
import React from 'react';
import Taro from '@tarojs/taro';
import { AtTabs, AtTabsPane } from '../../components/m5';
import BasicData from './basicData';
import KeyData from './keyData';
import FollowStatus from './followStatus';
import { UseHistory } from '../board/history';
import { EvaluationList } from '../board/evaluate';
import { CooperStatus } from './constant';
import { set as setGlobalData, get as getGlobalData } from '../../global_data';
import AddingProcess from '../../components/addingProcess';
import People from '../../static/detail/people.png';
import File from '../../static/detail/file.png';
import ArrowLeft from '../../static/detail/arrow-left.png';
import Edit from '../../static/detail/edit.png';
import './index.scss';
import '../../components/m5/style/index.scss';

const reqPacking = getGlobalData('reqPacking');
const {statusBarHeight} = getGlobalData('systemInfo');
export default class Detail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      basicData: {
        cooperStatus: 2,
      },
      judgeRole: {}, //包含role、cooperation、releaseStage
      keyData: {},
      current: 0,
      showProgress: false,
      top: 0,
      topSet: true,
    }
  }
  

  onPageScroll() {
    const that = this;
    const { top, topSet } = this.state;
    var query = wx.createSelectorQuery();
    query.select('#top').boundingClientRect(function (res) {
      if(res.top < 0 && topSet) {
        that.setState({
          top: res.top,
          topSet: false
        })
      }
      if(res.top === 0) {
        that.setState({
          top: res.top,
          topSet: true
        })
      }
    }).exec()
  }
  componentWillMount(){
    this.fetchBasicData();
  }

  fetchBasicData() {
    const page = Taro.getCurrentPages();
    let param = {};
    page.forEach(x => {
      if(x.route === 'pages/detail/index') {
        if(x.options.projectId && x.options.projectId !== '') {
          param.projectId = x.options.projectId
        } else {
          param.maoyanId = x.options.maoyanId
        }
      }
    })
    reqPacking({
      url: 'api/management/projectInfo',
      data: param
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
      url: 'api/management/judgeRole',
      data: { 
        projectId: basicData.projectId
      }
    }).then(res => {
        const { success, data = {} } = res;
        if (success) {
          this.setState({
            judgeRole: data
          });
          if(data.role === 2) {
            this.setState({
              current: 1,
            })
          }
        } 
      });
  }

  handleChangeKeyData(data) {
    this.setState({
      keyData: data
    })
  }

  changeTabs = value => {
    this.setState({
      current: value
    })
  }

  handleBack = () => {
    wx.navigateBack()
  }

  bottomClick(value) {
    const { projectId } = this.state.basicData;
    if(value === 'assess') {
      wx.navigateTo({
        url: `/pages/assess/create/index?projectId=${projectId}`,
      })
    } else {
      this.setState({
        showProgress: true
      })
    }
  }

  updateProcess = () => {
    this.setState({
      showProgress: false
    })
    this.refs.followStatus.fetFollowStatus();
  }

  render() {
    const { basicData, judgeRole, keyData, current, showProgress, top } = this.state;
    return (
      <View className="detail">
        <View className="detail-top" id="top">
          <View className="fixed" style={{height: (statusBarHeight + 44)+ 'px', backgroundColor: top < 0 ? '#FFFFFF':''}} >
            <View style={{height: statusBarHeight,}}></View>
            <View className="header">
              <View className="backPage" onClick={this.handleBack}>
                <Image src={ArrowLeft} alt=""></Image>
              </View>
              <Text className="header-title">{top < 0 ? basicData.name : ''}</Text>
            </View>
            
          </View>
          <View className="detail-top-icon" style={{marginTop: (statusBarHeight + 50)+ 'px' }}>
            <View className="cooperStatus">{CooperStatus[ basicData.cooperStatus ].name}</View>
            <View className="edit"><Image src={Edit} alt=""></Image></View>
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
        <View className="detail-tabs">
          <AtTabs
            current={current}
            animated={false}
            tabList={[
              { title: '最新跟进' },
              { title: '项目评估' },
              { title: '变更历史' }
            ]}
            onClick={this.changeTabs}
            className={basicData.cooperStatus === 2 && current === 0 ? "tabs nopaddingTab" : current === 2 ? "tabs bgHistory" : "tabs"}
            style={{top: (statusBarHeight + 50)+ 'px'}}
          >
            <AtTabsPane current={current} index={0}>
              <FollowStatus ref="followStatus" judgeRole={ judgeRole } basicData={ basicData } />
            </AtTabsPane>
            <AtTabsPane current={current} index={1}>
              {basicData.projectId && <EvaluationList projectId={ basicData.projectId } />}
            </AtTabsPane>
            <AtTabsPane current={current} index={2}>
              {basicData.projectId && <UseHistory projectId={ basicData.projectId }></UseHistory>}
            </AtTabsPane>
          </AtTabs>
        </View>
        <View className="bottom-fixed">
          <View className="assess" style={{background: '#FD9C00', marginRight: '20px'}} onClick={this.bottomClick.bind(this, 'assess')}>发起评估</View>
          <View className="assess" style={{background: '#276FF0'}} onClick={this.bottomClick.bind(this, 'progress')}>添加进展</View>
        </View>
        {showProgress ? <AddingProcess submitEvt={this.updateProcess} closeEvt={() => {this.setState({ showProgress: false })}} projectId={basicData.projectId} /> : null}
      </View>
    )
  }
}