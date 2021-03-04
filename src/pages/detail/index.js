import { View, Image, Text, ScrollView } from '@tarojs/components'
import React from 'react';
import Taro from '@tarojs/taro';
import { AtTabs, AtTabsPane } from '@components/m5';
import BasicData from './basicData';
import KeyData from './keyData';
import FollowStatus from './followStatus';
import Cooper from './cooperStatus';
import { UseHistory } from '../board/history';
import { EvaluationList } from '../board/evaluate';
import { CooperStatus } from './constant';
import { set as setGlobalData, get as getGlobalData } from '../../global_data';
import AddingProcess from '@components/addingProcess';
import ProjectFile from './projectFile';
import FacePeople from './people';
import People from '@static/detail/people.png';
import File from '@static/detail/file.png';
import ArrowLeft from '@static/detail/arrow-left.png';
import Edit from '@static/detail/edit.png';
import './index.scss';
import '@components/m5/style/index.scss';
import utils from '@utils/index';


const { isDockingPerson } = utils;
const reqPacking = getGlobalData('reqPacking');
const {statusBarHeight} = getGlobalData('systemInfo');
export default class Detail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      basicData: {
        cooperStatus: 2,
      },
      fileData: [],
      peopleData: [],
      judgeRole: {}, //包含role、cooperation、releaseStage
      keyData: {},
      current: 0,
      showProgress: false,
      top: 0,
      topSet: true,
      showCooperStatus: false,
      showPeople: false,
      showProjectFile: false,
      loading: true,
      stopScroll: false,
      isFixed: false,
      navbarInitTop: 0, // 导航距顶部的距离
    }
  }

  componentDidShow(){
    this.fetchBasicData();
  }

  fetchBasicData() {
    const page = Taro.getCurrentPages();
    let param = {};

    page.forEach(x => {
      if(x.route === 'pages/detail/index') {
        if(x.options.projectId && x.options.projectId !== '' && x.options.projectId !== '0') {
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
          loading: false
        }, () => {
          this.fetchJudgeRole();
          // this.fetchRole();
          this.fetchPeople();
          this.fetchProjectFile();
        });
      }
    });
  }

  fetchPeople() {
    const { basicData } = this.state;
    reqPacking({
      url: '/api/management/user/list',
      data: {
        projectId: basicData.projectId
      }
    })
    .then(res => {
      if(res.success) {
        this.setState({
          peopleData: res.data
        })
      }
    })
  }

  fetchProjectFile() {
    const { basicData } = this.state;
    reqPacking({
      url: '/api/management/file/list',
      data: {
        projectId: basicData.projectId
      }
    })
    .then(res => {
      if(res.success) {
        this.setState({
          fileData: res.data
        })
      }
    })
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
          this.refs.keyData.fetchKeyData();
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
    if(Taro.getCurrentPages().length>1){
      Taro.navigateBack();
    }else{
      Taro.redirectTo({
        url: `/pages/board/index`
      })
    }
  }

  bottomClick(value) {
    const { projectId } = this.state.basicData;
    if(value === 'assess') {
      wx.navigateTo({
        url: `/pages/assess/create/index?projectId=${projectId}`,
      })
    } else {
      this.setState({
        showProgress: true,
        stopScroll: true
      })
    }
  }

  updateProcess = () => {
    this.setState({
      showProgress: false
    })
    this.refs.followStatus.fetFollowStatus();
  }

  pageScroll = e => {
    const { top, topSet } = this.state;
    const { scrollTop } = e.detail;
    const { isFixed } = this.state;
    if(scrollTop > 5 && topSet) {
      this.setState({
        top: scrollTop,
        topSet: false
      })
    }
    if(scrollTop < 5 && !topSet) {
      this.setState({
        top: scrollTop,
        topSet: true
      })
    }

    // let query = Taro.createSelectorQuery();
    // let topBarHeight = 0;
    // query.select('#top').boundingClientRect((res) => {
    //   if(res.height !== 0) {
    //     topBarHeight = res.height;
    //   }
	  // }).exec();
    // query.select('#tabs').boundingClientRect((res) => {
    //   if(res.top <= (topBarHeight + 15)) {
    //     if(!isFixed) {
    //       this.setState({
    //         isFixed: true
    //       })
    //     }
    //   } else {
    //     if(isFixed) {
    //       this.setState({
    //         isFixed: false
    //       })
    //     }
    //   }
    // }).exec();
  }

  render() {
    const { stopScroll, loading, basicData, fileData, peopleData, judgeRole, keyData, current, showProgress, top, showCooperStatus, showPeople, showProjectFile, isFixed } = this.state;

    return (
      <ScrollView scrollY={!stopScroll} className={stopScroll ? "detail stopScroll" : "detail"} onScroll={this.pageScroll}>
        <View className="detail-top">
          <View className="fixed" id="top" style={{height: (statusBarHeight + 44)+ 'px', backgroundColor: top > 5 ? '#FFFFFF':''}} >
            <View style={{height: statusBarHeight,}}></View>
            <View className="header">
              <View className="backPage" onClick={this.handleBack}>
                <Image src={ArrowLeft} alt=""></Image>
              </View>
              <Text className="header-title">{top > 5 ? basicData.name : ''}</Text>
            </View>
          </View>
          <View className="detail-top-icon" style={{marginTop: (statusBarHeight + 44)+ 'px' }}>
            <View className="cooperStatus" style={ { 
              color: CooperStatus[ basicData.cooperStatus ].color
            } }
              onClick={() => this.setState({showCooperStatus: !showCooperStatus, stopScroll: true})}
            >
              {loading ? '' : CooperStatus[ basicData.cooperStatus ].name}
              {loading ? '' : <Image className="cooper-img" src={basicData.cooperStatus < 3 ? `../../static/detail/cooper-arrow${basicData.cooperStatus}.png` : '../../static/detail/cooper-arrow3.png'} ></Image>}
            </View>
          {
            judgeRole.role === 2 ? null 
             : <View className="edit" onClick={() => wx.navigateTo({
              url: `/pages/detail/editProject/index?projectId=${basicData.projectId}`,
            })}><Image src={Edit} alt=""></Image></View>
          }
            <View className="opt" onClick={() => this.setState({showProjectFile: true,stopScroll: true})}>
               <Image src={File} alt=""></Image>
               <Text>{fileData.length}</Text>
             </View>
             <View className="opt" onClick={() => this.setState({showPeople: true, stopScroll: true})}>
             <Image src={People} alt=""></Image>
             <Text>{peopleData.length}</Text>
             </View>
           </View>
         </View>
         <BasicData 
          data={ basicData } 
          judgeRole={ judgeRole }
          keyData={ keyData }
          changeStopScroll= { () => this.setState({stopScroll: !stopScroll})}
        />
        {
          judgeRole.role && judgeRole.role !== 2 ? 
          <KeyData 
            ref="keyData"
            basicData={ basicData } 
            keyData={ keyData } 
            judgeRole={ judgeRole }
            changeKeyData={ data => this.handleChangeKeyData(data)}
          /> : ''
        }
        <View className="detail-tabs" id="tabs">
          <AtTabs
            current={current}
            animated={false}
            tabList={[
              { title: '最新跟进' },
              { title: '项目评估' },
              { title: '变更历史' }
            ]}
            onClick={this.changeTabs}
            className={(isFixed ? "tabFixed " : " ") + (basicData.cooperStatus === 2 && current === 0 ? "tabs nopaddingTab" : (current === 1 || current === 2)  ? "tabs bgHistory" : "tabs")}
            swipeable={false}
          >
            <AtTabsPane current={current} index={0}>
              <FollowStatus ref="followStatus" judgeRole={ judgeRole } basicData={ basicData } />
            </AtTabsPane>
            <AtTabsPane current={current} index={1}>
              <EvaluationList projectId={ basicData.projectId } keyData={ keyData } judgeRole={ judgeRole } />
              <View className="noMore">没有更多了</View>
            </AtTabsPane>
            <AtTabsPane current={current} index={2}>
              {basicData.projectId && <UseHistory projectId={ basicData.projectId } keyData={keyData}></UseHistory>}
            </AtTabsPane>
          </AtTabs>
        </View>
        {isDockingPerson(judgeRole.role) && <View className="bottom-fixed">
          <View className="assess" style={{background: '#FD9C00', marginRight: '20px'}} onClick={this.bottomClick.bind(this, 'assess')}>发起评估</View>
          <View className="assess" style={{background: '#276FF0'}} onClick={this.bottomClick.bind(this, 'progress')}>添加进展</View>
        </View>}
        {showProgress ? <AddingProcess submitEvt={this.updateProcess} closeEvt={() => {this.setState({ showProgress: false, stopScroll: false })}} projectId={basicData.projectId} /> : null}
        {showCooperStatus ? <Cooper basicData={basicData} fetchBasicData={() => this.fetchBasicData()} cancelShow={() => this.setState({showCooperStatus: false, stopScroll: false})}></Cooper> : null}
        {showPeople ? <FacePeople peopleData={peopleData} cancelShow={() => this.setState({showPeople: false, stopScroll: false})}></FacePeople> : null}
        {showProjectFile ? <ProjectFile fileData={fileData} cancelShow={() => this.setState({showProjectFile: false, stopScroll: false})}></ProjectFile> : null}
      </ScrollView>
    )
  }
}