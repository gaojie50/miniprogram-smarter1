import { View, Button, Input, Textarea, Text, Block, ScrollView } from '@tarojs/components'
import React, { useState, useEffect } from 'react';
import Taro, { getCurrentInstance } from '@tarojs/taro'
import reqPacking from '../../../utils/reqPacking.js'
import { Radio, MatrixRadio, MatrixScale, GapFillingText } from '../../../components/assess';
import utils from '../../../utils/index';
import './index.scss'

const { errorHandle } = utils;

export default function PerviewTemplate(){

  const [ questions, setQuestions ] = useState([]);
  const [ btnDisabled, setBtnDisabled ] = useState(true)
  const tempId = 10;

  useEffect(() => {
    Taro.showLoading();
    fetchTemp(tempId);
  }, []);

  const fetchTemp = value => {
    if (!value) return;

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
        setBtnDisabled(true);
      }).catch(err=>{
        errorHandle({message: '加载失败'});
        Taro.hideLoading();
        setBtnDisabled(true);
      })
  };

  const handleSelect = () =>{
    const { tempId } = Taro.getCurrentInstance().router.params;
    Taro.setStorageSync('tempId', tempId);
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
      {!btnDisabled && <View className="btn-wrap">
        <Button 
          className="select-btn" 
          onClick={handleSelect}
          disabled={btnDisabled}
        >
            选择该模板
        </Button>
      </View>}
    </View>
    </View>
  )
}