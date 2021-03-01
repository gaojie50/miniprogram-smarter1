import React from 'react';
import Taro from '@tarojs/taro';
import {
  View,
  Image,
} from '@tarojs/components';
import './index.scss';

const copyMail = () => {
  Taro.setClipboardData({
    data: 'zhiduoxing@maoyan.com',
  })
}

const noAccess = function(props){
  const { title, content, showEmailBtn=true, titleColor="white", contentColor="white" } = props;
  return (
    <View className='no-access-component'>
      <Image src="../../../static/list/no-access.png"></Image>
      <View className="title" style={{color: titleColor}}>{title || '暂无权限查看相关数据'}</View>
      <View className="content" style={{color: contentColor}}>
        {content || '申请开通请联系zhiduoxing@maoyan.com'}
      </View>
      { showEmailBtn && <View className="btn" onClick={copyMail}>
        复制邮箱
      </View> }
    </View>
  )
}

export default noAccess;