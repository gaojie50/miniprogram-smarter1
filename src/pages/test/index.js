import { View, Button } from '@tarojs/components'
import React from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import reqPacking from '../../../utils/reqPacking.js'
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
    this.fetchBriefInfo();
  }

  fetchBriefInfo=()=>{
    const { projectId } = this.state;
    reqPacking(
      {
        url: 'api/management/briefInfo',
        data: { projectId: projectId },
      },
      'server',
    ).then(res => {
        const { error, data } = res.body;
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
    return (
      <View className="welcome">
        <View>
          preview
          <Button size='mini' type='primary' onClick={this.upload}>上传</Button>
          <Button size='mini' type='primary' onClick={this.download}>下载</Button>
          <Button size='mini' type='primary' onClick={this.preview}>预览图片</Button>
          <Button size='mini' type='primary' onClick={this.drawImage}>生成当前页图片</Button>
        </View>
      </View>
    )
  }
}

export default _C
