import { View } from '@tarojs/components';
import React, { useState, useEffect } from 'react';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { Radio, MatrixRadio, MatrixScale, GapFillingText, GapFillingNum } from '@components/assess';
import FixedButton from '@components/fixedButton';
import reqPacking from '../../../utils/reqPacking.js'
import utils from '../../../utils/index';
import './index.scss'

const { errorHandle } = utils;

export default function PerviewTemplate(){

  const [ questions, setQuestions ] = useState([]);
  const { tempId } = getCurrentInstance().router.params;

  useEffect(() => {
    fetchTemp(tempId);
  }, []);

  const fetchTemp = value => {
    if (!value){
      return Taro.showModal({title: '提示', content:'缺少tempId', duration:1000});
    } 
    
    Taro.showLoading({
      title: '加载中'
    });
    reqPacking(
      {
        url: '/api/management/tempQuestion',
        data: { tempId },
      },
      'server',
    ).then(res => {
        const { data, error } = res;
        if (!error) {
          const { questions } = data;
          setQuestions(questions);
          Taro.hideLoading();
          errorHandle(error);
          return;
        }
        errorHandle(error);
        Taro.hideLoading();

      }).catch(err=>{
        errorHandle({message: '加载失败'});
        Taro.hideLoading();
      })
  };

  const handleSelect = () =>{
    const { tempId } = Taro.getCurrentInstance().router.params;
    const pages = Taro.getCurrentPages(); // 获取当前的页面栈
    const current = pages[pages.length - 1];
    const eventChannel = current.getOpenerEventChannel();
    eventChannel.emit('selectTempId', tempId);
    Taro.navigateBack();
  }


  return (
    <View className="page-container">
      <View className="template-preview-wrap">
      <View className="">
        {
          questions.map((item,index)=>{
            const { type, required, title, questionNum, gapFilling, radioItems, matrixScale, matrixRadio } = item;

            if (type == 1) {
              return <GapFillingText
                key={ index }
                required={ required }
                title={ title }
                isPreview={ true }
                questionNum={ questionNum }
              />;
            }

            if (type == 2) {
              return <GapFillingNum
                key={ index }
                required={ required }
                isPreview={ true }
                gapFilling={ gapFilling }
                questionNum={ questionNum }
              />;
            }

            if (type == 3) {
              return <MatrixRadio
                key={ index }
                required={ required }
                isPreview={ true }
                title={ title }
                matrixRadio={ matrixRadio }
                questionNum={ questionNum }
              />;
            }

            if (type == 4) {
              return <Radio
                key={ index }
                required={ required }
                isPreview={ true }
                title={ title }
                questionNum={ questionNum }
                radioItems={ radioItems }
              />;
            }

            if (type == 5) {
              return <MatrixScale
                key={ index }
                required={ required }
                isPreview={ true }
                title={ title }
                questionNum={ questionNum }
                matrixScale={ matrixScale || {} }
              />;
            }

          })
        }
      </View>
      <FixedButton 
        className="select-btn" 
        onClick={handleSelect}
      >
          选择该模板
      </FixedButton>
    </View>
    </View>
  )
}