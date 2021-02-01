import React from 'react';
import { View } from '@tarojs/components'
import './index.scss';

export default class Radio extends React.Component {
  state = {
    selected: '',
  };

  selectChange = ({ currentTarget }) => {
    if (this.props.isPreview) return;

    let selected = Number(currentTarget.dataset.item);
    let obj = { content: selected, finished: true, showError: false };

    this.setState({ selected }, () => this.props.cb(obj));
  };

  render() {
    const {
      required, title, questionNum, radioItems, isPreview, showError
    } = this.props;
    const { selected } = this.state;

    return <View className={ `radio-wrap ${required ? "required" : ""}` }>
      <View className="ques-title">{questionNum}、{title}</View>
      <View className="list-wrap">
        {radioItems.map((item, index) => <View
          key={ index }
          className={ `list-item ${isPreview ? 'preview' : selected === index ? 'active' : ''}` }
          onClick={ this.selectChange }
          data-item={ index }><View className="dot" />
          <View className="text">{item}</View>
        </View>)}
      </View>
      { required && showError ? <View className="error-tip">请选择</View> : "" }
    </View >;
  }
}