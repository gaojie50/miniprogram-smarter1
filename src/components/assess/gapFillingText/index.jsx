/* eslint-disable jsx-quotes */
import React from 'react';
import { Textarea, View } from '@tarojs/components'
import Title from '../title'
import './index.scss';

export default class GapFillingText extends React.Component {
  state = {
    value: this.props.defaultValue || '',
  };

  valueChange = ({ target }) => {
    const { value } = target;
    let obj = { content: value, finished: !!value, complete: !!value };

    if (obj.finished) obj.showError = false;
    this.setState({ value }, () => this.props.cb(obj));
  };

  render() {
    const {
      id, required, isPreview, showError,
    } = this.props;

    return <View id={id} className={`gapFilling-text ${required ? "required" : ""}`}>
      <Title {...this.props} />
      <Textarea
        value={this.state.value}
        placeholder={required ? "请填写" : "非必填"}
        disabled={isPreview}
        className={`fill-textarea ${isPreview ? 'preview' : ''}`}
        onInput={this.valueChange}
      />
      { required && showError ? <View className="error-tip">请填写</View> : "" }
    </View>;
  }
}