/* eslint-disable jsx-quotes */
import React from 'react';
import Taro from '@tarojs/taro';
import {
  View,
} from '@tarojs/components';

import './index.scss';

const OperationBtn = function(props) {
  const { onDelete=()=>{}, onEdit=()=> {}} = props;
  return (
    <View className="operations-component">
      <View className="smarter-iconfont icon-edit" style={{ fontSize: '44rpx' }} onClick={onEdit} />
      <View className="smarter-iconfont icon-delete" style={{ fontSize: '44rpx' }} onClick={onDelete} />
    </View>
  );
};

export default OperationBtn;
