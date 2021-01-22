import { View, Button, Image } from '@tarojs/components'
import React from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import reqPacking from '../../../utils/reqPacking.js'
import accountVerify from '../../../components/accountVerify';
import './index.scss'

class _C extends React.Component {
  state = {
    projectId: '',
    briefInfo: {},
    editorEvaluationName: false,
    evaluationMethod: 1,
    tempId: '',
    titleErrorTip: false,
    despErrorTip: false,
    projectProfile: [],
    showModal: false,
    primaryFilesChecked: [],
    filesChecked: [],
  }

  componentDidMount(){
    const { projectId } = getCurrentInstance().router.params;
    this.setState({ projectId });
    this.fetchBriefInfo(projectId);
    this.fetchProjectProfile(projectId);
  }

  fetchProjectProfile = projectId => {
    reqPacking(
      {
        url: 'api/management/file/list',
        data: { projectId: projectId },
      },
      'server',
    ).then(res => {
        const { error, data = [] } = res;

        if (!error) {
          return this.setState({
            projectProfile: data
          });
        }

        error.message && Message.warning(error.message);
      });
  };

  fetchBriefInfo=(projectId)=>{
    reqPacking(
      {
        url: 'api/management/briefInfo',
        data: { projectId: projectId },
      },
      'server',
    ).then(res => {
        const { error, data } = res;
        console.log(data);
        if (!error) {
          const briefInfo = data;
          const { tempList = [] } = briefInfo;
          if (!briefInfo.projectEvaluationName) briefInfo.projectEvaluationName = `《${briefInfo.name}》项目第${briefInfo.roundNum}轮评估`;

          return this.setState({
            briefInfo,
            tempId: tempList && tempList.length > 0 ? tempList[ 0 ].tempId : "",
          });
        }

        error.message && Message.warning(error.message);
      });
  }

  editorTitle = (editorEvaluationName = true) => this.setState({ editorEvaluationName });

  titleChangeEvt = ({ target }) => {
    const curVal = target.value.replace(/\s+/g, "");

    return this.setState({ titleErrorTip: curVal.length > 20 });
  };

  upload = () => {
    Taro.chooseMessageFile({
      success (res) {
        const tempFilePaths = res.tempFilePaths
        Taro.uploadFile({
          url: 'https://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'user': 'test'
          },
          success (res){
            const data = res.data
            //do something
          }
        })
      }
    })
  }

  render() {
    const {
      projectId,
      briefInfo,
      editorEvaluationName,
      evaluationMethod,
      tempId,
      titleErrorTip,
      despErrorTip,
      projectProfile,
      showModal,
      primaryFilesChecked,
      filesChecked
    } = this.state;
    return (
      <View className="preview-wrap">
        <View className="title">发起第{briefInfo.roundNum}轮评估</View>
      </View>
    )
  }
}

export default accountVerify(_C);