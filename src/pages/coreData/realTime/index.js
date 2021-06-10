import React, { useState, useEffect, useCallback } from 'react'; 
import { View, Image, Text, ScrollView, Input } from '@tarojs/components';
import Taro from '@tarojs/taro'
import lx from '@analytics/wechat-sdk';
import ArrowLeft from '@static/detail/arrow-left.png';
import '@components/m5/style/components/input.scss';
import './index.scss'
import BoxCalculate from '../boxCalculate';
import BonusCalculate from '../bonusCalculate';
import { numberFormat, centChangeTenThousand, numberFormatCent } from '../common'
import { get as getGlobalData } from '../../../global_data';
import { REALTIME_DATA_LISTS as listsInfo } from '../constant';

export default function realTime({}) {
  const reqPacking = getGlobalData('reqPacking');
  const incomeName = ['', '总发行代理费', '猫眼发行代理费', '主创分红']
  const paramTitle = ['合同参数', '实时参数', '假定条件']
  const requestUrls = [
    '',
    'api/management/finance/realTimeData/get',
    'api/management/finance/defaultParameter/get',
  ]
  const url = Taro.getCurrentPages();
  const paramIndex = url[url.length-1].options.paramIndex;
  const projectId = Number(url[url.length-1].options.projectId);
  const name = url[url.length-1].options.name;
  const isMovieScreening = url[url.length-1].options.isMovieScreening;
  const showDate = url[url.length-1].options.showDate;
  const [showProgress, setShowProgress] = useState(false);
  const [officeIncomeIndex, setOfficeIncomeIndex] = useState();
  const [lists, setLists] = useState(listsInfo[paramIndex]);
  const [isSubmit, setIsSubmit] = useState(false);
  const [calculate, setCalculate] =useState('');
  const [valueData, setValueData] = useState(0);
  const [clickIndex, setClickIndex] = useState('');
  const [isBonusCalculate, setIsBonusCalculate] = useState(false)
  const [getValue, setGetValue] =useState('');
  const changeCalculate = useCallback((calculateValue)=>setCalculate(calculateValue), []);
  const childChangeShowProgress = useCallback((childShowProgress)=>setShowProgress(childShowProgress),[]);
  const isChangeCalculate =  useCallback((isChangeCalculate) => {console.log(123, isChangeCalculate)}, [])

  const handleBack = () => {
    // Taro.redirectTo({
    //   url: `/pages/coreData/index?name=${name}&projectId=${projectId}&isMovieScreening=${isMovieScreening}`,
    // })
    if(Taro.getCurrentPages().length>1){
      Taro.navigateBack();
    }else{
      Taro.redirectTo({
        url: `/pages/coreData/index?name=${name}&projectId=${projectId}&isMovieScreening=${isMovieScreening}`,
      })
    }
  }

  const changeShowProgress =(index)=> {
    setOfficeIncomeIndex(index);
    setShowProgress(true);
  }

  const ChangeValue = (e, index) => {
    const val = e.detail.value;
    var newList = lists.concat();
    newList[index].money = val;
    setLists(newList);
    judgeIsSubmit();
  }

  const judgeIsSubmit = (hasToast) => {
    // for(let i = 0; i<11; i++) {
    //   if(i != 1 && i != 2 && i != 3) {
    //     if(lists[i].money === ''){
    //       hasToast && Taro.showToast({
    //         title: `请填写${lists[i].title}`,
    //         icon: 'none',
    //         duration: 2000,
    //       });
    //       setIsSubmit(false);
    //       return;
    //     } 
    //   }
    // }
    for(let i = 0; i<15; i++) {
      if(lists[i].money){
        // if(i!=6) {
        //   let judge = lists[i].money.toString().split(".");
        //   if((judge[0] && judge[0].length > 10) || (judge[1] && judge[1].length > 6)){
        //     hasToast && Taro.showToast({
        //       title: `小数点${lists[i].title}`,
        //       icon: 'none',
        //       duration: 2000,
        //     });
        //     setIsSubmit(false);
        //     return;
        //   }
        // }else{
        if((Number(lists[i].money)< 0 || Number(lists[i].money)>100) && (lists[i].unit === '%') ){
          hasToast && Taro.showToast({
            title: `${lists[i].title}填写0~100数值`,
            icon: 'none',
            duration: 2000,
          });
          setIsSubmit(false);
          return;
        }
        // }
      }
    }
    setIsSubmit(true);
  }

  const bottomSubmit = () => {
    judgeIsSubmit('hasToast');
    if(isSubmit) {
      const { userInfo } = Taro.getStorageSync('authinfo') || {};
      lx.moduleClick('movie_b_ynjn6dpx', {
        custom: {
          user_id: userInfo.keeperUserId,
          project_id: projectId,
          keep_user_id: userInfo.keeperUserId
        }
      }, { cid: 'c_movie_b_28xvqisf'});
      postDataValue();
    }
  }

  const postDataValue = () => {
    const data = getValue || {};
    for(let item of lists) {
      if(item.dataIndex !== 'myShare'){
        data[item.dataIndex] = centChangeTenThousand(item.money);
      } else {
        data[item.dataIndex] = item.money;
      }
    }
    reqPacking({
      url: 'api/management/finance/contractData/saveOrUpdate',
      data:{
        ...data,
        projectId,
      },
      method: 'POST',
    })
    .then(res => {
      const { success, error } = res;
      if(success) {
        Taro.showToast({
          title: '提交成功',
          icon: 'none',
          duration: 2000,
        });
      setTimeout(()=> handleBack(), 500);
      }else {
        Taro.showToast({
          title: error && error.message || '',
          icon: 'none',
          duration: 2000,
        });
      }
    })
  }

  const getValueData = () => {
    reqPacking({
      url: requestUrls[paramIndex],
      data: {
        projectId,
        showDate: paramIndex==1 ? Number(showDate) : ''
      }
    }).then(res => {
      const { success, error } = res;
      if (success) {
        const { data } = res;
        setValueData(data);
      } else {
        Taro.showToast({
          title: error && error.message || '',
          icon: 'none',
          duration: 2000,
        });
      }
    })
  }

  // 合同参数数据请求
  useEffect(()=>{
    if (paramIndex === '0') {
      getContractData();
      const { userInfo } = Taro.getStorageSync('authinfo') || {};
      lx.pageView('c_movie_b_28xvqisf', {
        custom: {
          user_id: userInfo.keeperUserId,
            project_id: projectId,
            keep_user_id: userInfo.keeperUserId
        }
      });
    }else{
      getValueData();
    }
  }, []);
    // 合同参数数据请求
  useEffect(()=>{
    if (paramIndex === '0' && !showProgress) {
      getContractData('1');
    }
  }, [showProgress, calculate]);

  // 实时参数 & 假定参数tab 数据请求 
  // useEffect(()=>{
  //   if (paramIndex !== '0') {
      
  //   }
  // }, []);


  const getContractData = (AgencyFee) => {
    reqPacking({
      url:`api/management/finance/contractData/get`,
      data: {
        projectId,
      }
    }).then(res => {
      const { success, error } = res;
      if (success) {
        const { data } = res;
        let newData = Object.assign('', data);
        setGetValue(res.data);
        for(let key in newData) {
          if(key!=='myShare') {
            newData[key] = numberFormatCent(newData[key])
          }
        }
        if(AgencyFee) {
          lists[1].money = newData['distributionAgencyFee'] === undefined ? '' : newData['distributionAgencyFee']
          lists[2].money = newData['myDistributionAgencyFee'] === undefined ? '' :newData['myDistributionAgencyFee']
        } else{
          for(let key in lists) {
            lists[key].money = newData[lists[key].dataIndex] === undefined ? '' : newData[lists[key].dataIndex];
          }
        }
        setValueData(newData);
        setLists(lists);
        judgeIsSubmit();
      } else {
        Taro.showToast({
          title: error && error.message || '',
          icon: 'none',
          duration: 2000,
        });
      }
    })
  }

  return (
    <View className='detail-page'>
      <View className='detail-top'>
        <View className='top'>
          <View className='header'>
            <View className='backPage' onClick={handleBack}>
              <Image src={ArrowLeft}></Image>
            </View>
            <Text className='header-title'>{paramTitle[paramIndex]}</Text>
          </View>
        </View>
      </View>
      <ScrollView className={`${paramIndex=='0' ? 'detail-con' : 'detail'}`} scrollY>
        {lists.map((list, index)=>{
          return(
            (paramIndex !== '0' ?
                <View className='param-list-rel' key={index}>
                  <View className='param-left'>
                    <View className='param-title-rel'>{list.title}</View>
                    <View className='param-remarks'>{list.remarks}</View>
                  </View>
                  <View className='param-money-rel'>
                    { list.unit ?
                    `${valueData[list.dataIndex] == undefined ? '-' : valueData[list.dataIndex]}${list.unit}` 
                    : `${numberFormat(valueData[list.dataIndex]).num}${numberFormat(valueData[list.dataIndex]).unit}`
                    }
                  </View>
                </View>
                :
                <View className='param-list-rel' key={index}>
                  <View className='param-left'>
                    <View className='param-title-rel'>{list.title}</View>
                    <View className='param-remarks'>{list.remarks}</View>
                  </View>
                  {list.toCalculate ? 
                    <View className='param-to' onClick={()=>{changeShowProgress(index)}}>
                      <View>
                        {list.money!=='' ? <View className='param-money-rel' style={{fontFamily:'PingFangSC-Regular'}} >{list.money}万</View> 
                        : <View className='param-header-right'>{list.toCalculate}</View>}
                      </View>
                      <Image src='http://p0.meituan.net/scarlett/82284f5ad86be73bf51bad206bead653595.png' />
                    </View> 
                    :
                    <View className='param-money-rel'><Input  style={{fontFamily:'MaoYanHeiTi-H1'}} type='digit' placeholder='请输入' value={list.money} onInput={(e)=>{ChangeValue(e, index)}} />
                    <Text className='unit'>{list.unit}</Text></View>
                  }
                </View>
            )
          )
        })}
      </ScrollView>
      {
        paramIndex == '0' ?
        <View className='bottom-box' onClick={()=>{bottomSubmit()}}>
          <View className='button' style={{opacity: `${isSubmit ? '1 !important':''}`}}>提交</View>
        </View> : ''
      }
        {
          officeIncomeIndex == 3 ? 
          <BonusCalculate
            closeEvt={() => setShowProgress(false)}
            calculateIndex={officeIncomeIndex}
            incomeName={incomeName[officeIncomeIndex]}
            calculate={calculate}
            changeCalculate={changeCalculate}
            showProgress={showProgress}
            childChangeShowProgress={childChangeShowProgress}
            projectId={projectId}
            paramIndex={paramIndex}
          ></BonusCalculate>
          : 
          <BoxCalculate
            closeEvt={() => setShowProgress(false)}
            calculateIndex={officeIncomeIndex}
            isBonusCalculate={false}
            incomeName={incomeName[officeIncomeIndex]}
            calculate={calculate}
            changeCalculate={changeCalculate}
            showProgress={showProgress}
            childChangeShowProgress={childChangeShowProgress}
            projectId={projectId}
            paramIndex={paramIndex}
          ></BoxCalculate>
        }
    </View>
  )
}