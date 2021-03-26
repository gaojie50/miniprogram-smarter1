import { Block, View, Image, Text, ScrollView } from '@tarojs/components'
import React from 'react';
import Taro from '@tarojs/taro';
import TotalBox from '@components/business/totalBox';
import reqPacking from '@utils/reqPacking';
import ReferenceConditions from '@components/business/referenceConditions';
import './index.scss';

export default class BoxForecasting extends React.Component {
  state = {
    keyData: {},
    basicData: {},
    formData: {},
    stopScroll:false,
  }

  componentDidMount() {
    const data = Taro.getStorageSync('acceptDataFromDetail');
    Taro.removeStorageSync('acceptDataFromDetail');

    const {basicData} = data||{};

    let formData = {
      projectId:basicData?.projectId,
      ...data?.keyData?.estimateBox?.machineEstimateBoxDetail || {},
    };

    (basicData?.director || []).map(({name,maoyanId}) => {
      formData.director.push(name);
      formData.directorIds.push(maoyanId);
    });

    (basicData?.mainRole || []).map(({name,maoyanId}) => {
      formData.mainRole.push(name);
      formData.mainRoleIds.push(maoyanId);
    });


    this.setState({
      formData,
      ...data,
    });
  }


  handleInsteadBox=() => {
    const { formData } = this.state;

    reqPacking({
      url: '/api/management/replacemachineestimatebox',
      method: 'POST',
      data: formData
    }).then(res => {
      const { success, error, data } = res;

      if (success) {
        return Taro.showToast({
          title: '替换成功',
          icon: 'none',
          duration: 2000
        });
      };

      Taro.showToast({
        title: error.message,
        icon: 'none',
        duration: 2000
      });
    });
  }

  changeFormData = formData => {

  }

  stopScrollEvt = stopScroll => this.setState({stopScroll});

  render() {
    const { keyData,basicData,formData,stopScroll } = this.state;

    return (<View className="bg">
      <ScrollView className="box-forecasting" scrollY={!stopScroll}>

        <TotalBox
          handleInsteadBox={this.handleInsteadBox}
          keyData={keyData} />

        <ReferenceConditions 
          formData={formData}
          changeFormData={this.changeFormData}
          stopScrollEvt={this.stopScrollEvt}
          basicData={basicData} />
      </ScrollView>
    </View>)
  }
}