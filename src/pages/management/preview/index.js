import { View, Button, Input, Textarea, Text, Block } from '@tarojs/components'
import React from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import reqPacking from '../../../utils/reqPacking.js'
import utils from '../../../utils/index';
import './index.scss'

const { errorHandle } = utils;

const METHOD_LIST = [
  {
    name: '大纲评估',
    type: 1,
    Icon: ''
  },
  {
    name: '剧本评估',
    type: 2,
    Icon: ''
  },
  {
    name: '成片评估',
    type: 3,
    Icon: ''
  }
]
export default class _C extends React.Component {
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

        errorHandle(error);
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

        errorHandle(error);
      });
  }

  editorTitle = (editorEvaluationName = true) => this.setState({ editorEvaluationName });

  titleChangeEvt = ({ target }) => {
    const curVal = target.value.replace(/\s+/g, "");
    console.log(curVal);
    return this.setState({ 
      titleErrorTip: curVal.length > 20, 
      briefInfo: {
        ...this.state.briefInfo,
        projectEvaluationName: curVal,
      }
    });
  };

  despChangeEvt = ({ target }) => {
    const curVal = target.value.replace(/\s+/g, "");
    const { briefInfo } = this.state;

    return this.setState({
      despErrorTip: curVal.length > 200,
      briefInfo: {
        ...briefInfo,
        description: curVal,
      }
    });
  };

  titleBlurEvt = ({ target }) => {
    const projectEvaluationName = target.value.replace(/\s+/g, "");

    console.log(projectEvaluationName.length);
    if (projectEvaluationName.length > 20) return;
    
    this.editorTitle(false);

    if (!projectEvaluationName) return;

    this.setState({
      titleErrorTip: false,
      briefInfo: {
        ...this.state.briefInfo,
        projectEvaluationName,
      }
    });
  };

  evalMethodChange = (methodType) => {

    if (methodType == this.state.evaluationMethod) return;

    this.setState({
      evaluationMethod: methodType,
      primaryFilesChecked: [],
      filesChecked: [],
    });
  };

  handleUpload = () => {
    const { projectId, filesChecked, primaryFilesChecked } = this.state;
    Taro.chooseMessageFile({
      success (res) {
        const tempFilePath = res.tempFiles[0].path
        console.log(tempFilePath);
        Taro.uploadFile({
          url: 'https://scweb-movie.maoyan.com/api/management/file/upload', //仅为示例，非真实的接口地址
          filePath: tempFilePath,
          name: 'projectFile',
          formData: {
            projectId: projectId,
          },
          success (res){
            const { success, data, error } = JSON.parse(res.data);
            if (success) {
              filesChecked.push(data);
              primaryFilesChecked.push(data);
              return this.setState({
                filesChecked,
                primaryFilesChecked,
              }, () => this.fetchProjectProfile(projectId));
            }
            return errorHandle({
              message: error.message
            });
          },
          fail(res){
            const { errMsg } = res;
            console.log(errMsg);
            if( errMsg ){
              errorHandle( {
                message: errMsg
              } );
            }
          }
        })
      }
    })
  }

  uploadFn = file => {
    const { projectId, filesChecked, primaryFilesChecked } = this.state;
    const formData = new FormData();

    formData.append('projectId', projectId);
    formData.append('projectFile', file.originFileObj);

    request
      .post('/api/management/file/upload')
      .proxy('server')
      .send(formData)
      .then(res => {
        const { success, data } = res.body;

        if (success) {
          filesChecked.push(data);
          primaryFilesChecked.push(data);
          return this.setState({
            filesChecked,
            primaryFilesChecked,
          }, () => this.fetchProjectProfile(projectId));
        }

        return Message.error(`${file.name} 上传失败`);
      });
  };

  handleDelete = (uid, sign) => {
    let { filesChecked } = this.state;

    if (sign == 'profile') {
      let valueArr = filesChecked.filter(file => file != uid);

      return this.setState({
        primaryFilesChecked: valueArr,
        filesChecked: valueArr
      });
    }
  };

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
    
    const filesCheckedInfoArr = projectProfile.filter(({ profileId }) => filesChecked.includes(profileId));
    return (
      <View className="preview-wrap">
        <View  className="title-box">
          {!editorEvaluationName && <View className="title">{briefInfo.projectEvaluationName}<Button onClick={ this.editorTitle }>编辑</Button></View>}
          {editorEvaluationName && <Input
            className={ `title-input ${titleErrorTip ? "error" : ""}` }
            type="text"
            autoFocus
            value={ briefInfo.projectEvaluationName }
            onInput={ this.titleChangeEvt }
            onBlur={ this.titleBlurEvt } />}
          {titleErrorTip ? <View className="error-tip">请输入20个字以内</View> : ""}
        </View>
        <Textarea
          placeholder="请填写评估说明"
          onInput={ this.despChangeEvt }
          className={ `desc-input ${despErrorTip ? "error" : ""} description` } />
        {despErrorTip ? <p className="error-tip">请输入200个字以内</p> : ""}

        <View className="evaluation-method-wrap">
          <Text className="evaluation-title">选择评估方式</Text>
          <View className="method-list-wrap">
            {
              METHOD_LIST.map(item=>{
                return (
                  <View className={`method-item ${item.type === evaluationMethod ? 'active':''}`} onClick={()=>{this.evalMethodChange(item.type)}}>{item.name}</View>
                )
              })
            }
          </View>
        </View>

        <View className="upload-attachment">
        {
          filesCheckedInfoArr.length > 0 && filesCheckedInfoArr.map(file =>
            <View key={ file.profileId } className="file-wrap">
              <Text>{file.profileName}</Text>
              <View onClick={ () => this.handleDelete(file.profileId, "profile") }>删除</View>
            </View>)
        }
        {
          evaluationMethod != 3 ?
            <Block>
              <View className="upload-wrap" onClick={this.handleUpload}>上传附件</View>
            </Block> :
            <Text className="no-need">确保您已组织线下观看，此处无需上传附件</Text>
        }
        </View>
      </View>
    )
  }
}

