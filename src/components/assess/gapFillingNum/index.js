import { View, Input } from '@tarojs/components'
import React from 'react';
import './index.scss';

export default class GapFillingNum extends React.Component {
  state = {
    value: '',
  };

  valueChange = ({ target }) => {
    const { limit } = this.props.gapFilling;
    let innerValue = target.value.trim();
    let value = '';

    if (limit == 1) {
      // 数字 10以内 保留一位小数
      value = innerValue.replace(/^\D*(10|\d{0,1}(?:\.\d{0,1})?).*$/g, '$1');
    }

    if (limit == 2) {
      // 数字 保留2位小数
      value = innerValue.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1');
    }

    let obj = { content: value, finished: !!value };

    if (obj.finished) obj.showError = false;

    this.setState({ value }, () => this.props.cb(obj));
  };

  render() {
    const {
      required, gapFilling, questionNum, isPreview, showError
    } = this.props;
    const { leftText, rightText } = gapFilling;

    return <View className={ `gapFilling-num ${required ? "required" : ""}` }>
      <View className="ques-title">{questionNum}、{leftText}</View>
      <Input
        placeholder="请填写"
        value={ this.state.value }
        disabled={ isPreview }
        className={ `num-input ${isPreview ? 'preview' : ''} ` }
        onChange={ this.valueChange } />
      {rightText}
      { required && showError ? <View className="error-tip">请填写</View> : "" }
    </View>;
  }
}
