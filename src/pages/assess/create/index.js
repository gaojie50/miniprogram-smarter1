import { View, Button, Input, Textarea, Text, Block } from '@tarojs/components'
import React from 'react';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import reqPacking from '@utils/reqPacking.js';
import utils from '@utils/index';
import _cloneDeep from 'lodash/cloneDeep'
import Nodata from '@components/noData';
import BriefInfo from '@components/briefInfo';
import AtActionSheet from '@components/m5/action-sheet';
import AtActionSheetItem from '@components/m5/action-sheet/body/item';
import AtFloatLayout from '@components/m5/float-layout';
import '@components/m5/style/components/action-sheet.scss';
import '@components/m5/style/components/float-layout.scss';
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
    primaryFilesChecked: [],
    filesChecked: [],
    isSubmitting: false,
    uploadSelectorIsOpen: false,
    fileSelectorIsOpen: false,
  }

  componentDidMount(){
    const { projectId } = getCurrentInstance().router.params;
    this.setState({ projectId });
    this.fetchBriefInfo(projectId);
    this.fetchProjectProfile(projectId);
  }

  componentDidShow(){
    const newTempId = Taro.getStorageSync('tempId');
    if(newTempId){
      this.setState({ tempId: Number(newTempId) });
      Taro.removeStorageSync('tempId');
    }
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
      })
  };

  fetchBriefInfo=(projectId)=>{
    Taro.showLoading({
      title: '加载中'
    });
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
      }).finally(res=>{
        Taro.hideLoading();
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
    this.setState({ uploadSelectorIsOpen: true });
  }

  handleUploadSelectorClose = () => {
    this.setState({ uploadSelectorIsOpen: false });
  }

  uploadFromMessage = ()=>{
    this.setState({ uploadSelectorIsOpen: false });
    const { projectId, filesChecked, primaryFilesChecked } = this.state;
    const that = this;
    Taro.chooseMessageFile({
      success (res) {
        const tempFile = res.tempFiles[0];
        const tempFilePath = tempFile.path;

        Taro.showLoading({
          title: '上传中'
        });
        Taro.uploadFile({
          url: 'https://scweb-movie.maoyan.com/api/management/file/upload', //仅为示例，非真实的接口地址
          filePath: tempFilePath,
          name: 'projectFile',
          header: {
            "Content-Type": "multipart/form-data",
            "token": Taro.getStorageSync('token'),
          },
          formData: {
            projectId: projectId,
            name: tempFile.name
          },
          success (res){
            if(res.statusCode===200){
              const { success, data, error } = JSON.parse(res.data);
              if (success) {
                Taro.hideLoading();
                Taro.showToast({
                  title: '上传成功',
                  duration: 1000
                });


                filesChecked.push(data);
                primaryFilesChecked.push(data);
                return that.setState({
                  filesChecked,
                  primaryFilesChecked,
                }, () => that.fetchProjectProfile(projectId));
              }
              Taro.hideLoading();
              return errorHandle({
                message: error.message
              });
            }else{
              Taro.hideLoading();
              errorHandle({
                message: '上传失败'
              });
            }
          },
          fail(res){
            const { errMsg } = res;
            Taro.hideLoading();
            if( errMsg ){
              errorHandle( {
                message: errMsg
              } );
            }
          }
        });
      }
    })
  }

  uploadFromProjectFile = ()=>{
    this.setState({ fileSelectorIsOpen: true, uploadSelectorIsOpen: false });
  }


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

  handleChangeTemp=(tempId)=>{
    this.setState({ tempId });
  }


  handlePreview=(e, tempId)=>{
    e.stopPropagation();
    Taro.navigateTo({
      url: `/pages/assess/template/index?tempId=${tempId}`
    })
  }

  handleFinish = () => {
    const {
      projectId,
      briefInfo,
      tempId,
      evaluationMethod,
      titleErrorTip,
      despErrorTip,
      filesChecked,
    } = this.state;
    const { description, projectEvaluationName } = briefInfo;
    const params = {
      projectId,
      projectEvaluationName,
      evaluationMethod,
      tempId,
      fileIdArr: filesChecked || [],
      description: description,
    };

    if (titleErrorTip || despErrorTip) return;
    console.log(params);
    return;
    this.setState({ isSubmitting: true });
    reqPacking(
      {
        url: 'api/management/appletevaluation',
        data: params,
        method: 'POST'
      },
      'server',
    ).then(res => {
      const { success, error } = res;

      if (success) {
        return Taro.showToast({
          title: '提交成功',
          duration: 2000,
          success: ()=>{
            Taro.navigateTo({
              url: '/pages/welcome/index'
            })
          }
        })
      }
      this.setState({ isSubmitting: false });
      error.message && errorHandle({message : error.message || '提交失败'});
    });
  };

  fileChecked = (profileId) => {
    let { primaryFilesChecked } = this.state;
    primaryFilesChecked.includes(profileId) ?
    primaryFilesChecked = primaryFilesChecked.filter(item => item != profileId)
    :primaryFilesChecked.push(profileId)
    this.setState({ primaryFilesChecked });
  };

  checkedFiles = () => {
    this.setState({
      filesChecked: _cloneDeep(this.state.primaryFilesChecked),
      fileSelectorIsOpen: false
    });
  };

  handleFileSelectorClose = ()=>{
    const { filesChecked } = this.state;
    this.setState({
      primaryFilesChecked: _cloneDeep(filesChecked)
    })
    this.setState({ fileSelectorIsOpen: false });
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
      primaryFilesChecked,
      filesChecked,
      isSubmitting,
      uploadSelectorIsOpen,
      fileSelectorIsOpen
    } = this.state;
    console.log(primaryFilesChecked);
    console.log(filesChecked);
    const filesCheckedInfoArr = projectProfile.filter(({ profileId }) => filesChecked.includes(profileId));
    const templateList = [];
    return (
      <View className="assess-create-page">
        <BriefInfo {...briefInfo} />
        <View className="create-wrap">
        <View  className="title-wrap">
          {!editorEvaluationName && 
          <View className="title">
            {briefInfo.projectEvaluationName}
            <View className="edit-btn-wrap" onClick={this.editorTitle}>
              <mp-icon type="outline" icon="pencil" size={24} onClick={ this.editorTitle }>编辑</mp-icon>
            </View>
          </View>}
          {editorEvaluationName && <Input
            className={ `title-input ${titleErrorTip ? "error" : ""}` }
            type="text"
            autoFocus
            value={ briefInfo.projectEvaluationName }
            onInput={ this.titleChangeEvt }
            onBlur={ this.titleBlurEvt } />}
          {titleErrorTip ? <View className="error-tip">请输入20个字以内</View> : ""}
        </View>

        <View className="desc-wrap">
          <Textarea
            placeholder="请填写评估说明，最多200字"
            onInput={ this.despChangeEvt }
            className={ `desc-input ${despErrorTip ? "error" : ""} description` } 
            maxlength={250}
          />
        {despErrorTip ? <View className="error-tip">请输入200个字以内</View> : ""}
        </View>

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
            <View key={ 1 } className="file-wrap">
              <View className="file-info">
                <Text className="file-name">{file.profileName}</Text>
                <Text className="file-size">{file.profileSize}</Text>
              </View>
              <View className="delete-btn" onClick={ () => this.handleDelete(file.profileId, "profile") }>
                <mp-icon type="outline" icon="delete" color="#333" size={20}></mp-icon>
              </View>
            </View>
            )
        }
        {
          evaluationMethod != 3 ?
            <Block>
              <View className={`upload-btn ${filesCheckedInfoArr.length>0 ? 'mini' : ''}`} onClick={this.handleUpload}>{filesCheckedInfoArr.length > 0 ? '继续添加':'上传附件'}</View>
            </Block> :
            <Text className="no-need">确保您已组织线下观看，此处无需上传附件</Text>
        }
        </View>
        
        <View className="template-select-wrap">
          <View className="title">选择评估模板</View>
          {
            templateList.length > 0 ? 
            templateList.map((item,index)=>{
              return (
                <View className={`template-item ${tempId===item.tempId? 'active':''}`} key={item.tempId} onClick={()=>{this.handleChangeTemp(item.tempId)}}>
                  <View className="template-name">{index+1}、{item.title}</View>
                  <View className="preview-btn" onClick={(event)=>{this.handlePreview(event, item.tempId)}}>预览</View>
                </View>
              );
            })
            :(
              <View className="no-template-note">
                <Nodata text="暂无模板可选" />
              </View>
            )
          }
        </View>

        <View className="btn-wrap">
          <Button 
            className="publish-btn" 
            disabled={isSubmitting ? true : false} 
            onClick={this.handleFinish}
            loading={ isSubmitting }
          >发布评估</Button>
        </View>

        <AtActionSheet 
          className="uplaod-action-sheet"
          isOpened={uploadSelectorIsOpen} 
          cancelText='取消'
          onCancel={ this.handleCancel } 
        >
          <AtActionSheetItem onClick={ this.uploadFromProjectFile}>
            从项目文件中选择
          </AtActionSheetItem>
          <AtActionSheetItem onClick={ this.uploadFromMessage }>
            从聊天中选择
          </AtActionSheetItem>
        </AtActionSheet>

        <AtFloatLayout
          className="file-select-list"
          isOpened={ fileSelectorIsOpen }
          title="从项目文件中选择"
          onClose={this.handleFileSelectorClose}
          footer={<View className="btn-wrap">
                    <Button 
                      className="select-sure-btn" 
                      onClick={this.checkedFiles}
                    >确定</Button>
                  </View>
                 }
        >
          <View className="content-wrap">
          {
            projectProfile.map(({
              profileId, profileName, uploader, uploadTime, profileSize
            }) => <View key={ profileId } className="file-item-wrap">
              <View className="left-info-wrap">
                <Text className="file-name">{profileName}</Text>
                <View className="message">
                  <Text className="uploader">{uploader}</Text>
                  <Text className="upload-time">{uploadTime}</Text>
                  <Text className="upload-size">{profileSize}</Text>
                </View>
              </View>
              <Button 
                onClick={() => this.fileChecked(profileId)}
                className={`select-btn ${primaryFilesChecked.includes(profileId)? 'selected':''}`}
              >
                {primaryFilesChecked.includes(profileId) ?'取消':'选择'}
              </Button>
            </View>)
          }
          </View>
        </AtFloatLayout>
        
      </View>
      </View>
    )
  }
}

