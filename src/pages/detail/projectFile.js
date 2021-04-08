import React from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import FloatCard from '@components/m5/float-layout';
import utils from '@utils/index';
import Enclosure from '@static/detail/file.png';
import Close from '@static/close.png';
import dayjs from 'dayjs';
import reqPacking from '@utils/reqPacking.js';
import FixedButton from '@components/fixedButton';
import AtSwipeAction from '@components/m5/swipe-action';
import '@components/m5/style/components/swipe-action.scss';
import { noDataPic } from '@utils/imageUrl';
import envConfig from '../../constant/env-config';
import './projectFile.scss';

const { isDockingPerson } = utils;

const { previewFile, rpxTopx, errorHandle } = utils;

export default function ProjectFile(props) {
  const { fileData, show, projectId, fetchProjectFile, judgeRole } = props;

  function handleDelete( data ){
    const { profileId, profileName, editorUserId } = data;
    const { userInfo } = Taro.getStorageSync('authinfo');
    if(judgeRole.role==1 || (judgeRole.role !== 1 && editorUserId === userInfo.id)){
      Taro.showModal({
        title: '提示',
        content: `确定要删除${profileName}吗？`,
        success: function (res) {
          if (res.confirm) {
            reqPacking(
              {
                url: 'api/management/file/delete',
                data:{
                  projectId,
                  profileId
                },
              }, 
              'server'
              )
              .then(resData => {
                const { success, error } = resData;
                if( success ){
                  Taro.showToast({
                    title: '删除成功',
                    icon: 'success',
                    duration: 2000
                  })
                  fetchProjectFile();
                  return;
                }
                errorHandle(error);
              })
              .catch((err) => {
                errorHandle(err);
              });
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }else{
      Taro.showModal({
        title: '提示',
        content: '对不起，您没有删除权限',
        showCancel: false
      })
    }
    
  }


  function addFile(){
    Taro.chooseMessageFile({
      count: 1,
      success (res) {
        const tempFile = res.tempFiles[0];
        const tempFilePath = tempFile.path;
        let tempName = tempFile.name;
        let fileName = tempName;
        // 重新拼扩展名
        let originExtension = tempName.lastIndexOf('.') > -1 ? tempName.slice(tempName.lastIndexOf('.')+1) : '';
        console.log('originExtension', originExtension);
        let pathExtension = tempFilePath.lastIndexOf('.') > -1 ?  tempFilePath.slice(tempFilePath.lastIndexOf('.')+1) : '';
        console.log('pathExtension', pathExtension);
        if(!originExtension && pathExtension){
          fileName = `${tempName}.${pathExtension}`.replace('SERVERID://', '');
        }
        if( originExtension==='temp' && pathExtension  ){
          fileName = tempName.replace(originExtension, pathExtension).replace('SERVERID://', '');
        }

        console.log(tempFile);
        console.log('fileName', fileName);
        if (tempFile.size > 1024 * 1024 * 20) {
          Taro.showModal({
            title: '提示',
            content: '上传的文件应小于20M'
          })
          return false;
        }
        Taro.showLoading({
          title: '上传中'
        });
        Taro.uploadFile({
          url: `${envConfig.server}/api/management/file/upload`,
          filePath: tempFilePath,
          name: 'projectFile',
          header: {
            "Content-Type": "multipart/form-data",
            "token": Taro.getStorageSync('token'),
          },
          formData: {
            projectId: projectId,
            name: fileName
          },
          success (res){
            if(res.statusCode===200){
              const { success, error } = JSON.parse(res.data);
              if (success) {
                Taro.hideLoading();
                Taro.showToast({
                  title: '上传成功',
                  duration: 1000
                });
                fetchProjectFile();
                
                return;
              }
              Taro.hideLoading();
              errorHandle({
                message: error.message || '上传失败'
              });
              return;
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

  return (
    <FloatCard scrollY={false} className="projectFile" onClose={() => props.cancelShow()} isOpened={show}>
      <View className="title">
        <Text>项目文件({fileData.length})</Text>
        <View className="img" onClick={() => props.cancelShow()}>
          <Image src={Close} alt=""></Image>
        </View>
      </View>
      <View className="file-item">
        <ScrollView className="scroll" scrollY>
        {
          fileData.length ===0 || !isDockingPerson(judgeRole.role) ? <View className="noFiles">
            <Image className="img" src={noDataPic}></Image>
            <View className="text">暂无项目文件</View>
          </View> 
          : fileData.map((item, index) => {
            return (
              <AtSwipeAction 
                key={index} 
                options={[
                  { 
                    text: '删除',
                    style: {
                      backgroundColor: '#F1303D',
                      color: '#FFF',
                      fontSize: rpxTopx(30),
                    }
                  }
                ]}
                onClick={ ()=>handleDelete(item) }
              >
                <View className="item" key={index} onClick={() => handleFile(item)}>
                  <Image className="left" src={Enclosure} alt=""></Image>
                  <View className="right">
                    <View className="name">{item.profileName}</View>
                    <View className="describe">
                      <Text>{item.uploader} {dayjs(item.uploadTime).format('YYYY.MM.DD HH:mm')}</Text>
                      <Text style={{marginLeft: '40rpx'}}>{item.profileSize}</Text>
                    </View>
                  </View>
                </View>
              </AtSwipeAction>
            )
          })
        }
        </ScrollView>
      </View>
      {isDockingPerson( judgeRole.role ) && <FixedButton onClick={addFile}>添加文件</FixedButton>}
    </FloatCard>
  )
}

function handleFile(item) {
  const {profileName, url} = item;
  previewFile( url, profileName );
}
