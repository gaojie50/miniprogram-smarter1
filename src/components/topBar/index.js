import React from 'react';
import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { get as getGlobalData } from '../../global_data';
import backBlackIcon from '../../static/arrow-left-black.png';
import backWhiteIcon from '../../static/arrow-left-white.png';
import './index.scss';

export default function TopBar(props){
  const {statusBarHeight} = getGlobalData('systemInfo');
  const capsuleLocation = getGlobalData('capsuleLocation');
  const titleHeight= Math.floor(
    capsuleLocation.bottom + capsuleLocation.top - statusBarHeight*2,
  );

  const back = () => {
    props.onBack();
  }


  const { background, color, hasBack, whiteBack, className, paddingBottom, hasBackText } = props;
  const style = {
    paddingTop: `${statusBarHeight}px`,
    paddingBottom: `${paddingBottom}px`,
    height: `${titleHeight+statusBarHeight}px`,
  }
  return (
    <View className="top-bar-component">
      <View className='top-bar-outer'
        style={style}
      >
      </View>
      <View className={`top-bar ${className} top-bar-class`} style={{
        ...style,
        background,
        color,
      }}>
        {
          hasBack &&
          <View className='back' onClick={back}>
            {whiteBack
              ? <Image src={backWhiteIcon} className='back-icon'></Image>
              : <Image src={backBlackIcon} className='back-icon'></Image>}
            { hasBackText && <View className={`back-text ${whiteBack ? 'back-textwhite' : ''}`}>返回首页</View>}
          </View>
        }
        {
          props.children
        }
      </View>
      </View>
  )
}

TopBar.defaultProps = {
  background: '#fff',
  color: '#000',
  whiteBack: false,
  paddingBottom: 0,
  hasBackText: false,
  onBack: () => {},
  className: ''
}