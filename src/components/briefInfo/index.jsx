import React from 'react';
import { picFn } from '@utils/pic';
import { defaultMovieCover } from '@utils/imageUrl';
import {
  View,
} from '@tarojs/components';
import './index.scss';

const BriefInfo = function(props) {
  const { name, roundNum, pic, text } = props;
  let finalPic = pic ? picFn(pic) : defaultMovieCover;

  return (
    <View className="project-briefinfo-component">
      <View className="left info-wrap">
        <View className="project-img" style={{ backgroundImage: `url(${finalPic})` }}></View>
        <View className="info">
          <View className="project-name">{name}</View>
          <View className="project-text">{text}</View>
        </View>
      </View>
      {roundNum && <View className="right number-text">
        {roundNum < 10 ? `0${roundNum}` : roundNum}
      </View>}
    </View>
  );
};

export default BriefInfo;
