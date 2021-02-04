import { Block, View } from '@tarojs/components'
import React from 'react'
import PropTypes from 'prop-types';
import './index.scss'

class _C extends React.Component {
  static propTypes = {
    matrixScale: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    isPreview: PropTypes.bool,
    required: PropTypes.bool,
    cb: PropTypes.func
  };

  state = {
    finished: false,
    matrixSelectList: this.props.matrixScale.innerTitle && this.props.matrixScale.innerTitle.map(() => null),
  };

  handleClick = e => {
    let { cb, isPreview } = this.props;
    let { finished, matrixSelectList } = this.state;
    let { index1, index2 } = e.target.dataset;
    let obj = {};

    if (isPreview) return;

    matrixSelectList[ index1 ] = parseInt(index2, 10);
    if (matrixSelectList.some(item => item === null)) {
      finished = false;
    } else {
      finished = true;
      obj.showError = false;
    }
    this.setState({
      finished,
      matrixSelectList,
    }, () => {
      cb({
        finished,
        matrixSelectList,
        ...obj
      });
    });
  };

  render() {
    let {
      id, title, matrixScale, isPreview, required, questionNum, showError
    } = this.props;
    let { matrixSelectList } = this.state;
    return (
      <View id={id} className={ `matrix-scale ${required ? "required" : ""}` }>
        <View className="ques-title">{questionNum}、{title}</View>
        <View className="tips">
          {
            `注：${matrixScale.items.map((item, index) => `${index + 1}分 \\ ${item}`).join("，")}`
          }
        </View>
        {
          (matrixScale.innerTitle || []).map((title1, index1) => {
            return (
              <View className="list" key={ title1 }>
                <View className="title">{ title1 }</View>
                <View className="items">
                  {
                    matrixScale.items.map((item, index2) => {
                      return (
                        <View
                          className={ (isPreview ? 'item-disable' : 'item') + (matrixSelectList[ index1 ] == index2 ? ' active' : '') }
                          key={ `${title1}-${index2}` }
                          data-index1={ index1 }
                          data-index2={ index2 }
                          onClick={ this.handleClick }
                        >
                          { matrixSelectList[ index1 ] == index2 ? item : index2 + 1 }
                        </View>
                      );
                    })
                  }
                </View>
              </View>
            );
          })
        }
        { required && showError ? <View className="error-tip">请选择</View> : "" }
      </View>
    );
  }
}

export default _C
