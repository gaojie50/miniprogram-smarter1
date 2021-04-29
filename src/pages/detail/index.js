import { View, Image, Text, ScrollView } from '@tarojs/components'
import React from 'react';
import Taro from '@tarojs/taro';
import lx from '@analytics/wechat-sdk';
import BasicData from './basicData';
import KeyData from './keyData';
import FollowStatus from './followStatus';
import Cooper from './cooperStatus';
import { UseHistory } from '../board/history';
import { EvaluationList } from '../board/evaluate';
import { CooperStatus } from './constant';
import { get as getGlobalData } from '../../global_data';
import AddingProcess from '@components/addingProcess';
import FloatLayout from '@components/m5/float-layout';
import utils from '@utils/index.js'
import ProjectFile from './projectFile';
import FacePeople from './people';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import People from '@static/detail/people.png';
import File from '@static/detail/file.png';
import ArrowLeft from '@static/detail/arrow-left.png';
import Edit from '@static/detail/edit.png';
import CompeteMarket from './competeMarket';
import './index.scss';
import '@components/m5/style/components/float-layout.scss';

dayjs.extend(isToday);
const { isDockingPerson, formatNumber, } = utils;
const reqPacking = getGlobalData('reqPacking');
const capsuleLocation = getGlobalData('capsuleLocation');
const { rpxTopx } = utils;
const headerBarHeight = capsuleLocation.bottom + rpxTopx(15);
const titleBarPadding = capsuleLocation.top;
const titleBarHeight = capsuleLocation.bottom - capsuleLocation.top;
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
      top: false,
      showCooperStatus: false,
      showPeople: false,
      showProjectFile: false,
      loading: true,
      stopScroll: false,
      isFixed: false,
      navbarInitTop: 0, // 导航距顶部的距离
      toView: 'follow',
      setBgColor: false,
      evaluation: [],
      history: [],
      releaseDataList: {},
      showCompetePanel: false,
      projectInfo: {},
    }
  }

  componentDidShow() {
    lx.pageView('c_movie_b_z5wvew69', {
      custom: {
        product_id: Taro.getCurrentInstance().router.params.projectId
      }
    });
    this.fetchBasicData();
  }

  onShareAppMessage(res) {
    const { basicData } = this.state;
    const { projectId, pic } = basicData
    const { target, from } = res;
    if (from != 'button') return;
    const { userInfo } = Taro.getStorageSync('authinfo');
    const { dataset } = target;
    const { realName = "" } = userInfo;
    return new Promise((resolve, reject) => {
      let shareMessage = {}
      switch (dataset.sign) {
        case 'invite': {
          Taro.showLoading({
            title: '分享信息获取中',
          })
          reqPacking(
            {
              url: `api/management/shareEvaluation?roundId=${dataset.roundId}`,
              method: 'POST'
            },
            'server',
          ).then((res) => {
            Taro.hideLoading();
            const { success, error, data } = res;
            if (success) {
              const { inviteId, participationCode } = data;
              shareMessage = {
                title: `${realName} 邀请您参与《${dataset.roundTitle}》项目评估`,
                imageUrl: pic ? pic : 'https://s3plus.meituan.net/v1/mss_e2821d7f0cfe4ac1bf9202ecf9590e67/cdn-prod/file:96011a7c/logo.png',
                path: `/pages/assess/index/index?projectId=${projectId}&roundId=${dataset.roundId}&inviteId=${inviteId}&participationCode=${participationCode}`
              };
              resolve(shareMessage)
            } else {
              reject('分享信息获取失败');
            }
          }).catch(res => {
            console.log(res);
            reject('分享信息获取失败');
          })
          break;
        };
        case 'attend': {
          shareMessage = {
            title: `${realName} 分享给您关于《${dataset.roundTitle}》项目的报告`,
            imageUrl: pic ? pic : 'https://s3plus.meituan.net/v1/mss_e2821d7f0cfe4ac1bf9202ecf9590e67/cdn-prod/file:96011a7c/logo.png',
            path: `/pages/result/index?projectId=${projectId}&roundId=${dataset.roundId}`
          }
          resolve(shareMessage)
          break;
        }
        default: {
          shareMessage = {
            title: '分享报告',
            path: `/pages/result/index?projectId=${projectId}&roundId=${dataset.roundId}`,
          };
          resolve(shareMessage);
        }
      }

    })
  }


  fetchBasicData() {
    const page = Taro.getCurrentPages();
    let param = {};
    page.forEach(x => {
      if (x.__route__ === 'pages/detail/index') {
        if (x.options.projectId && x.options.projectId !== '' && x.options.projectId !== '0') {
          param.projectId = x.options.projectId
        } else {
          param.projectId = ''
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
            loading: false,
            projectInfo: data,
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
        if (res.success) {
          this.setState({
            peopleData: res.data
          })
        }
      })
  }

  fetchCompetitiveSituation() {
    if(this.state.basicData.category !== 3) return;
    
    const { releaseTime = {} } = this.state.keyData;
    const releaseTimeArry = releaseTime.time && releaseTime.time.match(/-/g);
    if ((releaseTimeArry && releaseTimeArry.length === 2)) {
      // 获取该周的第几天
      let index = dayjs(releaseTime.time).format('d') || 7;

      // 自然周的周一到周日
      const releaseStartDate = dayjs(releaseTime.time).subtract(index < 5 ? parseInt(index) + 2 : index - 5, 'd').format('YYYY-MM-DD');
      const releaseEndDate = dayjs(releaseTime.time).add(index < 5 ? 4 - index : 11 - index, 'd').format('YYYY-MM-DD');


      const startDt = dayjs(releaseStartDate).unix();
      const endDt = dayjs(releaseEndDate).unix();

      const query = {
        projectId: this.state.basicData?.projectId,
        startDt,
        endDt,
        hasConfirmed: true
      };

      reqPacking({
        url: 'api/management/searchcompetitivesituation',
        data: query,
      }).then(res => {
        const { success, data = {}, error } = res;

        let insert = 0;

        if (success) {
          data.competitiveSituationDetailList && data.competitiveSituationDetailList.forEach((item, index) => {
            const newIndex = index + 1;
            item.order = newIndex < 10 ? `0${newIndex}` : `${newIndex}`;
            if (index > 5 && item.projectId === this.props.projectId) {
              insert = index;
            }
          });
          if (insert !== 0) {
            data.competitiveSituationDetailList.unshift(data.competitiveSituationDetailList[insert]);
          }
          this.setState({
            releaseDataList: data,
          });
        } else {
          Taro.showToast({
            title: error.message,
            icon: 'none',
            duration: 2000
          });
        }
      })
    }
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
        if (res.success) {
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
        if (data.role === 2) {
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
    }, this.fetchCompetitiveSituation)
  }

  handleBack = () => {
    if (Taro.getCurrentPages().length > 1) {
      Taro.navigateBack();
    } else {
      Taro.switchTab({
        url: `/pages/board/index`
      })
    }
  }

  bottomClick(value) {
    const { projectId } = this.state.basicData;
    if (value === 'assess') {
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
      showProgress: false,
      stopScroll: false,
    })
    this.refs.followStatus.fetFollowStatus();
  }

  pageScroll = e => {
    const that = this;
    const { top } = this.state;
    const { scrollTop } = e.detail;
    const { isFixed, stopScroll } = this.state;

    if (scrollTop > 5 && !top) {
      this.setState({
        top: true,
      })
    }
    if (scrollTop < 20 && top) {
      this.setState({
        top: false,
      })
    }
  }

  handleJudgeData = (data = [], type) => {
    const { current } = this.state;

    if (type === 'history') {
      this.setState({
        history: data
      })
    }
    if (type === 'evaluation') {
      this.setState({
        evaluation: data.evaluationList
      })
    }
  }

  handleSwitch(param) {
    const { evaluation, history, basicData } = this.state;
    let hasFollowData = false;
    const { followData } = this.refs.followStatus.state;
    Object.keys(followData).forEach(i => {
      if (followData[i] && followData[i].length > 0 && !hasFollowData) {
        hasFollowData = true;
      }
    })

    this.setState({
      current: param,
      toView: param === 0 && hasFollowData ? 'follow' : param === 1 && evaluation.length > 0 ? 'evaluation' : history.length > 0 ? 'history' : '',
      setBgColor: (param === 1 && evaluation.length > 0) || (param === 2 && history.length > 0) || (param === 0 && basicData.cooperStatus === 2) ? true : false
    })
  }

  goToBoxForecasting = () => {
    const { basicData, keyData } = this.state;

    Taro.setStorage({
      key: 'acceptDataFromDetail',
      data: { basicData, keyData },
      success: () => {
        Taro.navigateTo({
          url: '/pages/boxForecasting/index',
        });
      }
    })
  }

  handleShowCompetePanel = () => {
    this.setState({
      showCompetePanel: true
    })
  }

  handleCloseCompetePanel = () => {
    this.setState({
      showCompetePanel: false
    })
  }

  render() {
    const {
      stopScroll,
      loading,
      basicData,
      fileData,
      peopleData,
      judgeRole,
      keyData,
      current,
      showProgress,
      top,
      showCooperStatus,
      showPeople,
      showProjectFile,
      toView,
      setBgColor,
      releaseDataList,
      showCompetePanel,
      projectInfo,
    } = this.state;
    const releaseTimeArry = keyData?.releaseTime?.time?.match(/-/g);
    const textFn = () => <View className='launch-text'><Image src="https://s3plus.meituan.net/v1/mss_e2821d7f0cfe4ac1bf9202ecf9590e67/cdn-prod/file:96011a7c/eidt.png" />发起机器预测票房</View>;
    const {updateTime, estimateNum} = keyData?.estimateBox?.machineEstimateBoxDetail || {};
    
    return (
      <View>
        <View className='detail-top'>
          <View className={top ? "fixed" : ""} id='top' style={{ height: `${headerBarHeight}px`, paddingTop: `${titleBarPadding}px`, backgroundColor: top ? '#FFFFFF' : '' }} >
            <View className='header' style={{ height: `${titleBarHeight}px`, lineHeight: `${titleBarHeight}px` }}>
              <View className='backPage' onClick={this.handleBack}>
                <Image src={ArrowLeft} alt=''></Image>
              </View>
              <Text className='header-title'>{top ? basicData.name : ''}</Text>
            </View>
          </View>
        </View>
        <ScrollView scrollY={!stopScroll} enhanced bounces={false} scrollIntoView={toView} className={stopScroll ? "detail stopScroll" : "detail"} style={{ top: `${headerBarHeight}px`, minHeight: `calc(100vh - ${headerBarHeight})px` }} onScroll={this.pageScroll}>
          <View className='detail-top-icon'>
            <View className='cooperStatus' style={{
              color: CooperStatus[basicData.cooperStatus].color
            }}
              onClick={() => this.setState({ showCooperStatus: !showCooperStatus, stopScroll: true })}
            >
              {loading ? '' : CooperStatus[basicData.cooperStatus].name}
              {loading ? '' : <Image className='cooper-img' src={basicData.cooperStatus < 3 ? `../../static/detail/cooper-arrow${basicData.cooperStatus}.png` : '../../static/detail/cooper-arrow3.png'} ></Image>}
            </View>
            {
              judgeRole.role === 2 ? null
                : <View className='edit' onClick={() => wx.navigateTo({
                  url: `/pages/detail/editProject/index?projectId=${basicData.projectId}`,
                })}
                ><Image src={Edit} alt=''></Image></View>
            }
            <View className='opt' onClick={() => this.setState({ showProjectFile: true, stopScroll: true })}>
              <Image src={File} alt=''></Image>
              <Text>{fileData.length}</Text>
            </View>
            <View className='opt' onClick={() => this.setState({ showPeople: true, stopScroll: true })}>
              <Image src={People} alt=''></Image>
              <Text>{peopleData.length}</Text>
            </View>
          </View>
          <BasicData
            data={basicData}
            judgeRole={judgeRole}
            keyData={keyData}
            changeStopScroll={() => this.setState({ stopScroll: !stopScroll })}
          />
          <KeyData
            ref='keyData'
            basicData={basicData}
            keyData={keyData}
            judgeRole={judgeRole}
            projectInfo={projectInfo}
            changeKeyData={data => this.handleChangeKeyData(data)}
          /> 
          {basicData.category === 3 && judgeRole?.releaseStage === 1 && judgeRole?.role !== 2? (
            releaseTimeArry && releaseTimeArry.length === 2 ? <View className='mini-box'>
              <View className='machine-eval-mini' onClick={this.goToBoxForecasting}>
                {!estimateNum ?
                  textFn() :
                  <View>
                    <View className="title">最新机器预测票房</View>
                    <View className="box">{formatNumber(estimateNum, 'floor').text}
                      <Text> {`${ 
                        dayjs(updateTime).isToday() ? 
                          dayjs(updateTime).format('HH:mm') : 
                          dayjs(updateTime).format('YYYY-MM-DD')}更新` || ''}
                      </Text>
                    </View>
                    <View className="num"><Text className="arrow" /></View>
                  </View>
                }

              </View>
              <View className='release-week-mini' onClick={this.handleShowCompetePanel}>
                <View className='title'>上映当周预估大盘</View>
                <View className='box'>{formatNumber(releaseDataList.estimateTotalNum, 'floor').text}
                  {/* <Text> {keyData.releaseTime.describe || ''}</Text> */}
                </View>
                <View className='num'>{releaseDataList.releaseNum || '-'}部 <Text className='arrow' /></View>
              </View>
            </View> :
              <View className="machine-eval-btn" onClick={this.goToBoxForecasting}>
                {textFn()}
              </View>
          ) : ""}
          <View className='detail-tabs' id={toView} >
            <View className='detail-tabs-header' onClick={this.click} id='tabs' style={{ position: 'sticky', top: '-3rpx', zIndex: 9 }}>
              <View onClick={() => this.handleSwitch(0)} className={current === 0 ? "detail-tabs-header-item active" : "detail-tabs-header-item"}>最新跟进</View>
              <View onClick={() => this.handleSwitch(1)} className={current === 1 ? "detail-tabs-header-item active" : "detail-tabs-header-item"}>项目评估</View>
              <View onClick={() => this.handleSwitch(2)} className={current === 2 ? "detail-tabs-header-item active" : "detail-tabs-header-item"}>变更历史</View>
            </View>
            <View className='detail-tabs-body' style={{ backgroundColor: setBgColor || (current === 0 && basicData.cooperStatus === 2) ? '#F8F8F8' : '#ffffff', }}>
              <View className={current === 0 ? "body-active" : "body-inactive"} id='follow'>
                <FollowStatus ref='followStatus' judgeRole={judgeRole} basicData={basicData} />
              </View>
              <View className={current === 1 ? "body-active" : "body-inactive"} id='evaluation'>
                <EvaluationList judgeData={this.handleJudgeData} judgeRole={judgeRole} projectId={basicData.projectId} keyData={keyData} />
                {this.state.evaluation.length > 0 ? <View className='noMore'>没有更多了</View> : null}
              </View>
              <View className={current === 2 ? "body-active" : "body-inactive"} id='history'>
                <UseHistory judgeData={this.handleJudgeData} projectId={basicData.projectId} keyData={keyData}></UseHistory>
                {this.state.history.length > 0 ? <View className='noMore'>没有更多了</View> : null}
              </View>
              <View className='bottom-relative' style={{ backgroundColor: setBgColor || (current === 0 && basicData.cooperStatus === 2) ? '#F8F8F8' : '#ffffff' }}></View>
            </View>
          </View>
          {isDockingPerson(judgeRole.role) && <View className='bottom-fixed'>
            <View className='assess' style={{ background: '#FD9C00', marginRight: '20px' }} onClick={this.bottomClick.bind(this, 'assess')}>发起评估</View>
            <View className='assess' style={{ background: '#276FF0' }} onClick={this.bottomClick.bind(this, 'progress')}>添加进展</View>
          </View>
          }
        </ScrollView>

        <FloatLayout
          isOpened={showProgress}
          className='layout-process'
          onClose={() => this.setState({ showProgress: false, stopScroll: false })
          }
        >
          <AddingProcess
            closeEvt={() => this.setState({ showProgress: false, stopScroll: false })}
            submitEvt={this.updateProcess}
            projectId={basicData.projectId}
          />
        </FloatLayout>
        <Cooper
          show={showCooperStatus}
          basicData={basicData}
          fetchBasicData={() => this.fetchBasicData()}
          cancelShow={() => this.setState({ showCooperStatus: false, stopScroll: false })}
        />
        <FacePeople
          show={showPeople}
          peopleData={peopleData}
          judgeRole={judgeRole}
          fetchPeople={() => this.fetchBasicData()}
          cancelShow={() => this.setState({ showPeople: false, stopScroll: false })}
        />
        <ProjectFile
          judgeRole={judgeRole}
          show={showProjectFile}
          fileData={fileData}
          projectId={basicData.projectId}
          cancelShow={() => this.setState({ showProjectFile: false, stopScroll: false })}
          fetchProjectFile={() => this.fetchProjectFile()}
        />
        <CompeteMarket
          projectId={basicData?.projectId}
          releaseTime={keyData?.releaseTime}
          show={showCompetePanel}
          closeFn={this.handleCloseCompetePanel}
        />
      </View>
    )
  }
}