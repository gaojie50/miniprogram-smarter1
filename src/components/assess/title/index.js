import React from 'react';
import { View } from '@tarojs/components'
import OptionBtn from '../operationBtn';
import './index.scss';

const Title = props => {
    const {
      title, questionNum, isAdditional, onEdit, onDelete
    } = props;

    return (
      <View className='ques-title-wrap'>
        <View className='ques-title'>{questionNum}、{title}</View>
        {isAdditional && (
          <OptionBtn
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
      </View>
    );
}

export default Title;