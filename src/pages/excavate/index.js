import { View, Image, Text, ScrollView, Label, Input } from '@tarojs/components';
import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import Taro, { useDidShow } from '@tarojs/taro';
import { get as getGlobalData } from '../../global_data';
import ArrowLeft from '@static/detail/arrow-left.png';
import NoData from '@components/noData';
import NoAccess from '@components/noAccess';
import FloatCard from '@components/m5/float-layout';
import '@components/m5/style/components/float-layout.scss';
import utils from '@utils/index.js';
import { fourTextLabel, threeTextLabel, twoTextLabel, defaultMovieCover as DefaultPic } from '@utils/imageUrl';
import { picFn } from '@utils/pic';
import { useFilterPanel } from './filterPanel';
import './index.scss';

const {
  handleNewDate, errorHandle
} = utils

const labelBgMap = {
  2: twoTextLabel,
  3: threeTextLabel,
  4: fourTextLabel
}

const reqPacking = getGlobalData('reqPacking')
const capsuleLocation = getGlobalData('capsuleLocation')

const HEAD_HEIGHT = capsuleLocation.bottom - capsuleLocation.top;
const SYSTEM_BAR_TOP_PADDING = capsuleLocation.top;
const SCROLL_TOP_MARGIN = HEAD_HEIGHT + SYSTEM_BAR_TOP_PADDING;

const FILTER_ITEMS_INIT = () => (
  [
    {
      name: '项目品类',
      type: '1'
    },
    {
      name: '片源地',
      type: '2'
    },
    {
      name: '全部',
      type: '3'
    },
    {
      name: '项目类型',
      type: '4'
    },
  ]
);

const AUTH_ID = 95120;

