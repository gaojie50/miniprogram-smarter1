import React, { useState, forwardRef, useRef } from 'react';
import Taro from '@tarojs/taro';
import { View, Image, Text, Input, } from '@tarojs/components';
import dayjs from 'dayjs';
import utils from '@utils/index';
import _ReleaseTime from '../../../pages/detail/editProject/component/releaseTime';
import closeIco from '@static/close.png';

const { assignDeep } = utils;
const ReleaseTime = forwardRef(_ReleaseTime);
export default function Conditions({
  controlModal,
  formData,
  basicData,
  changeFormData,
}) {
  if (!formData.projectId) return "";

  const releaseTimeRef = useRef({});
  function handleReleaseDate() {
    setOpenReleaseTime(true);
    controlModal(true);
  };
  const [openReleaseTime, setOpenReleaseTime] = useState(false);
  const [data, setData] = useState(assignDeep(formData));
  const [refresh,setRefresh] = useState(true);
  const {
    releaseTime,
    cost,
    estimateScore,
    wishNum,
    mainRole,
    mainRoleIds,
    director,
    directorIds,
  } = data;
  const [noLimit, setNoLimit] = useState(Boolean(releaseTime && estimateScore));

  function changeInputVal(val, key) {
    data[key] = val;
    setData(data);

    if (key === 'estimateScore') {
      setNoLimit(Boolean(val && releaseTime));
    };
  }

  function startEvt() {
    if (!noLimit) return;

    if (!(/^[0-9]+([.]{1}[0-9]{1}){0,1}$/.test(data.estimateScore))) {
      return Taro.showToast({
        title: '请输入数字，可保留1位小数',
        icon: 'none',
        duration: 2000
      });
    }

    if (+data.estimateScore > 10 || +data.estimateScore < 0) {
      return Taro.showToast({
        title: '分数应在0-10之间',
        icon: 'none',
        duration: 2000
      });
    }

    controlModal(false);
    console.log(data);
    changeFormData(data);
  };

  function updateReleaseTime() {
    const { scheduleType, startDate, endDate } = releaseTimeRef.current;

    data.releaseTime = startDate;
    setData(data);
  }

  function toSearchEvent(sendData, isDirector,) {
    Taro.navigateTo({
      url: '/pages/searchActor/index',
      events: {
        submitData: backData => {
          let ids = [];
          let names = [];

          backData.map(({maoyanId,name}) =>{
            ids.push(maoyanId);
            names.push(name);
          });

          data[isDirector ? 'director' : 'mainRole'] = names;
          data[isDirector ? 'directorIds':'mainRoleIds'] = ids;
          
          setData(data);
          setRefresh(!refresh);
        },
      },
      success: res => {
        let paramData = {};
        let type = isDirector ? 'director' : 'protagonist';

        paramData[type] = sendData.map((item,index) =>{
          return {
            maoyanId:(isDirector ? directorIds : mainRoleIds)[index] ,
            name:item,
          };
        })

        res.eventChannel.emit('acceptDataFromOpenerPage',{ type, data: paramData, });
      }
    })
  }

  return <View className="adding-conditions">
    <View className="main">
      <View className="title">添加预测参考条件
        <View className="close-wrap" onClick={() => controlModal(false)}>
          <Image src={closeIco} />
        </View>
      </View>

      <ConditionsItems
        title="上映日期"
        required={true}
        contType="text"
        value={releaseTime && dayjs(releaseTime).format('YYYY.MM.DD')}
        event={handleReleaseDate}
        arrow={true} />

      <ConditionsItems
        title="制作成本"
        required={false}
        contType="input"
        type='number'
        changeInputVal={val => changeInputVal(val, 'cost')}
        value={cost}
        arrow={false}
        unit="万" />

      <ConditionsItems
        title="猫眼评分"
        required={true}
        contType="input"
        type='digit'
        changeInputVal={val => changeInputVal(val, 'estimateScore')}
        value={estimateScore}
        arrow={false}
        unit="分" />

      <ConditionsItems
        title="猫眼想看人数"
        required={false}
        contType="input"
        type='number'
        changeInputVal={val => changeInputVal(val, 'wishNum')}
        value={wishNum}
        arrow={false}
        unit="万" />

      <ConditionsItems
        title="导演"
        required={false}
        contType="btn"
        value={director}
        event={() => toSearchEvent(director,true,)}
        arrow={true} />

      <ConditionsItems
        title="主演"
        required={false}
        contType="btn"
        value={mainRole}
        event={() => toSearchEvent(mainRole,false, )}
        arrow={true} />
    </View>

    <View className="start-wrap">
      <View
        onClick={startEvt}
        className={`${noLimit ? "" : "gray"} start-btn`}>开始预测</View>
    </View>

    {openReleaseTime ? <ReleaseTime
      ref={releaseTimeRef}
      updateReleaseTime={updateReleaseTime}
      scheduleExist={true}
      updateRef={() => { }}
      movieData={{
        scheduleType: 1,
        startShowDate: releaseTime || +dayjs()
      }}

      onClose={() => {
        setOpenReleaseTime(false);

      }} /> : null}
  </View>
}


function ConditionsItems({
  title,
  required,
  contType,
  value,
  arrow,
  event,
  unit,
  type,
  changeInputVal,
}) {
  return <View
    onClick={event}
    className="conditions-items">

    <View className="name">
      {title}
      {required && <Text className="required">*</Text>}
    </View>

    {contType === 'text' && (
      value ?
        <View className="value"> {value} </View> :
        <View className="placeholder">请选择</View>
    )}

    {contType === 'input' && <Input
      cursor-spacing="15"
      onInput={e => changeInputVal(e.detail.value,)}
      value={value}
      className="input"
      type={type}
      placeholder="请填写" />}
    {contType === 'btn' && <View className="actor" onClick={event}>
      {
        (value || []).length > 0 ?
          value.map(item => <Text className="star">{item}</Text>) :
          <View className="placeholder">请选择</View>
      }
    </View>}
    {arrow && <View className="arrow" />}
    {unit && <View className="unit">{unit}</View>}

  </View>
}
