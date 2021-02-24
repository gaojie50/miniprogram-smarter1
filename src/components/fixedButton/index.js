import React from 'react';
import { View, Button } from '@tarojs/components'
import './index.scss';

export default function fixedButton(props){
  const { className, disabled, loading } = props;

  return (
    <View className={`fixed-button-component`}>
      <Button
        disabled={disabled}
        loading={loading}
        className={`btn ${className}`}
        onClick={props.onClick ? props.onClick : ()=>{} }
      >
          {props.children}
      </Button>
    </View>
  )
}