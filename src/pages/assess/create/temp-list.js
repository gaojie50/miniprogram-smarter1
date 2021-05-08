/* eslint-disable jsx-quotes */
import React, { useEffect, useState } from 'react';
import Taro from '@tarojs/taro';
import {
  View,
} from '@tarojs/components';
import Nodata from '@components/noData';




const TempList = function(props) {
  const { tempList, selectTempId, appendQuesList, onPreview, onChangeTemp } = props;
  const [ isFirst, setIsfirst ] = useState(false);

  const handlePreview = (...args) => {
    Taro.setStorageSync('notFirstPrevieTemp', true);
    setIsfirst(false);
    onPreview(...args);
  }
  
  useEffect(()=>{
    const notFirst = Taro.getStorageSync('notFirstPrevieTemp');
    setIsfirst(!notFirst);
  }, []);

  if(tempList.length>0){
    return tempList.map((item, index) => (
      <View className={`template-item ${selectTempId == item.tempId ? 'active' : ''}`} key={item.tempId} onClick={() => { onChangeTemp(item.tempId); }}>
        <View className="template-name">
          {index + 1}、{item.title}
          {selectTempId==item.tempId && appendQuesList.length> 0 && <View className="append-num">（已添加{appendQuesList.length}题）</View>}
        </View>
        <View className="preview-btn" onClick={event => { handlePreview(event, item.tempId, item.title); }}>
          预览
          {isFirst && index === 0 && <View className="tip">可加题</View>}
        </View>
      </View>
    ))
  }else{
    return (
      <View className="no-template-note">
        <Nodata text="暂无模板可选" />
      </View>
    )
  }
};

export default TempList;