export default function Excavate() {
  const [hasPagePermission, setHasPagePermission] = useState(false);
  const [noData, setNoData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [offset, setOffset] = useState(0);
  const [havemore, setHavemore] = useState(true);

  useEffect(()=>{
    const authInfo = Taro.getStorageSync('authinfo');
    if(  authInfo &&
      authInfo.authIds &&
      authInfo.authIds.length > 0 &&
      authInfo.authIds.includes(AUTH_ID) &&
      authInfo.authEndTime &&
      authInfo.authEndTime > +new Date() &&
      authInfo.authStartTime &&
      authInfo.authStartTime <= +new Date() 
    ){
      setHasPagePermission(true);
    }
  }, [])

  const {
    Component: ExcavateFilterComponent,
    props: excavateFilterProps,
    params,
    reset,
  } = useExcavateFilter();

  const filterInfo = useMemo(() => {
    const info = {};
    const {
      categoryType,
      sourceType,
      movieType,
      dateSet,
      dtPickerOption,
    } = params;
    setOffset(0);
    setHavemore(true);
    info.offset = 0;
    info.limit = 20;
    const chooseCategory = categoryType.filter((item) => item.active).map((item) =>item.code);
    if (chooseCategory.length) {
      info.category = chooseCategory[0];
    }
    const chooseSource = sourceType.filter((item) => item.active).map((item) =>item.code);
    if (chooseSource.length) {
      info.source = chooseSource[0];
    }
    const chooseTypes = movieType.filter((item) => item.active).map((item) =>item.value);
    if (chooseTypes.length) {
      info.types = chooseTypes.join(',');
    }
    const chooseDate = dateSet.filter((item) => item.checked === 'checked')[0].label;
    if (chooseDate === '全部') {
      return info;
    } else if (chooseDate === '未定档') {
      info.scheduleType = 5;
    } else {
      const {
        customStartDate,
        customEndDate,
      } = dtPickerOption;
      info.startDate = +new Date(+handleNewDate(customStartDate.value)).setHours(0,0,0,0);
      info.endDate = +new Date(+handleNewDate(customEndDate.value)).setHours(23, 59, 59, 999);
    }
    return info
  }, [params]);

  useEffect(() => {
    setLoading(true);
    reqPacking(
      {
        method: 'GET',
        url: 'api/applet/management/deep',
        data: filterInfo,
      },
      'server',
    ).then(res => {
      const { error, data } = res;
      if (!error) {
        const { projectDeepList = [] } = data || {};
        if (projectDeepList.length === 0) {
          setNoData(true);
          setHavemore(false);
        } else {
          setNoData(false);
        }
        setData(projectDeepList);
        setLoading(false);
        return;
      }
      errorHandle(error);
      setData([]);
      setNoData(true);
      setLoading(false);
    })
  }, [filterInfo]);

  const loadMore = useCallback(() => {
    if (!havemore || loading) return;
    setLoading(true);
    reqPacking(
      {
        method: 'GET',
        url: 'api/applet/management/deep',
        data: {
          ...filterInfo,
          offset: offset + 20,
        },
      },
      'server',
    ).then(res => {
      const { error, data } = res;
      if (!error) {
        const { projectDeepList } = data;
        if (projectDeepList.length === 0) {
          setHavemore(false);
        } else {
          setData((v) => [...v, ...projectDeepList]);
          setOffset(v => v + 20);
        }
        setLoading(false);
        return;
      }
      errorHandle(error);
      setLoading(false);
    })
  }, [filterInfo, offset, havemore, loading]);

  return(
    <>
      { !hasPagePermission && <NoAccess titleColor="#333" contentColor="#333" />}
      { hasPagePermission && (
        <ScrollView
          scrollY
          lowerThreshold={5}
          onScrollToLower={loadMore}
          className="excavate"
        >
          <View className="fixed-box">
            <View
              className="search-bar"
              onClick={() => {
                Taro.navigateTo({
                  url: "/pages/searchProject/index?excavate=true",
                });
              }}
            >
              <Label>
                <Image
                  className="searchIco"
                  src='../../static/icon/search.png'
                />
                <Input placeholder="搜索行业电影项目" />
              </Label>
            </View>
            <ExcavateFilterComponent {...excavateFilterProps} />
          </View>
          {noData ? (
            <View>
              <NoData />
            </View>
          ) : (
            <View className="excavate-data-list">
              {data.map((item) => (<ProjectItem key={item.name} {...item} />))}
            </View>
          )}
          {
            loading&&!noData&&(<View><mpLoading show type="circle" /></View>)
          }
        </ScrollView>
      )}
    </>
  )
}

function useExcavateFilter() {

  const [filterActive, setFilterActive] = useState('');
  const [params, setParams] = useState(null);
  const { option, Component: FilterPanel } = useFilterPanel({
    titleHeight: SCROLL_TOP_MARGIN + 20,
    filterActive,
    ongetFilterShow(v) {
      setFilterActive('');
      setParams(v);
    },
  });

  const optionArr = useMemo(() => {
    const arr = FILTER_ITEMS_INIT();

    const hasCategoryType = option.categoryType.find((item) => item.active === true);
    const hasSourceType = option.sourceType.find((item) => item.active === true);
    const dateOption = option.dateSet.find((item) => item.checked === 'checked');
    const hasMovieType = option.movieType.filter((item) => item.active === true);
    if (hasCategoryType) {
      arr[0].changed = true;
      arr[0].name = hasCategoryType.value;
    }
    if (hasSourceType) {
      arr[1].changed = true;
      arr[1].name = hasSourceType.value;
    }
    if (dateOption) {
      arr[2].changed = true;
      arr[2].name = dateOption.label;
    }
    if (hasMovieType.length !== 0) {
      console.log(hasMovieType);
      arr[3].changed = true;
      let name = hasMovieType.map((item) => item.value).join(' ');
      if (name.length > 5) {
        name = name.slice(0,5) + '...';
      }
      arr[3].name = name;
    }

    if (option.filterShow === '1' ) {
      arr[0].active = true;
    }
    if (option.filterShow === '2') {
      arr[1].active = true;
    }
    if (option.filterShow === '3') {
      arr[2].active = true;
    }
    if (option.filterShow === '4') {
      arr[3].active = true;
    }

    return arr;
  }, [option]);

  const props = {
    filterActive,
    setFilterActive,
    panel: <FilterPanel {...option} />,
    tabs: optionArr,
  }


  const defaultParams = useMemo(() => {
    const {
      dtPickerOption,
      dateSet,
      sourceType,
      movieType,
      categoryType,
    } = option;
  
    return {
      dtPickerOption,
      dateSet,
      sourceType,
      movieType,
      categoryType,
    };
  }, []);

  return {
    params: params || defaultParams,
    setFilterActive,
    component: <ExcavateFilter {...props} />,
    Component: ExcavateFilter,
    props,
    reset: option.reset,
  };
}

function ExcavateFilter(props) {
  const { filterActive = '', setFilterActive, tabs = [], panel = null } = props;

  return (
    <View style={{ position: 'relative' }} catchMove>
      <View className="excavate-filter">
        {tabs.map((item, i) => {
          return (
            <View
              key={i}
              className="excavate-filter-item"
              onClick={() => setFilterActive(item.type)}
            >
              <Text className={`excavate-filter-item-name ${(filterActive ? item.active : item.changed)  ? 'excavate-filter-item-active' : ''}`}>{item.name}</Text>
              <Image
                className="excavate-filter-item-img"
                src={item.active ? 'https://p0.meituan.net/ingee/ea15b5df924dfa97a89712fa6f8ce739518.png' : 'https://p0.meituan.net/ingee/818987cccac281bfd0c522339c2a33dd519.png'}
              />
            </View>
          );
        })}
      </View>
      {filterActive && (
        <View
          catchMove
          className="excavate-filter-mask"
          onClick={() => setFilterActive('')}
        />
      )}
      {panel}
    </View>
  );
}

const CATEGORY_TYPE = {
  1: '网络剧',
  2: '电视剧',
  3: '院线电影',
  4: '网络电影',
  5: '综艺',
  0: '其他',
}

function ProjectItem(props) {
  const {
    projectId,
    name,
    category,
    types,
    pic,
    mainProduct,
    releaseDateAndAddress,
    director,
    mainRole,
    movieSource,
    plot,
  } = props;

  const [showMore, setShowMore] = useState(false);

  const showInfo = useMemo(() => {
    const info = [];
    if (types) info.push({ name: '类型:', value: types.join('/') });
    if (mainProduct && mainProduct.length > 0) info.push({ name: '出品:', value: mainProduct.join('/') });
    if (releaseDateAndAddress) info.push({ name: '上映:', value: `${releaseDateAndAddress}上映` });
    if (director && director.length > 0) {
      const n = director.map((item) => item.name);
      info.push({ name: '导演:', value: n.join('/') });
    }
    if (mainRole && mainRole.length > 0) {
      const n = mainRole.map((item) => item.name);
      info.push({ name: '主演:', value: n.join('/') });
    }
    if (movieSource && movieSource.length > 0) info.push({ name: '片源:', value: movieSource.join('/') });

    return info;
  }, [types, mainProduct, releaseDateAndAddress, director, mainRole, movieSource]);

  return (
    <>
      <View 
        className="project-item"
        onClick={(e) => {
          Taro.navigateTo({
            url: `/pages/detail/index?projectId=${projectId}`,
          });
          e.stopPropagation();
        }}
      >
        <View className="project-item-type">
          <View className="project-item-type-name" style={{backgroundImage:`url(${CATEGORY_TYPE[category] ? labelBgMap[CATEGORY_TYPE[category].length]: twoTextLabel })`}}>
            {CATEGORY_TYPE[category] || '-'}
          </View>
        </View>
        <Image className="project-item-img" src={pic ? picFn(pic) : DefaultPic} />
        <View className="project-item-detail">
          <View className="project-item-title">
            <View className="project-item-title-name">{name}</View>
          </View>
          <View className="project-item-info">
            <View className="project-item-info-left">
              {
                showInfo.slice(0,3).map((item) => {
                  return (
                    <View key={item.name} className="info-content">
                      <View className="info-content-name">{item.name}</View>
                      <View className="info-content-value">{item.value}</View>
                    </View>
                  );
                })
              }
            </View>
            <View className="project-item-info-right" onClick={(e) => {setShowMore(true); e.stopPropagation()}}>更多信息&gt;</View>
          </View>
        </View>
      </View>
      <FloatCard className="moreinfo" isOpened={showMore} onClose={() => {setShowMore(false)}}>
        <View className="moreinfo-title">更多信息</View>
        {
          showInfo.map((item) => (
            <View key={item.name} className="moreinfo-content">
              <Text className="moreinfo-content-name">{item.name}</Text>
              <Text className="moreinfo-content-value">{item.value}</Text>
            </View>
          ))
        }
        {
          plot && (
            <View className="moreinfo-content">
              <Text className="moreinfo-content-name">剧情:</Text>
              <Text className="moreinfo-content-value">{plot}</Text>
            </View>
          )
        }
      </FloatCard>
    </>
  )
}
