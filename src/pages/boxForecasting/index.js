import { Block, View, Image, Text, ScrollView, Br } from '@tarojs/components'
import React from 'react';
import Taro from '@tarojs/taro';
import TotalBox from '@components/business/totalBox';
import reqPacking from '@utils/reqPacking';
import ReferenceConditions from '@components/business/referenceConditions';
import dayjs from 'dayjs';
import './index.scss';
export default class BoxForecasting extends React.Component {
  state = {
    keyData: {},
    basicData: {},
    formData: {},
    stopScroll: false,
    totalData: {},
    conditionsData: {},
    loading: false,
  }

  componentDidMount() {
    const data = Taro.getStorageSync('acceptDataFromDetail');
    Taro.removeStorageSync('acceptDataFromDetail');

    const { basicData, keyData } = data || {};

    let formData = {
      projectId: basicData?.projectId,
      releaseTime: +dayjs(keyData?.releaseTime?.time),
      cost: keyData.cost ? keyData.cost / 1e4 : undefined,
      wishNum: keyData?.wishNum?.num ? keyData?.wishNum?.num / 1e4 : undefined,
      estimateScore: keyData?.estimateScore?.num,
      ticketExponent: keyData?.estimateBox?.machineEstimateBoxDetail?.ticketExponent,
      director: [],
      directorIds: [],
      mainRole: [],
      mainRoleIds: [],
    };

    (basicData?.director || []).map(({ name, maoyanId }) => {
      formData.director.push(name);
      formData.directorIds.push(maoyanId);
    });

    (basicData?.mainRole || []).map(({ name, maoyanId }) => {
      formData.mainRole.push(name);
      formData.mainRoleIds.push(maoyanId);
    });

    let totalData = keyData?.estimateBox?.machineEstimateBoxDetail || {};
    totalData.dateShow = keyData?.estimateBox?.describe;

    const conditionsData = Object.assign({
      projectId: basicData?.projectId,
    },
      keyData?.estimateBox?.machineEstimateBoxDetail
    );

    this.setState({
      formData,
      ...data,
      totalData,
      conditionsData,
    });
  }


  handleInsteadBox = () => {
    let { conditionsData } = this.state;

    reqPacking({
      url: 'api/management/replacemachineestimatebox',
      method: 'POST',
      data: conditionsData
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
    reqPacking({
      url: 'api/management/submitmachineestimateboxtask',
      method: 'POST',
      data: formData
    }).then(res => {
      const { success, error, data } = res;
      const { estimateNum, boxSectionRatio,model } = data;
      let totalData = {
        estimateNum,
        boxSectionRatio,
        model,
        dateShow: `${dayjs(data.releaseTime).format('YYYY-MM-DD')}更新`,
      };

      const conditionsData = Object.assign(
        { projectId: formData?.projectId },
        data,
      )

      this.setState({
        totalData,
        formData,
        conditionsData,
        loading: false,
      });

      if (success) return;

      Taro.showToast({
        title: error.message,
        icon: 'none',
        duration: 2000
      });

    });
  }

  stopScrollEvt = stopScroll => this.setState({ stopScroll });

  render() {
    const { keyData, basicData, formData, stopScroll, totalData,loading } = this.state;

    return (<View className="bg">
      <ScrollView className="box-forecasting" scrollY={!stopScroll}>
        {
          loading ?
            <View className="loading">
              <Image src="https://s3plus.meituan.net/v1/mss_e2821d7f0cfe4ac1bf9202ecf9590e67/cdn-prod/file:96011a7c/loading.png" />
              <View>数据预测中，请稍等</View>
            </View> :
            (totalData?.estimateNum ?
              <TotalBox
                handleInsteadBox={this.handleInsteadBox}
                totalData={totalData} /> :
              <View className="signCont">
                <Image src="https://s3plus.meituan.net/v1/mss_e2821d7f0cfe4ac1bf9202ecf9590e67/cdn-prod/file:96011a7c/ycpf.svg" />
                <View>
                  <Text>参考条件设定后，您可以立即查看预测结果</Text>
                  <Text>也可以保持预测条件并在项目详情页中持续预测</Text>
                </View>
              </View>)
        }
        <ReferenceConditions
          formData={formData}
          changeFormData={data => this.setState(
            { loading: true },
            () => this.changeFormData(data)
          )}
          stopScrollEvt={this.stopScrollEvt}
          basicData={basicData} />
      </ScrollView>
    </View>)
  }
}