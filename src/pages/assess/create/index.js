import React from 'react';
import { View, Button, Input, Textarea, Text, Block } from '@tarojs/components';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import reqPacking from '@utils/reqPacking.js';
import utils from '@utils/index';
import _cloneDeep from 'lodash/cloneDeep';
import dayjs from 'dayjs';
import Nodata from '@components/noData';
import NoAccess from '@components/noAccess';
import BriefInfo from '@components/briefInfo';
import FixedButton from '@components/fixedButton';
import AtActionSheet from '@components/m5/action-sheet';
import AtActionSheetItem from '@components/m5/action-sheet/body/item';
import AtFloatLayout from '@components/m5/float-layout';
import EndTimePicker from '@components/endtime-picker';
import '@components/m5/style/components/action-sheet.scss';
import '@components/m5/style/components/float-layout.scss';
import envConfig from '../../../constant/env-config';
import './index.scss';


const { errorHandle, getDefaultEndTime } = utils;

const METHOD_LIST = [
  {
    name: '大纲评估',
    type: 1,
    icon: 'icon-dagang',
  },
  {
    name: '剧本评估',
    type: 2,
    icon: 'icon-juben',
  },
  {
    name: '成片评估',
    type: 3,
    icon: 'icon-chengpian',
  },
];

const AUTH_ID = 95130;

export default class AC extends React.Component {
  state = {
    projectId: '',
    briefInfo: {},
    editorEvaluationName: false,
    evaluationMethod: '',
    tempId: '',
    titleErrorTip: false,
    despErrorTip: false,
    projectProfile: [],
    primaryFilesChecked: [],
    filesChecked: [],
    isSubmitting: false,
    uploadSelectorIsOpen: false,
    fileSelectorIsOpen: false,
    hasPermission: false,
    endTime: getDefaultEndTime(),
    endtimePickerOpen: false,
  }



  componentDidMount() {
    const { projectId } = getCurrentInstance().router.params;

    this.setState({ projectId });
    const authInfo = Taro.getStorageSync('authinfo');

    if (authInfo?.authIds?.includes(AUTH_ID)) {
      this.setState({ hasPermission: true });
      this.fetchBriefInfo(projectId);
      this.fetchProjectProfile(projectId);
    }
  }


  fetchProjectProfile = projectId => {
    reqPacking(
      {
        url: 'api/management/file/list',
        data: { projectId },
      },
      'server',
    ).then(res => {
      const { error, data = [] } = res;

      if (!error) {
        return this.setState({
          projectProfile: data,
        });
      }
      errorHandle(error);
    });
  };

  fetchBriefInfo=projectId => {
    Taro.showLoading({
      title: '加载中',
    });
    reqPacking(
      {
        url: 'api/applet/management/briefInfo',
        data: { projectId },
      },

      // 'server',
      'mock'
    ).then(res => {
      const { error, data } = res;

      if (!error) {
        const briefInfo = data;
        const { tempList = [] } = briefInfo;

        if (!briefInfo.projectEvaluationName) {
          briefInfo.projectEvaluationName = `《${briefInfo.name}》项目第${briefInfo.roundNum}轮评估`;
        }

        let evaluationMethod = tempList[0]?.type;
        let curTempId = tempList[0]?.tempV2[0].tempId;

        return this.setState({
          briefInfo,
          evaluationMethod,
          tempId: curTempId,
        });
      }
      errorHandle(error);
    }).catch(err => {
      errorHandle(err);
    }).finally(() => {
      Taro.hideLoading();
    });
  }

  editorTitle = (editorEvaluationName = true) => this.setState({ editorEvaluationName });

  titleChangeEvt = ({ target }) => {
    const curVal = target.value.replace(/\s+/g, '');

    return this.setState({
      titleErrorTip: (curVal.length > 20 || curVal.length == 0),
      briefInfo: {
        ...this.state.briefInfo,
        projectEvaluationName: curVal,
      },
    });
  };

  despChangeEvt = ({ target }) => {
    const curVal = target.value.replace(/\s+/g, '');
    const { briefInfo } = this.state;

    return this.setState({
      despErrorTip: curVal.length > 200,
      briefInfo: {
        ...briefInfo,
        description: curVal,
      },
    });
  };

