import {
    Block,
    View,
    Label,
    Image,
    Input,
    ScrollView,
    Text,
    Picker
  } from '@tarojs/components'
import React from 'react'
import './custom-project.scss';

export function CustomName(props) {
    const { value = '', onChoose = () => { } } = props;
    return (
      <View
        className="custom-project"
        onClick={() => {
          onChoose();
        }}
      >
        <View>
          <Text className="custom-project-name">创建新项目“{value}”</Text>
        </View>
      </View>
    )
  }