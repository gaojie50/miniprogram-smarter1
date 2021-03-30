import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, ScrollView, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import FloatCard from '@components/m5/float-layout';
import { CooperStatus } from './constant';
import BottomSubmit from '@components/bottomSubmit';
import AtActionSheet from '@components/m5/action-sheet';
import AtActionSheetItem from '@components/m5/action-sheet/body/item';
import '@components/m5/style/components/action-sheet.scss';
import AtModal from '@components/m5/modal';
import AtModalContent from '@components/m5/modal/content';
import '@components/m5/style/components/modal.scss';
import Crown from '@static/detail/crown.png';
import MainPeople from '@static/detail/mainPeople.png';
import CooperPeople from '@static/detail/cooperPeople.png';
import { set as setGlobalData, get as getGlobalData } from '../../global_data';
import Close from '@static/close.png';
import './people.scss';

const reqPacking = getGlobalData('reqPacking');
export default function People(props) {
  const { peopleData, judgeRole, show, fetchPeople } = props;
  const { userInfo } = Taro.getStorageSync('authinfo');

  const [openSheet, setOpenSheet] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [itemInfo, setItemInfo] = useState({});
  const [inputValue, setInputValue] = useState('');

  const addPeople = () => {
    Taro.navigateTo({
      url: `/pages/detail/addPeople/index?projectId=${peopleData[0].projectId}`,
    })
  }

  const closeSheet = useCallback(() => {
    setOpenSheet(false);
    fetchPeople();
  }, [])

  const nameSubmit = useCallback(() => {
    const { projectId, id } = itemInfo;
    if(inputValue === '') {
      Taro.showToast({
        title: '请输入备注名！',
        icon: 'none'
      })
    } else {
      reqPacking({
        url: '/api/management/user/edit',
        data: {
          id,
          projectId,
          userDesc: inputValue
        },
        method: 'POST'
      })
      .then(res => {
        const { success, error } = res;
        if (success) {
          closeSheet();
          setOpenModal(false);
          setInputValue('');
        } else {
          Taro.showToast({
            title: error.message,
            icon: 'none'
          })
        }
      })
    }
  }, [inputValue])
  
  return (
    <View>
      <FloatCard className="people" onClose={() => props.cancelShow()} isOpened={show}>
        <View className="title">
          <Text>对接人({peopleData.length})</Text>
          <View className="img" onClick={() => props.cancelShow()}>
            <Image src={Close} alt=""></Image>
          </View>
        </View>
        <View className="people-item">
        <ScrollView className="scroll" scrollY>
          {
            peopleData.map((item, index) => {
              return  <View className="item" key={index}>
              <Image className={item.role === 1 ? "item-left crown" : "item-left"} src={item.role === 1 ? MainPeople : CooperPeople} alt=""></Image>
              <View className="item-right">
                <View className="name">{item.userName || item.userMis }</View>
                <View className="describe">{item.userDesc}</View>
              </View>
              {
                judgeRole.role !== 1 && item.userId !== userInfo.id ? null 
                : <View className="last" onClick={() => {setOpenSheet(true);setItemInfo(item)}}>
                    <Image src="../../static/detail/company-edit.png" alt=""></Image>
                  </View>
              }
            </View>
            })
          }
          </ScrollView>
          
          <AtModal
            isOpened={openModal}
            className="nameModal"
          >
            <AtModalContent>
              <View className="name-title">
                <Text>设置备注名</Text>
                <View className="right-image" onClick={() => setOpenModal(false)}>
                  <Image src={Close} alt=""></Image>
                </View>
              </View>
              {openModal && <Input value={inputValue} onInput={e => setInputValue(e.detail.value)} placeholder={openModal ? "请填写角色名称，最多10个字" : ''} maxlength="10" className="name-input"></Input>}
              <View className="name-confirm" onClick={() => nameSubmit()}>确定</View>
            </AtModalContent>
          </AtModal>
          {judgeRole.role === 2 ? null : <BottomSubmit name="添加对接人" onClick={addPeople} />}
        </View>
      </FloatCard>
      <AtActionSheet isOpened={openSheet} cancelText='取消' onCancel={() => setOpenSheet(false)} onClose={() => setOpenSheet(false)}>
        {
          judgeRole.role === 1 && itemInfo.role === 0 && itemInfo.userId !== userInfo.id ?
          <AtActionSheetItem onClick={() => handlePeopleOption(itemInfo, 'setMajor', closeSheet)}>设为负责人</AtActionSheetItem> : null
        }
        {
          judgeRole.role === 1 && itemInfo.role === 1 ?
          <AtActionSheetItem onClick={() => handlePeopleOption(itemInfo, 'cancelMajor', closeSheet)}>取消负责人</AtActionSheetItem> : null
        }
          <AtActionSheetItem onClick={() => {setOpenSheet(false);setOpenModal(true)}}>设置备注名</AtActionSheetItem>
        {
          (judgeRole.role === 1 && itemInfo.userId !== userInfo.id) || (judgeRole.role === 0 && itemInfo.userId === userInfo.id) ?
          <AtActionSheetItem onClick={() => handlePeopleOption(itemInfo, 'moveOut', closeSheet)}>移出该项目</AtActionSheetItem> : null
        }
        {
          judgeRole.role === 1 && itemInfo.userId === userInfo.id ?
          <AtActionSheetItem onClick={() => handlePeopleOption(itemInfo, 'dropOut', closeSheet)}>退出该项目</AtActionSheetItem> : null
        }
      </AtActionSheet>
    </View>
  )
}

function handlePeopleOption(itemInfo, param, closeSheet) {
  const { projectId, id } = itemInfo;
  if (param === 'setMajor' || param === 'cancelMajor') {
    Taro.showModal({
      title: '提示',
      content: param === 'setMajor' ? '确认设置为负责人吗？' : '确认取消负责人吗？',
      success: res => {
        if(res.confirm) {
          reqPacking({
            url: '/api/management/user/edit',
            data: {
              id,
              projectId,
              role: param === 'setMajor' ? 1 : 0
            },
            method: 'POST'
          })
          .then(res => {
            const { success, error } = res;
            if (success) {
              closeSheet()
            } else {
              Taro.showToast({
                title: error.message,
                icon: 'none'
              })
            }
          });
        }
      }
    })
  }

  if (param === 'moveOut' || param === 'dropOut') {
    Taro.showModal({
      title: '提示',
      content: param === 'moveOut' ? '确认把该用户移出项目吗？' : '确认要退出项目吗？',
      success: res => {
        if(res.confirm) {
          reqPacking({
            url: '/api/management/user/delete',
            data: {
              id,
              projectId,
            }
          })
          .then(res => {
            const { success, error } = res;
            if (success) {
              closeSheet()
            } else {
              Taro.showToast({
                title: error.message,
                icon: 'none'
              })
            }
          });
        }
      }
    })
  }
}