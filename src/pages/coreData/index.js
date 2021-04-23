import React, { useState, useEffect } from 'react'; 
import { View, Image, Text } from '@tarojs/components';
import Taro from '@tarojs/taro'
import ArrowLeft from '@static/detail/arrow-left.png';
import BoxOfficeData from './boxOffice/index'
import DateBar from '@components/dateBar';
import './index.scss'

export default function hotMovieList() {
  const url = Taro.getCurrentPages();
  const name = url[0].options.name;
  const isMovieScreening = url[0].options.isMovieScreening;
  const [current, setCurrent] = useState(0);
  useEffect(()=>{
    console.log(name, isMovieScreening);
  }, [name])
  useEffect(()=>{
    console.log(current);
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
  const handleParam = () => {
    Taro.redirectTo({
      url: `/pages/coreData/realTime/index?paramIndex=1`
    })
  }

  const gotoCityList = () => {
    Taro.redirectTo({
      url: `/pages/hotMovieSortingList/city/index`
    })
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
      { (isMovieScreening === 'true' && current !== 2) ?
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
              <View className='office-num'>169.3<Text className='unit'>万</Text></View>
            </View>
            <View className='office'>
              <View className='office-title'>预测总票房</View>
              <View className='office-num'>7699.9<Text className='unit'>万</Text></View>
            </View>
            <View className='office'>
              <View className='office-title'>已产生票房</View>
              <View className='office-num'>169.3<Text className='unit'>万</Text></View>
            </View>
            <View className='office'>
              <View className='office-title'>未来票房</View>
              <View className='office-num'>8765.4<Text className='unit'>万</Text></View>
            </View>
          </View> 
        </View> : ''
      }
      { isMovieScreening === 'true' ? 
        <View className="detail-tabs" >
          <View className="detail-tabs-header" id="tabs" style={{position: 'sticky', top: '-3rpx', zIndex: 9}}>
            <View onClick={()=> setCurrent(0)} className={current === 0 ? "detail-tabs-header-item active" : "detail-tabs-header-item"}>未来收入</View>
            <View onClick={()=> setCurrent(1)} className={current === 1 ? "detail-tabs-header-item active" : "detail-tabs-header-item"}>已实现收入</View>
            <View onClick={()=> setCurrent(2)} className={current === 2 ? "detail-tabs-header-item active" : "detail-tabs-header-item"}>总收入</View>
          </View>
          <View className="detail-tabs-body">
              <View className={current === 0 ? "body-active" : "body-inactive"}>
                <BoxOfficeData
                  current={current}
                  isMovieScreening={isMovieScreening === 'true'}
                ></BoxOfficeData>
              </View>
              <View className={current === 1 ? "body-active" : "body-inactive"}>
                <BoxOfficeData
                  current={current}
                  isMovieScreening={isMovieScreening === 'true'}
                ></BoxOfficeData>
              </View>
              <View className={current === 2 ? "body-active" : "body-inactive"}>
                <BoxOfficeData
                  current={current}
                  isMovieScreening={isMovieScreening === 'true'}
                ></BoxOfficeData>
              </View>
          </View>
        </View> :
        <View className='screened-box'>
          <BoxOfficeData
            current={current}
            isMovieScreening={isMovieScreening === 'true'}
          ></BoxOfficeData>
        </View>
      }
    </View>
  );
}
