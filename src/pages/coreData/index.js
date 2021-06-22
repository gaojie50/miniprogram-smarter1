import React, { useState, useEffect, useCallback } from 'react'; 
import { View, Image, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro'
import lx from '@analytics/wechat-sdk';
import ArrowLeft from '@static/detail/arrow-left.png';
import BoxOfficeData from './boxOffice/index'
import dayjs from 'dayjs';
import { get as getGlobalData } from '../../global_data';
import DateBar from '@components/dateBar';
import {numberFormat} from './common'
import utils from '@utils/index.js'
// const reqPacking = getGlobalData('reqPacking');
import './index.scss'
import { handleActive } from '@components/m5/calendar/common/plugins';

export default function hotMovieList() {
  const systemInfo = Taro.getSystemInfoSync();
  const { rpxTopx } = utils;
  const capsuleLocation = getGlobalData('capsuleLocation');
  const headerBarHeight = capsuleLocation.bottom + rpxTopx(15);
  const reqPacking = getGlobalData('reqPacking');
  const url = Taro.getCurrentPages();
  const options = url[url.length - 1].options;
  const { name, projectId, cityId = '', cityName } = options;
  const isMovieScreening = (options.isMovieScreening == 'true');
  const [current, setCurrent] = useState(isMovieScreening ? 0 : 3);
  const [boxOffice, setBoxOffice] = useState({});
  const [response, setResponse] = useState({});
  const [cityValue, setCityValue] = useState([]);
  const [showDay, setShowDay] = useState('');
  const [startDateBar, setsStartDateBar] = useState('');
  const [showProgress, setShowProgress] = useState(false);
  const childChangeShowProgress = useCallback((childShowProgress)=>setShowProgress(childShowProgress), []);

  const fetchBoxOfficeValue = (showDate) => {
    reqPacking({
      url:'api/management/finance/various/boxOffice',
      data: { 
        projectId,
        showDate :  Number(showDate || dayjs(new Date()).format('YYYYMMDD')),
      },
      method: 'GET',
    }, ).then(res => {
        const { success, data = {}, error } = res;
        if (success){
          setBoxOffice(data);
        } else {
          Taro.showToast({
            title: error ? error.message : '',
            icon: 'none',
            duration: 2000
          });
        } 
      });
  }
  const fetchIncomeValue = (current, showDate, cityId) => {
    reqPacking({
      url:'api/management/finance/various/income',
      data:{ 
        projectId,
        type: (current + 1),
        showDate: Number(showDate || dayjs(new Date()).format('YYYYMMDD')),
        cityId: Number(cityId) || ''
      },
      method: 'GET',
    }).then(res => {
        const { success, data = {}, error } = res;
        if (success) {
          setResponse(data)
        } else {
          Taro.showToast({
            title: error ? error.message : '',
            icon: 'none',
            duration: 1000
          });
        }
      });
  }
  
  useEffect(()=>{
    if(isMovieScreening) {
      switchTab(0)
    } else {
      switchTab(3)
    }
    fetchBoxOfficeValue();
  }, []);

  useEffect(()=>{
    getCityValue(cityId);
    fetchIncomeValue(current, showDay, cityId);
    fetchIncomeValue(current, showDay, cityId);
  }, [cityId, current, showDay])

  useEffect(()=>{
    fetchBoxOfficeValue(showDay);
  }, [showDay])

  const handleBack = () => {
    if(Taro.getCurrentPages().length>1){
      Taro.navigateBack();
    }else {
      Taro.redirectTo({
        url: `/pages/detail/index?projectId=${projectId}`
      })
    }
  }

  const gotoCityList = () => {
    let params = Taro.getCurrentInstance().router.params;
    Taro.navigateTo({
      url: `/pages/hotMovieSortingList/city/index?name=${params.name}&projectId=${params.projectId}`
    });
  }

  const gotoCheckCity = () => {
    let path = Taro.getCurrentInstance().router.path;
    let params = Taro.getCurrentInstance().router.params;
    let paramsStr = `?name=${name}&projectId=${projectId}&isMovieScreening=${isMovieScreening}&`;
    if (Object.keys(params).length > 0) {
      for (const key of Object.keys(params)) {
        paramsStr += `${key}=${params[key]}&`;
      }
    }
    Taro.redirectTo({
      url: `/pages/checkCity/index?fromUrl=${encodeURIComponent(path + paramsStr)}`
    });
  }

  const switchTab = tab => {
    setCurrent(tab)
  }
  const handleCheckCity = () => {
    if(cityValue.length > 0 && cityValue[0].boxOfficeRate > 10) {
      Taro.showToast({
        title: '城市占比超过10%，无法选择城市',
        icon: 'none',
        duration: 1000
      });
    } else if (cityValue.length == 0 ) {
      Taro.showToast({
        title: '当前暂无占比，无法选择城市',
        icon: 'none',
        duration: 1000
      });
    } else {
      gotoCheckCity();
    }
  }

  const getCityValue = (cityId) => {
    reqPacking({
      url:'api/management/finance/boxOfficeRate/list',
      data:{ 
        cityId,
        showDate : Number(dayjs(new Date()).format('YYYYMMDD')),
        projectId
      },
      method: 'GET',
    }).then(res => {
        const { success, data = {}, error } = res;
        if (success && res.data) {
          setCityValue(res.data);
        } else {
          Taro.showToast({
            title: error ? error.message : '',
            icon: 'none',
            duration: 1000
          });
        }
      });
  }

  const getProjectData = () => {
    reqPacking({
      url: 'api/applet/management/projectDetail',
      data: { projectId: projectId },
      method: 'GET',
    }).then((res) => {
      if(res.success && res.data) {
        setsStartDateBar(res.data.productInfo.releaseDate.endDate);
      }
    })
  }

  useEffect(()=>{
    getProjectData();
    const { userInfo } = Taro.getStorageSync('authinfo') || {};
    lx.pageView('c_movie_b_u55jfr38', {
      custom: {
        user_id: userInfo.keeperUserId,
          project_id: projectId,
          keep_user_id: userInfo.keeperUserId
      }
    });
  }, [])

  
  const callback = (res) => {
    setShowDay(res.replaceAll('-', ''));
  }

  return (
      <View className='core-page'>
        <View className='detail-top-core' style={{ height: `${headerBarHeight}px` }}>
          <View className='top'>
            <View className='header'>
              <View className='backPage' onClick={handleBack}>
                <Image src={ArrowLeft}></Image>
              </View>
              <Text className='header-title'>{name.length > 10 ? `${name.slice(0, 10)}...` : name}</Text>
            </View>
          </View>
        </View>
        <ScrollView scrollY={!showProgress} style={{ height: `${systemInfo.windowHeight - headerBarHeight}px`, marginTop: headerBarHeight}}>
        { isMovieScreening ?
            <View className='core-page-box'>
              <DateBar needButtons callBack={callback.bind(this)} startDateBar={startDateBar} />
              <View className='list-header'>
                <View className='list-header-left' onClick={()=>handleCheckCity()}>
                  {`${cityId ? cityName : '全国'}`}
                  <View className='list-header-img'>
                    <Image src='http://p0.meituan.net/scarlett/40fccb6a0295cf33d8c7737a55883a1f398.png'></Image>
                  </View>
                </View>
                <View className='list-header-right' onClick={()=> gotoCityList()} >
                  {`${cityId ? `票房占比：${cityValue[0] ? cityValue[0].boxOfficeRate : ''}%` :'各地区产生票房及占比'}`}
                  <View className='list-header-img'>
                    <Image src='http://p0.meituan.net/scarlett/82284f5ad86be73bf51bad206bead653595.png'></Image>
                  </View>
                </View>
              </View>
              <View className='box-office'>
                <View className='office'>
                  <View className='office-title'>预测日票房</View>
                  <View className='office-num'>{numberFormat(boxOffice.estimateBoxByDay).num}<Text className='unit'>{numberFormat(boxOffice.estimateBoxByDay).unit}</Text></View>
                </View>
                <View className='office'>
                  <View className='office-title'>预测总票房</View>
                  <View className='office-num'>{numberFormat(boxOffice.estimateBox).num}<Text className='unit'>{numberFormat(boxOffice.estimateBox).unit}</Text></View>
                </View>
                <View className='office'>
                  <View className='office-title'>已产生票房</View>
                  <View className='office-num'>{numberFormat(boxOffice.cumulateBox).num}<Text className='unit'>{numberFormat(boxOffice.cumulateBox).unit}</Text></View>
                </View>
                <View className='office'>
                  <View className='office-title'>未来票房</View>
                  <View className='office-num'>{numberFormat(boxOffice.futureBox).num}<Text className='unit'>{numberFormat(boxOffice.futureBox).unit}</Text></View>
                </View>
              </View> 
            </View> : ''
        }
        { isMovieScreening ? 
          <View className="detail-tabs" >
            <View className="detail-tabs-header" id="tabs" style={{position: 'sticky', top: '-3rpx', zIndex: 0}}>
              <View onClick={()=> switchTab(0)} className={current === 0 ? "detail-tabs-header-item active" : "detail-tabs-header-item"}>未来收入</View>
              <View onClick={()=> switchTab(1)} className={current === 1 ? "detail-tabs-header-item active" : "detail-tabs-header-item"}>已实现收入</View>
              <View onClick={()=> switchTab(2)} className={current === 2 ? "detail-tabs-header-item active" : "detail-tabs-header-item"}>总收入</View>
            </View>
            <View className="detail-tabs-body">
              <View style={{zIndex:'2'}}>
                <BoxOfficeData
                  response={response}
                  current={current}
                  projectId={projectId}
                  isMovieScreening={isMovieScreening}
                  name={name}
                  showDate={Number(showDay || dayjs(new Date()).format('YYYYMMDD'))}
                  childChangeShowProgress={childChangeShowProgress}
                ></BoxOfficeData>
              </View>
            </View>
          </View> :
          <View className='screened-box' style={{zIndex:'2'}}>
            <BoxOfficeData
              response={response}
              current={current}
              isMovieScreening={isMovieScreening}
              projectId={projectId}
              name={name}
              showDate={Number(showDay || dayjs(new Date()).format('YYYYMMDD'))}
              childChangeShowProgress={childChangeShowProgress}
            ></BoxOfficeData>
          </View>
        }
        </ScrollView>
      </View>
  );
}
