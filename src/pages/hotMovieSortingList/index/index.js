import React, { useEffect, useState } from 'react'; 
import { View, Image, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import utils from '@utils/index.js';
import  Calendar from '@components/calendar'
import  AtTag from '@components/m5/tag';
import '@components/m5/style/components/tag.scss';
import NoAccess from '@components/noAccess';
import ArrowLeft from '@static/detail/arrow-left.png';
import dayjs from 'dayjs';
import DateBar from '../../../components/dateBar';
import { get as getGlobalData } from '../../../global_data';
import Tab from '@components/tab';
import './index.scss'

export default function hotMovieList() {
  const url = Taro.getCurrentPages();
  const options = url[url.length - 1].options;
  const { cityId, cityName } = options;
  const [access, setAccess] = useState(true);
  const [showDate, setShowDate] = useState(() => dayjs(new Date()).format('YYYYMMDD'));
  const [ranking, setRanking] = useState([]);
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
      }
      // setAccess(false);
    })
  }

  const onSelectDate = (date) => {
    setShowDate(date.replaceAll('-', ''));
  }

  const gotoCheckCity = () => {
    let path = Taro.getCurrentInstance().router.path;
    let params = Taro.getCurrentInstance().router.params;
    let paramsStr = '';
    if (Object.keys(params).length > 0) {
      paramsStr += '?';
      for (const key of Object.keys(params)) {
        paramsStr += `${key}=${params[key]}&`;
      }
    }
    // console.log(path + paramsStr.slice(-1));
    Taro.redirectTo({
      url: `/pages/checkCity/index?fromUrl=${encodeURIComponent(path + paramsStr)}`
    });
  }

  const gotoCoreDataPage = (name, projectId) => {
    reqPacking({
      url: 'api/management/keyData',
      data: {
        projectId: projectId,
      }
    }).then((res) => {
      const { afterShowing } = res.data;
      Taro.navigateTo({
        url: `/pages/coreData/index?name=${name}&projectId=${projectId}&isMovieScreening=${afterShowing}`
      });
    });
  }

  useEffect(getMovieRanking, [cityId, showDate]);

  return (
    <View>
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
          <View style={{ marginTop: `${headerBarHeight}px`, marginBottom: '100px', position: 'relative' }}>
            <DateBar callBack={onSelectDate.bind(this)} startDateBar='20210106' />
            <View className='list-header'>
              <View className='list-header-left' onClick={gotoCheckCity}>{ cityId ? cityName : '全国' }</View>
              <View className='list-header-img'>
                <Image src='http://p0.meituan.net/scarlett/40fccb6a0295cf33d8c7737a55883a1f398.png'></Image>
              </View>
              <View className='list-header-right'>排序推荐指数</View>
            </View>
            {
              ranking.map((item, index) => {
                return (
                  <View className='list' key={index} onClick={()=>gotoCoreDataPage(item.movieName, item.projectId)}>
                    <View className='list-left'>
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
                        <View className='list-film-time'>{item.startDate.toString().replace(/^(\d{4})(\d{2})(\d{2})$/,"$1-$2-$3")}上映</View>
                      </View>
                    </View>
                    <View className='film-recommend'>{parseFloat(item.score.toFixed(2))}</View>
                  </View>
                )
              })
            }
          </View>
        ) : (
          <NoAccess title="暂无评估权限" />
        )
      }
    </View>
  );
}
