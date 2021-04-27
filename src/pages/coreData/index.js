import React, { useState, useEffect } from 'react'; 
import { View, Image, Text } from '@tarojs/components';
import Taro from '@tarojs/taro'
import ArrowLeft from '@static/detail/arrow-left.png';
import BoxOfficeData from './boxOffice/index'
import { get as getGlobalData } from '../../global_data';
import DateBar from '@components/dateBar';
import {numberFormat} from './common'
// const reqPacking = getGlobalData('reqPacking');
import './index.scss'

export default function hotMovieList() {
  const reqPacking = getGlobalData('reqPacking');
  const url = Taro.getCurrentPages();
  const name = url[0].options.name;
  const projectId = url[0].options.projectId;
  const isMovieScreening = (url[0].options.isMovieScreening == 'true');
  const [current, setCurrent] = useState(1);
  const [boxOffice, setBoxOffice] = useState({});
  const [response, setResponse] = useState({});


  const fetchBoxOfficeValue = () => {
    reqPacking({
      url:'api/management/finance/various/boxOffice',
      data: {projectId},
      method: 'GET',
    }, ).then(res => {
        const { success, data = {}, message } = res;
        console.log('票房数据', res);

        if (success){
          for(let key in data) {
            data[key] = numberFormat(data[key])
          }
          setBoxOffice(data);
        }else {
          Taro.showToast({
            title: message,
            icon: 'none',
            duration: 2000
          });
        } 
      });
  }
  const fetchIncomeValue = (current) => {
    reqPacking({
      url:'api/management/finance/various/income',
      data:{projectId, type: (current + 1)},
      method: 'GET',
    }, 'mapi').then(res => {
        const { success, data = {}, message='' } = res;
        if (success) {
          setResponse(data)
        } else {
          Taro.showToast({
            title: message,
            icon: 'none',
            duration: 1000
          });
        }
      });
  }
  useEffect(()=>{
    fetchBoxOfficeValue();
    
    console.log(name, isMovieScreening, boxOffice);
  }, []);
  
  useEffect(()=>{
    if(isMovieScreening) {
      switchTab(0)
    } else {
      switchTab(3)
    }
  }, [name])

  useEffect(()=>{
    fetchIncomeValue(1);
  }, [current])

  const handleBack = () => {
    if(Taro.getCurrentPages().length>1){
      Taro.navigateBack();
    }else{
      Taro.redirectTo({
        url: `/pages/board/index`
      })
    }
  }

  // const handleParam = () => {
  //   Taro.redirectTo({
  //     url: `/pages/coreData/realTime/index?paramIndex=1`
  //   })
  // }

  // const gotoCityList = () => {
  //   Taro.redirectTo({
  //     url: `/pages/hotMovieSortingList/city/index`
  //   })
  // }

  const switchTab = (current) => {
    setCurrent(current)
    fetchIncomeValue(current);
  }

  return (
    <View>
      <View className='detail-top'>
        <View className='top'>
          <View className='header'>
            <View className='backPage' onClick={handleBack}>
              <Image src={ArrowLeft}></Image>
            </View>
            <Text className='header-title'>{name}</Text>
          </View>
        </View>
        <DateBar />
      </View>
      {/* <DateBar /> */}
      { isMovieScreening ?
        <View>
          {/* <View className='list-header'>
            <View className='list-header-left'>全国</View>
            <View className='list-header-img'>
              <Image src='http://p0.meituan.net/scarlett/40fccb6a0295cf33d8c7737a55883a1f398.png'></Image>
            </View>
            <View className='list-header-right' onClick={()=>{gotoCityList()}} >各地区产生票房及占比</View>
            <Image src='http://p0.meituan.net/scarlett/82284f5ad86be73bf51bad206bead653595.png'></Image>
          </View> */}
          <View className='box-office'>
            <View className='office'>
              <View className='office-title'>预测日票房</View>
              <View className='office-num'>{boxOffice.estimateBoxByDay}<Text className='unit'>万</Text></View>
            </View>
            <View className='office'>
              <View className='office-title'>预测总票房</View>
              <View className='office-num'>{boxOffice.estimateBox}<Text className='unit'>万</Text></View>
            </View>
            <View className='office'>
              <View className='office-title'>已产生票房</View>
              <View className='office-num'>{boxOffice.cumulateBox}<Text className='unit'>万</Text></View>
            </View>
            <View className='office'>
              <View className='office-title'>未来票房</View>
              <View className='office-num'>{boxOffice.futureBox}<Text className='unit'>万</Text></View>
            </View>
          </View> 
        </View> : ''
      }
      { isMovieScreening ? 
        <View className="detail-tabs" >
          <View className="detail-tabs-header" id="tabs" style={{position: 'sticky', top: '-3rpx', zIndex: 9}}>
            <View onClick={()=> switchTab(0)} className={current === 0 ? "detail-tabs-header-item active" : "detail-tabs-header-item"}>未来收入</View>
            <View onClick={()=> switchTab(1)} className={current === 1 ? "detail-tabs-header-item active" : "detail-tabs-header-item"}>已实现收入</View>
            <View onClick={()=> switchTab(2)} className={current === 2 ? "detail-tabs-header-item active" : "detail-tabs-header-item"}>总收入</View>
          </View>
          <View className="detail-tabs-body">
            <View>
              <BoxOfficeData
                response={response}
                current={current}
                projectId={projectId}
                isMovieScreening={isMovieScreening}
                name={name}
              ></BoxOfficeData>
            </View>
          </View>
        </View> :
        <View className='screened-box'>
          <BoxOfficeData
            response={response}
            current={current}
            isMovieScreening={isMovieScreening}
            projectId={projectId}
            name={name}
          ></BoxOfficeData>
        </View>
      }
    </View>
  );
}
