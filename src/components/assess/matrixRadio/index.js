import { View, Input } from '@tarojs/components';
import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';

export default class MatrixRadio extends React.Component {
  static propTypes = {
    matrixRadio: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    isPreview: PropTypes.bool,
    required: PropTypes.bool,
    cb: PropTypes.func
  };

  state = {
    finished: false,
    matrixSelectList: this.props.matrixRadio.axisY.map(() => null),
  };


  handleViewClick = ({ currentTarget }) => {
    let { finished, matrixSelectList, } = this.state;
    let { cb, isPreview } = this.props;
    let { index1, index2 } = currentTarget.dataset;
    let obj = {};

    if (isPreview) return;

    currentTarget.children[ 0 ].checked = true;

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
      title, matrixRadio, isPreview, questionNum, required, showError
    } = this.props;
    return (
      <View className={ `matrix-radio ${required ? "required" : ""}` }>
        <View className="ques-title">{questionNum}、{title}</View>
        <View className={`content ${isPreview ? 'disable': ''}`}>
          <View className="left" id="left">
            <View className="left-item"> </View>
            {
              matrixRadio.axisY.map((item, index) => <View className="left-item" key={ index }>{ item }</View>)
            }
          </View>
          <View className="right-container" id="right-container">
            <View className="right" >
              <View className="right-item">
                {
                  matrixRadio.axisX.map((item, index) => <View className={ isPreview ? 'item-text disable' : 'item-text' } key={ index }>{ item }</View>)
                }
              </View>
              {
                matrixRadio.axisY.map((itemY, index1) => {
                  return (
                    <View className="right-item" key={ index1 }>
                      {
                        matrixRadio.axisX.map((itemX, index2) => (
                          <View
                            className={ isPreview ? "item-radio-disable" : "item-radio" }
                            key={ `${index1}-${index2}` }
                            data-index1={ index1 }
                            data-index2={ index2 }
                            onClick={ this.handleViewClick }
                          >
                            <View className="radio" name={ itemY } disabled={ !!isPreview } />
                          </View>
                        ))
                      }
                    </View>
                  );
                })
              }
            </View>
          </View>
        </View>
        { required && showError ? <View className="error-tip">请选择</View> : "" }
      </View>
    );
  }
}