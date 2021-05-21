import React, { useEffect, useState } from 'react'; 
import { View, Image, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import utils from '@utils/index.js';
import  Calendar from '@components/calendar'
import  AtTag from '@components/m5/tag';
import '@components/m5/style/components/tag.scss';
import NoAccess from '@components/noAccess';
import lx from '@analytics/wechat-sdk';
import ArrowLeft from '@static/detail/arrow-left.png';
import Tab from '@components/tab';
import dayjs from 'dayjs';
import DateBar from '../../../components/dateBar';
import { get as getGlobalData } from '../../../global_data';
import './index.scss'

export default function hotMovieList() {
  const systemInfo = Taro.getSystemInfoSync();
  const {cityId = 0, cityName = '全国' } = getGlobalData('hotMovieSortingListQuery') || {};
  const [scrollLeft, setScrollLeft] = useState(0);
  const [access, setAccess] = useState(true);
  const [showDate, setShowDate] = useState(() => dayjs(new Date()).format('YYYYMMDD'));
  const [ranking, setRanking] = useState([]);
  const [isGetList, setIsGetList] = useState(false);
  const { rpxTopx } = utils;
  const capsuleLocation = getGlobalData('capsuleLocation');
  const headerBarHeight = capsuleLocation.bottom + rpxTopx(15);
  const reqPacking = getGlobalData('reqPacking');
  const signText = ['', '主出', '主发', '联出', '联发', '出品', '发行'];

  const handleBack = () => {
    Taro.switchTab({
      url: '/pages/list/index',
    });
  }

  const getMovieRanking = () => {
    let data = { 
      showDate,
    };
    if (cityId && cityId != 0) {
      data = Object.assign(data, { cityId });
    }
    reqPacking({
      url: 'api/management/finance/hotMovie/incomeScore/list',
      method: 'GET',
      data,
    },).then(res => {
      if (res.success && res.data && res.data.length > 0) {
        setRanking(res.data);
      } else if (res.error && res.error.code === 12110003) {
        setAccess(false);
      } else {
        Taro.showToast({
          title: res.error ? res.error.message : '网络请求出错，请稍后再试',
          icon: 'none',
          duration: 2000
        });
      }
      setIsGetList(true);
    }).catch(err => {
      setIsGetList(true);
    });
  }

  const onSelectDate = (date) => {
    setShowDate(date.replaceAll('-', ''));
  }

  const gotoCheckCity = () => {
    let path = Taro.getCurrentInstance().router.path;
    Taro.redirectTo({
      url: `/pages/checkCity/index?fromUrl=${encodeURIComponent(path)}`
    });
  }

  const gotoCoreDataPage = (name, projectId) => {
    const { userInfo } = Taro.getStorageSync('authinfo') || {};
    lx.moduleClick('movie_b_2usoy2ef', {
      custom: {
        project_id: projectId,
        user_id: userInfo.mis,
        keep_user_id: userInfo.keeperUserId,
      }
    });

    reqPacking({
      url: 'api/management/keyData',
      data: {
        projectId: projectId,
      }
    }).then((res) => {
      const { success, data = {} } = res; 
      if(success) {
        const { afterShowing } = data;
        reqPacking({
          url: 'api/management/judgeRole',
          data: {
            projectId
          }
        }).then(res => {
          const { success, data = {} } = res;
          if (success && data.role === 1) {
            Taro.navigateTo({
              url: `/pages/coreData/index?name=${name}&projectId=${projectId}&isMovieScreening=${!afterShowing}`
            });
          }
        });
      }
    });
  }

  const gotoDetailPage = (projectId) => {
    Taro.navigateTo({
      url: `/pages/detail/index?projectId=${projectId}`,
    });
  }

  const handleScroll = (e) => {
    setScrollLeft(e.detail.scrollLeft);
  }

  useEffect(() => {
    getMovieRanking();
    lx.pageView('c_movie_b_dexmmi8t');
  }, [cityId, showDate]);

  return (
    <View className='hot-movie-page'>
      {/* <Calendar /> */}
      <Tab />
      <View className='detail-top' style={{ height: `${headerBarHeight}px` }}>
        <View className='top'>
          <View className='header'>
            <View className='backPage' onClick={handleBack}>
              <Image src={ArrowLeft}></Image>
            </View>
            <Text className='header-title'>热映影片排序</Text>
          </View>
        </View>
      </View>
      {
        access ? (
          <View style={{ marginTop: `${headerBarHeight}px`}}>
            <DateBar
              isSelectDate={false}
              style={{ position: 'fixed', top: `${Math.floor(headerBarHeight)}px`, zIndex: 8, marginTop: 0, borderRadius: '20px 20px 0 0'}}
              // callBack={onSelectDate.bind(this)}
              // startDateBar='20210106'
            />
            <ScrollView
              scrollY
              className='movie-ranking-list'
              style={{ marginTop: `${Math.floor(headerBarHeight) + rpxTopx(152)}px`, height: `${systemInfo.windowHeight - headerBarHeight - 136}px` }}
            >
              <View className='list-header'>
                <View className='list-header-left' style={{ top: `${Math.floor(headerBarHeight) + rpxTopx(152)}px` }}>
                  <View className='city-name' onClick={gotoCheckCity}>{ cityId ? cityName : '全国' }</View>
                  <View className='list-header-img'>
                    <Image src='http://p0.meituan.net/scarlett/40fccb6a0295cf33d8c7737a55883a1f398.png'></Image>
                  </View>
                </View>
                {
                  isGetList && ranking && ranking.length > 0 && (
                    ranking.map((item, index) => {
                      return(
                        <View className='list-left' key={index} onClick={()=>gotoDetailPage(item.projectId)}>
                          <View className='list-film'>
                            <Image src={item.pic.replace('/w.h/', '/')}></Image>
                            <View className={`film-index index-${index}`} >{index+1}</View>
                          </View>
                          <View className='list-middle'>
                            <View className='list-film-name'>
                              {item.movieName}
                            </View>
                            <View className='list-film-label'>
                              {
                                item.maoyanSign.map((sign) => (
                                  <View className='film-lable' key={sign}>
                                    {signText[sign]}
                                  </View>
                                ))
                              }
                            </View>
                            { item.startDate !== 0  &&<View className='list-film-time'>{item.startDate.toString().replace(/^(\d{4})(\d{2})(\d{2})$/,"$1-$2-$3")}上映</View> }
                          </View>
                        </View>
                      )
                    })
                  )
                }
              </View>
              <View className='list-data-container'>
              <View className='data-header-container' style={{ top: `${Math.floor(headerBarHeight) + rpxTopx(152)}px` }}>
                    <ScrollView className='data-header' scrollX scrollLeft={scrollLeft}>
                      <View className='film-future-income title'>
                        <View className='title-name'>未来收入<View>(万)</View></View>
                      </View>
                      <View className='film-income title'>
                        <View className='title-name'>总收入<View>(万)</View></View>
                      </View>
                      <View className='film-recommend title'>
                      <View className='title-name'>排序指数</View>
                      </View>
                    </ScrollView>
                </View>
                <ScrollView
                  className='list-data'
                  scrollX
                  onScroll={(e) => handleScroll(e)}
                >
                  <View className='data'>
                    {
                      isGetList && ranking && ranking.length > 0 && (
                        ranking.map((item, index) => {
                          return (
                            <View scroll className='data-item' key={index} onClick={()=>gotoCoreDataPage(item.movieName, item.projectId)}>
                              <View className='film-future-income'>{ item.expectFutureIncome === null ? '' : parseFloat(item.expectFutureIncome / 1000000).toFixed(2) }</View>
                              <View className='film-income'>{ item.expectTotalIncome === null ? '' : parseFloat(item.expectTotalIncome / 1000000).toFixed(2) }</View>
                              <View className='film-recommend'>{item.score > 0 ? parseFloat(item.score ? item.score.toFixed(2) : '') : item.score }</View>
                            </View>
                          )
                        })
                      )
                    }
                  </View>
                </ScrollView>
              </View>
            </ScrollView>
            { isGetList && ranking && ranking.length <= 0 && <View className='empty-list'>暂无数据</View> }
          </View>
        ) : (
          <NoAccess title='暂无权限' backgroundColor='#4D5A71' height='100vh' position='absolute' />
        )
      }
    </View>
  );
}
