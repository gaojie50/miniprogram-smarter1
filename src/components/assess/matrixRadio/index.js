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
    complete: false,
    finished: false,
    matrixSelectList: this.props.matrixRadio.axisY.map(() => -1),
  };


  handleCheck = (index1, index2) => {
    let { finished, matrixSelectList, complete } = this.state;
    let { cb, isPreview } = this.props;
    let obj = {};
    if (isPreview) return;

    matrixSelectList[ index1 ] = parseInt(index2, 10);
    if (matrixSelectList.some(item => item === -1)) {
      finished = false;
    } else {
      finished = true;
      obj.showError = false;
    }
    complete = matrixSelectList.some(item => item !== -1) ? true : false;

    this.setState({
      complete,
      finished,
      matrixSelectList,
    }, () => {
      cb({
        complete,
        finished,
        matrixSelectList,
        ...obj
      });
    });
  };


  render() {
    let {
      id, title, matrixRadio, isPreview, questionNum, required, showError
    } = this.props;
    let { matrixSelectList } = this.state;
    return (
      <View id={id} className={ `matrix-radio ${required ? "required" : ""}` }>
        <View className="ques-title">{questionNum}、{title}</View>
        <View className={`matrix-content ${isPreview ? 'disable': ''}`}>
          <View className="left" id="left">
            <View className="left-item"> </View>
            {
              matrixRadio.axisY.map((item, index) => <View className="left-item" key={ index }>
                <View className="item-text">{ item }</View>
              </View>)
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
                            className={ isPreview ? "item-radio-disable" : `item-radio ${matrixSelectList[index1]===index2 ? 'active': ''}` }
                            key={ `${index1}-${index2}` }
                            onClick={ ()=> { this.handleCheck(index1, index2) } }
                          >
                            <View 
                              className="radio" 
                              name={ itemY } 
                              disabled={ !!isPreview } 
                            />
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