  titleBlurEvt = ({ target }) => {
    const projectEvaluationName = target.value.replace(/\s+/g, '');

    if (projectEvaluationName.length > 20) return;

    this.editorTitle(false);

    if (!projectEvaluationName) return;

    this.setState({
      titleErrorTip: false,
      briefInfo: {
        ...this.state.briefInfo,
        projectEvaluationName,
      },
    });
  };

  evalMethodChange = methodType => {
    const { tempList } = this.state.briefInfo;

    if (methodType == this.state.evaluationMethod) return;
    let curTempId = tempList.filter(item => item.type == methodType)[0].tempV2[0].tempId;

    this.setState({
      evaluationMethod: methodType,
      primaryFilesChecked: [],
      filesChecked: [],
      tempId: curTempId,
    });
  };

  handleUpload = () => {
    this.setState({ uploadSelectorIsOpen: true });
  }

  handleUploadSelectorClose = () => {
    this.setState({ uploadSelectorIsOpen: false });
  }

  uploadFromMessage = () => {
    this.setState({ uploadSelectorIsOpen: false });
    const { projectId, filesChecked, primaryFilesChecked } = this.state;
    const that = this;

    Taro.chooseMessageFile({
      count: 1,
      success(res) {
        const tempFile = res.tempFiles[0];
        const tempFilePath = tempFile.path;

        if (tempFile.size > 1024 * 1024 * 20) {
          Taro.showModal({
            title: '提示',
            content: '上传的文件应小于20M',
          });
          return false;
        }
        Taro.showLoading({
          title: '上传中',
        });
        Taro.uploadFile({
          url: `${envConfig.server}/api/management/file/upload`,
          filePath: tempFilePath,
          name: 'projectFile',
          header: {
            'Content-Type': 'multipart/form-data',
            token: Taro.getStorageSync('token'),
          },
          formData: {
            projectId,
            name: tempFile.name,
          },
          success(uploadRes) {
            if (uploadRes.statusCode === 200) {
              const { success, data, error } = JSON.parse(uploadRes.data);

              if (success) {
                Taro.hideLoading();
                Taro.showToast({
                  title: '上传成功',
                  duration: 1000,
                });


                filesChecked.push(data);
                primaryFilesChecked.push(data);
                return that.setState({
                  filesChecked,
                  primaryFilesChecked,
                }, () => that.fetchProjectProfile(projectId));
              }
              Taro.hideLoading();
              errorHandle({
                message: error.message || '上传失败',
              });
              return;
            } else {
              Taro.hideLoading();
              errorHandle({
                message: '上传失败',
              });
            }
          },
          fail(err) {
            const { errMsg } = err;

            Taro.hideLoading();
            if (errMsg) {
              errorHandle({
                message: errMsg,
              });
            }
          },
        });
      },
    });
  }

  uploadFromProjectFile = () => {
    this.setState({ fileSelectorIsOpen: true, uploadSelectorIsOpen: false });
  }


  handleDelete = (uid, sign) => {
    let { filesChecked } = this.state;

    if (sign === 'profile') {
      let valueArr = filesChecked.filter(file => file !== uid);

      return this.setState({
        primaryFilesChecked: valueArr,
        filesChecked: valueArr,
      });
    }
  };

  handleChangeTemp=tempId => {
    this.setState({ tempId });
  }


  handlePreview=(e, tempId) => {
    e.stopPropagation();
    const that = this;

    Taro.navigateTo({
      url: `/pages/assess/template/index?tempId=${tempId}`,
      events: {
        selectTempId(data) {
          if (data) {
            that.setState({ tempId: Number(data) });
          }
        },
      },
    });
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
      description,
    };

