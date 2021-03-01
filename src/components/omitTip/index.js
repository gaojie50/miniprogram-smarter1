import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, Block } from '@tarojs/components';
import Ellipse from '../../static/detail/ellipse.png';
import './index.scss';

export default function OmitTip(props) {

  const { content, tag, placement = 'bottom' } = props;
  const [ omit, setOmit ] = useState(false);
  const [ showTip, setShowTip ] = useState(false);

  const elRef = useRef(null);

  useEffect(() => {
    const len = strlen(content);
    const node = elRef.current;

    if (len > 16) setOmit(true);
  }, [content]);

  return <Block>
    <View className="hidden" id="header" ref={elRef}>{content}</View>
    {
      omit ? <View className="imgWrap" onClick={e => {e.preventDefault();setShowTip(!showTip);}}>
        <Image className="img-ellip" src={Ellipse}></Image>
        {showTip ? <View className="tip">
          <Text>{content}</Text>
          <view className="arrow"></view>
          </View> : null}
      </View> : null
    }
    {showTip ? <View className="backClose" onClick={() => setShowTip(!showTip)}></View> : null}
  </Block>;
}

function strlen(str){  
  if(str === undefined) {
    return
  }
  var len = 0;  
  for (var i=0; i<str.length; i++) {   
   var c = str.charCodeAt(i);   
  //单字节加1   
   if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {   
     len++;   
   }   
   else {   
    len+=2;   
   }   
  }   
  return len;  
}  