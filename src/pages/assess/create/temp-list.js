/* eslint-disable jsx-quotes */
import React, { useEffect, useState } from 'react';
import Taro from '@tarojs/taro';
import {
  View,
} from '@tarojs/components';
import Nodata from '@components/noData';




const TempList = function(props) {
  const { tempList, selectTempId, appendMap, onPreview, onChangeTemp } = props;
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
    return tempList.map((item, index) => {
      const appendQuesList = appendMap[item.id] || [];
      return (
        <View className={`template-item ${selectTempId == item.id ? 'active' : ''}`} key={item.id} onClick={() => { onChangeTemp(item.id); }}>
          <View className="template-name">
            {index + 1}、{item.name}
            {appendQuesList.length> 0 && <View className="append-num">（已添加{appendQuesList.length}题）</View>}
          </View>
          <View className="preview-btn" onClick={event => { handlePreview(event, item.id, item.name); }}>
            预览
            {isFirst && index === 0 && <View className="tip">可加题</View>}
          </View>
        </View>
      )
    })
  }else{
    return (
      <View className="no-template-note">
        <Nodata text="暂无模板可选" />
      </View>
    )
  }
};

export default TempList;
