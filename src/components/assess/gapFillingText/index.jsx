import React from 'react';
import { Block, Textarea, View } from '@tarojs/components'
import './index.scss';

export default class GapFillingText extends React.Component {
  state = {
    value: '',
  };

  valueChange = ({ target }) => {
    const { value } = target;
    let obj = { content: value, finished: !!value };

    if (obj.finished) obj.showError = false;

    this.setState({ value }, () => this.props.cb(obj));
  };

  render() {
    const {
      id, required, title, questionNum, isPreview, showError,
    } = this.props;

    return <View id={id} className={ `gapFilling-text ${required ? "required" : ""}` }>
      <View className="ques-title">{questionNum}、{title}</View>
      <Textarea
        value={ this.state.value }
        placeholder={ required ? "请填写" : "非必填" }
        disabled={ isPreview }
        className={ `fill-textarea ${isPreview ? 'preview' : ''}` }
        onChange={ this.valueChange } />
      { required && showError ? <View className="error-tip">请填写</View> : "" }
    </View>;
  }
}