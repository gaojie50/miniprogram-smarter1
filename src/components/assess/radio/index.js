import React from 'react';
import { View } from '@tarojs/components'
import Title from '../title'
import './index.scss';

export default class Radio extends React.Component {
  state = {
    selected: Number(this.props.defaultValue) || '',
  };

  selectChange = ({ currentTarget }) => {
    if (this.props.isPreview) return;

    let selected = Number(currentTarget.dataset.item);
    let obj = { content: selected, finished: true, showError: false, complete: true };

    this.setState({ selected }, () => this.props.cb(obj));
  };

  render() {
    const {
      id, required, radioItems, isPreview, showError,
    } = this.props;
    const { selected } = this.state;

    return <View id={id} className={`radio-wrap ${required ? "required" : ""}`}>
      <Title {...this.props} />
      <View className='list-wrap'>
        {radioItems.map((item, index) => <View
          key={index}
          className={`list-item ${isPreview ? 'preview' : selected === index ? 'active' : ''}`}
          onClick={this.selectChange}
          data-item={index}
        ><View className='dot' />
          <View className='text'>{item}</View>
        </View>)}
      </View>
      { required && showError ? <View className='error-tip'>请选择</View> : "" }
    </View >;
  }
}