    if (titleErrorTip || despErrorTip) return;
    return;
    this.setState({ isSubmitting: true });
    reqPacking(
      {
        url: 'api/management/appletevaluation',
        data: params,
        method: 'POST',
      },
      'server',
    ).then(res => {
      const { success, error, data } = res;

      if (success) {
        return Taro.showToast({
          title: '提交成功',
          duration: 1000,
          success: () => {
            Taro.redirectTo({
              url: `/pages/result/index?projectId=${projectId}&roundId=${data}`,
            });
          },
        });
      }
      this.setState({ isSubmitting: false });
      if (error.message) {
        errorHandle({ message: error.message || '提交失败' });
      }
    });
  };

  fileChecked = profileId => {
    let { primaryFilesChecked } = this.state;

    primaryFilesChecked.includes(profileId) ?
      primaryFilesChecked = primaryFilesChecked.filter(item => item !== profileId)
      : primaryFilesChecked.push(profileId);
    this.setState({ primaryFilesChecked });
  };

  checkedFiles = () => {
    this.setState({
      filesChecked: _cloneDeep(this.state.primaryFilesChecked),
      fileSelectorIsOpen: false,
    });
  };

  handleFileSelectorClose = () => {
    const { filesChecked } = this.state;

    this.setState({
      primaryFilesChecked: _cloneDeep(filesChecked),
    });
    this.setState({ fileSelectorIsOpen: false });
  }

  handleEndTime = () => {
    this.setState({ endtimePickerOpen: true });
  }

  handleEndTimePickerClose = () => {
    this.setState({ endtimePickerOpen: false });
  }

  handleEndTimeChange = time => {
    this.setState({ endTime: time });
  }

  render() {
    const {
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
      fileSelectorIsOpen,
      hasPermission,
      endTime,
      endtimePickerOpen,
    } = this.state;
    const filesCheckedInfoArr = projectProfile.filter(({ profileId }) => filesChecked.includes(profileId));
    const { tempList = [] } = briefInfo;
    const [curTemplateType] = tempList.filter(tempType => tempType.type == evaluationMethod);
    const curTempList = curTemplateType?.tempV2 || [];
    const { name, roundNum, pic } = briefInfo;

    return (
      <View className="assess-create-page">
        {
          !hasPermission && (<NoAccess tittle="暂无项目管理权限" titleColor="#333" contentColor="#333" />)
        }
        {
          hasPermission && (
            <Block>
              <BriefInfo
                name={name}
                pic={pic}
                roundNum={roundNum}
                text={`第${roundNum || '-'}轮`}
              />
              <View className="create-wrap">
                <View className="title-wrap">
                  {!editorEvaluationName &&
            <View className="title">
              {briefInfo.projectEvaluationName}
              <View className="edit-btn-wrap" onClick={this.editorTitle}>
                <View className="smarter-iconfont icon-edit" style={{ fontSize: '44rpx' }} />
              </View>
            </View>}
                  {editorEvaluationName && <Input
                    className={`title-input ${titleErrorTip ? 'error' : ''}`}
                    type="text"
                    autoFocus
                    value={briefInfo.projectEvaluationName}
                    onInput={this.titleChangeEvt}
                    onBlur={this.titleBlurEvt}
                  />}
                  {titleErrorTip ? <View className="error-tip">请输入1-20个字</View> : ''}
                </View>

                <View className="desc-wrap">
                  <Textarea
                    disableDefaultPadding
                    placeholder="请填写评估说明，最多200字"
                    onInput={this.despChangeEvt}
                    className={`desc-input ${despErrorTip ? 'error' : ''} description`}
                    maxlength={250}
                  />
                  {despErrorTip ? <View className="error-tip">请输入200个字以内</View> : ''}
                </View>

                <View className="evaluation-method-wrap">
                  <Text className="evaluation-title">选择评估方式</Text>
                  <View className="method-list-wrap">
                    {
                      tempList.map(item => {
                        const { icon } = METHOD_LIST.filter(method => method.type == item.type)[0];

                        return (
                          <View
                            key={item.type}
                            className={`method-item ${item.type === evaluationMethod ? 'active' : ''}`}
                            onClick={() => { this.evalMethodChange(item.type); }}
                          >
                            <View className={`smarter-iconfont ${icon}`} style={{ fontSize: '28rpx' }} />
                            {item.name}
                          </View>
                        );
                      })
                    }
                  </View>
                </View>

                <View className="upload-attachment">
                  {
                    filesCheckedInfoArr.length > 0 && filesCheckedInfoArr.map(file =>
                      <View key={1} className="file-wrap">
                        <View className="file-info">
                          <Text className="file-name">{file.profileName}</Text>
                          <Text className="file-size">{file.profileSize}</Text>
                        </View>
                        <View className="delete-btn" onClick={() => this.handleDelete(file.profileId, 'profile')}>
                          <View className="smarter-iconfont icon-delete" style={{ fontSize: '44rpx' }} />
                        </View>
                      </View>
                    )
                  }
                  {
                    evaluationMethod != 3 ?
                      <Block>
                        <View className={`upload-btn ${filesCheckedInfoArr.length > 0 ? 'mini' : ''}`} onClick={this.handleUpload}>{filesCheckedInfoArr.length > 0 ? '继续添加' : '上传附件'}</View>
                      </Block> :
                      <Text className="no-need">确保您已组织线下观看，此处无需上传附件</Text>
                  }
                </View>

                <View className="template-select-wrap">
                  <View className="title">选择评估模板</View>
                  {
                    curTempList.length > 0 ?
                      curTempList.map((item, index) => (
                        <View className={`template-item ${tempId === item.tempId ? 'active' : ''}`} key={item.tempId} onClick={() => { this.handleChangeTemp(item.tempId); }}>
                          <View className="template-name">{index + 1}、{item.title}</View>
                          <View className="preview-btn" onClick={event => { this.handlePreview(event, item.tempId); }}>预览</View>
                        </View>
                      ))
                      : (
                        <View className="no-template-note">
                          <Nodata text="暂无模板可选" />
                        </View>
                      )
                  }
                </View>

                <View className="endtime-wrap">
                  <View className="title">评估结束时间</View>
                  <View className="time" onClick={this.handleEndTime}>{endTime || '暂未选择'}</View>
                </View>

                <EndTimePicker
                  endTime={endTime}
                  isOpened={endtimePickerOpen}
                  onEndTimeChange={this.handleEndTimeChange}
                  onClose={this.handleEndTimePickerClose}
                />

                <FixedButton
                  className="publish-btn"
                  disabled={isSubmitting || titleErrorTip || despErrorTip ? true : false}
                  onClick={this.handleFinish}
                  loading={isSubmitting}
                >发布评估</FixedButton>

                <AtActionSheet
                  className="uplaod-action-sheet"
                  isOpened={uploadSelectorIsOpen}
                  cancelText="取消"
                  onClose={this.handleUploadSelectorClose}
                  onCancel={this.handleUploadSelectorClose}
                >
                  <AtActionSheetItem onClick={this.uploadFromProjectFile}>
              从项目文件中选择
                  </AtActionSheetItem>
                  <AtActionSheetItem onClick={this.uploadFromMessage}>
              从聊天中选择
                  </AtActionSheetItem>
                </AtActionSheet>

                <AtFloatLayout
                  className="file-select-list"
                  isOpened={fileSelectorIsOpen}
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
                      projectProfile.length === 0 && (
                        <Nodata text="暂无文件可选" />
                      )
                    }
                    {
                      projectProfile.map(({
                        profileId, profileName, uploader, uploadTime, profileSize,
                      }) => <View key={profileId} className="file-item-wrap">
                        <View className="left-info-wrap">
                          <Text className="file-name">{profileName}</Text>
                          <View className="message">
                            <Text className="uploader">{uploader}</Text>
                            <Text className="upload-time">{dayjs(uploadTime).format('YYYY-MM-DD HH:mm')}</Text>
                            <Text className="upload-size">{profileSize}</Text>
                          </View>
                        </View>
                        <Button
                          onClick={() => this.fileChecked(profileId)}
                          className={`select-btn ${primaryFilesChecked.includes(profileId) ? 'selected' : ''}`}
                        >
                          {primaryFilesChecked.includes(profileId) ? '取消' : '选择'}
                        </Button>
                      </View>)
                    }
                  </View>
                </AtFloatLayout>

              </View>

            </Block>
          )
        }
      </View>
    );
  }
}

