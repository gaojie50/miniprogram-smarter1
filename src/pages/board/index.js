import { View, Image, Text, ScrollView, Label, Input } from '@tarojs/components';
import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import Taro, { useDidShow } from '@tarojs/taro';
import lx from '@analytics/wechat-sdk';
import utils from '@utils/index.js';
import NoData from '@components/noData';
import NoAccess from '@components/noAccess';
import { fourTextLabel, threeTextLabel, twoTextLabel, defaultMovieCover as DefaultPic } from '@utils/imageUrl';
import { picFn } from '@utils/pic';
import Tab from '@components/tab';
import FButton from '@components/m5/fab';
import '@components/m5/style/components/fab.scss';
import { get as getGlobalData } from '../../global_data';
import { useFilterPanel, PROJECT_STAGE_MAPPING } from './filterPanel';
import './index.scss';



const labelBgMap = {
  2: twoTextLabel,
  3: threeTextLabel,
  4: fourTextLabel
}

const {
  rpxTopx,
  formatNumber,
  handleNewDate,
  debounce,
} = utils
const reqPacking = getGlobalData('reqPacking')
const capsuleLocation = getGlobalData('capsuleLocation')

function strip(num, precision = 12) {
  return +parseFloat(num.toPrecision(precision));
}

Taro.setNavigationBarColor({
  frontColor: '#000000',
  backgroundColor: '#ffffff',
})

const SYSTEM_INFO = Taro.getSystemInfoSync();

const bottomBarHeight = SYSTEM_INFO.safeArea.bottom - SYSTEM_INFO.safeArea.height;

const HEAD_HEIGHT = capsuleLocation.bottom - capsuleLocation.top;
const SYSTEM_BAR_TOP_PADDING = capsuleLocation.top;
const SCROLL_TOP_MARGIN = HEAD_HEIGHT + SYSTEM_BAR_TOP_PADDING;
const STICKY_OFFSET = rpxTopx(186);

const BOARD_HEAD_STYLE = {
  height: `${HEAD_HEIGHT + SYSTEM_BAR_TOP_PADDING}px`,
};

const BOARD_HEAD_TITLE_STYLE = {
  paddingTop: `${SYSTEM_BAR_TOP_PADDING}px`,
  height: `${HEAD_HEIGHT}px`,
};

const BOARD_CONTENT_STYLE = {
  paddingTop: `calc(${SCROLL_TOP_MARGIN}px + 20rpx)`,
  height: `calc(100vh - ${SCROLL_TOP_MARGIN}px - 20rpx - 112rpx)`,
  marginBottom: `112rpx`,
};

const FILTER_ITEMS_INIT = () => (
  [
    {
      name: '最近7天',
      type: '4'
    },
    {
      name: '项目类型',
      type: '1'
    },
    {
      name: '合作类型',
      type: '2'
    },
    {
      name: '筛选',
      type: '3'
    },
  ]
);
const FILTER_ITEMS = FILTER_ITEMS_INIT();

const PROJECT_TYPE = [
  {
    name: '新增项目',
    key: 'newProjects'
  },
  {
    name: '其他更新项目',
    key: 'updateProjects'
  },
  {
    name: '以下项目暂无新动态',
    key: 'noChangeProjects'
  },
]

const AUTH_ID = 95120;

export default function Board() {
  const [data, setData] = useState({});
  const [sticky, setSticky] = useState(false);
  const scroller = useRef(null);
  const [noData, setNoData] = useState(false);

  const [member, setMember] = useState([]);
  const [department, setDepartment] = useState([]);
  const [permission, setPermission] = useState(2);
  const [hasPagePermission, setHasPagePermission] = useState(false);


  useDidShow(() => {
    const { userInfo } = Taro.getStorageSync('authinfo');
    lx.pageView('c_movie_b_u8nui5w0', {
      custom: {
        user_id: userInfo.keeperUserId,
      }
    });
  })
  
  
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


  const filterPanelProps = useMemo(() => {
    return {
      permission,
      member,
      department,
    }
  }, [permission, member, department])

  const {
    tabSelected,
    tabSelected_ref, // the value comes from React.Ref
    Component: StatusTab,
    props: tabOriginProps,
    dataCache,
    setData: setTabData,
  } = useStatusTab();
  const {
    Component: BoardFilterComponent,
    props: boardFilterProps,
    params,
    reset,
  } = useBoardFilter({
    filterPanelPropsMixIn: filterPanelProps,
  });

  const hidden7Add = useMemo(() => {
    let val = false;

    if (boardFilterProps.tabs[0] && boardFilterProps.tabs[0].name !== '最近7天') {
      return true;
    }


    for (let i = 1; i < boardFilterProps.tabs.length; i += 1) {
      if (boardFilterProps.tabs[i].changed === true) {
        return true;
      }
    }
    return val;
  }, [boardFilterProps.tabs])

  const tabProps = useMemo(() => {
    const cp = JSON.parse(JSON.stringify(tabOriginProps.list));
    const found = cp.find((item) => item.p1 === tabSelected.name);
    if (hidden7Add) {
      found.p5 = '';
    }
    tabOriginProps.list = cp;
    return {...tabOriginProps}
  }, [hidden7Add, tabSelected, tabOriginProps])


  useEffect(() => {
    Taro.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
    })

    PureReq_Permission().then((d1) => {
      setPermission(d1);
      if (d1 !== 2) {
        PureReq_OrgTree().then((data) => {
          if (data.orgTreeRespList) {
            setDepartment(data.orgTreeRespList.reduce((acc, { groupName, groupId, orgTreeRespList }) => {
              acc.push({
                value: groupId,
                label: groupName
              });
  
              if (orgTreeRespList && orgTreeRespList.length > 0) {
                const secondLevel = orgTreeRespList.map(item => {
                  return {
                    value: item.groupId,
                    label: item.groupName
                  };
                });
  
                acc = acc.concat(secondLevel);
              }
  
              return acc;
            }, []));
          }

          if (data.groupId != 2) member = data.orgUserRespList;

          const flatten = arr => {
            return arr.reduce((acc, next) => {
              if (next.orgUserRespList && next.orgUserRespList.length > 0) acc = acc.concat(next.orgUserRespList);
              if (next.orgTreeRespList && next.orgTreeRespList.length > 0) acc = acc.concat(flatten(next.orgTreeRespList));

              return acc;
            }, member);
          };

          setMember(flatten(data.orgTreeRespList)
            // .filter(item => item.keeperUserId != window.userData.keeperUserId)
            .map(item => {
              return {
                label: item.realName ? item.realName : item.mis,
                value: item.userId,
              };
            }));
        })
      }
    })
  }, [])

  const { filterActive } = boardFilterProps;

  const tab = <StatusTab {...tabProps} type="default" />;
  const filter = <BoardFilterComponent {...boardFilterProps} />;
  const tab_sticky = <StatusTab {...tabProps} type="small" />;
  const filter_sticky = <BoardFilterComponent {...boardFilterProps} />;

  useEffect(() => {
    const { cooperStatus } = tabSelected;
    const { cooperStatus: last_cooperStatus } = tabSelected_ref.current;

    const isClickTab = cooperStatus !== last_cooperStatus;
    const currentParams = isClickTab ? reset(true) : params;
    tabSelected_ref.current = tabSelected;

    const {
      dateSet,

      projectType,
      cooperateType,
      projectStage,
      movieLocation,
      jobType,

      member = [],
      department = [],
    } = currentParams;

    let startDate, endDate;

    const foundDate = dateSet.find((item) => item.checked === 'checked');
    if (foundDate) {
      if (foundDate.label === '自定义') {
        const {
          customStartDate,
          customEndDate,
        } = currentParams.dtPickerOption;
        startDate = +new Date(+handleNewDate(customStartDate.value)).setHours(0,0,0,0);
        endDate = +new Date(+handleNewDate(customEndDate.value)).setHours(23, 59, 59, 999);
      } else {
        const { startDate: sd, endDate: ed } = foundDate.value();
        startDate = sd;
        endDate = ed;
      }
    }

    let projectStageLocalFilter;
    projectStage.forEach((item) => {
      if (item.active) {
        if (!projectStageLocalFilter) projectStageLocalFilter = {};
        projectStageLocalFilter[item.code] = true;
      }
    });

    setData({});
    PureReq_ListInfo({
      projectType: projectType.filter((item) => item.active).map((item) =>item.code),
      cooperStatus,
      startDate,
      endDate,
      cooperateType: cooperateType.filter((item) => item.active).map((item) =>item.code),
      movieLocation: movieLocation.filter((item) => item.active).map((item) =>item.code),
      jobType: jobType.filter((item) => item.active).map((item) =>item.code),
      member: member.filter((item) => item.active).map((item) =>item.code),
      department: department.filter((item) => item.active).map((item) =>item.code),
    }).then((d) => {
      let { 
        newProjects = [],
        noChangeProjects = [],
        updateProjects = [],
      } = d || {};

      if (projectStageLocalFilter) {
        if (newProjects) newProjects = newProjects.filter((item) => item.projectStageStep.some((val) => projectStageLocalFilter[val.projectStage]));
        // if (noChangeProjects) noChangeProjects = noChangeProjects.filter((item) => item.projectStageStep.some((val) => projectStageLocalFilter[val.projectStage]));
        if (updateProjects) updateProjects = updateProjects.filter((item) => item.projectStageStep.some((val) => projectStageLocalFilter[val.projectStage]));
      }

      const nlength = newProjects.length + noChangeProjects.length + updateProjects.length;

      if (!isClickTab) {
        setTabData((v) => {
          const { name } = tabSelected;
          const found = v.find((item) => item.p1 === name);
          if (found) found.p2 = nlength;
          return [...v];
        });
      } else {
        setTabData(JSON.parse(JSON.stringify(dataCache.current)))
      }

      if (nlength === 0) {
        setNoData(true);
      } else {
        setNoData(false);
      }

      setTimeout(() => {
        setData({
          newProjects,
          noChangeProjects,
          updateProjects,
          projectNum: nlength,
        })
      }, 0)

    });
  }, [tabSelected, params])


  useEffect(() => {
    setTimeout(() => {
      scroller.current = Taro.createSelectorQuery().select('#board-list-scroll')
    }, 0)
  }, [])

  useEffect(() => {
    if (filterActive) {
      setSticky(true);
    } else {
      if (scroller.current) {
        scroller.current.scrollOffset((res) => {
          const { scrollTop } = res;
          if (scrollTop > STICKY_OFFSET) {
            setSticky(true)
          } else {
            setSticky(false)
          }
        }).exec();
      }
    }
  }, [filterActive])

  const checkIfStickyImmediately = useCallback((t) => {
    if (t > STICKY_OFFSET) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  }, []);

  const checkIfStickAfterAll = useCallback(debounce(() => {
    scroller.current.scrollOffset((res) => {
      const { scrollTop } = res;
      if (scrollTop > STICKY_OFFSET) {
        setSticky(true)
      } else {
        setSticky(false)
      }
    }).exec();
  }, 0), [])

  const jumpDig = () => {
    const { userInfo } = Taro.getStorageSync('authinfo');
    lx.moduleClick('b_movie_b_pk9ptbhe_mc', {
      custom: {
        user_id: userInfo.id,
        keeper_user_id: userInfo.keeperUserId
      }
    }, { cid: 'c_movie_b_u8nui5w0'})
    
    Taro.navigateTo({
      url: '/pages/excavate/index',
    });
  }

  return (
    <>
      <Tab />
      <View className="board-header">
        <View
          style={BOARD_HEAD_STYLE}
        >
          <View
            className="board-header-title"
            style={BOARD_HEAD_TITLE_STYLE}
          >
            {hasPagePermission && <Image
              className='board-header-search'
              src='https://obj.pipi.cn/festatic/common/image/983789fd24e8d39069daa427331b8d05.png'
              onClick={jumpDig}
            />}
            <Text className='board-header-text' onClick={jumpDig}
            >
              挖掘新项目
            </Text>
            <Text className="board-header-title-text">项目看板</Text>
          </View>
        </View>
      </View>
      { !hasPagePermission && <NoAccess titleColor="#333" contentColor="#333" />}
      { hasPagePermission && (
        <ScrollView
          id="board-list-scroll"
          className="board"
          scrollY
          style={BOARD_CONTENT_STYLE}
          onScroll={(e) => {
            checkIfStickyImmediately(e.detail.scrollTop);
            checkIfStickAfterAll();
          }}
        >
          <View className='board-search-box'>
            <View className='board-search-bar'>
              <Label onClick={() => Taro.navigateTo({url: '/pages/searchProject/index'})}>
                <Image
                  className='board-searchIco'
                  src='../../static/icon/search.png'
                ></Image> 
                <Input placeholder='搜索项目' disabled></Input>
            </Label>
            </View>
          </View>

          <View
            style={{
              opacity: sticky ? "0" : "initial",
            }}
          >
            {tab}
            {filter}
          </View>
          <View
            style={{
              position: "fixed",
              top: `${HEAD_HEIGHT + SYSTEM_BAR_TOP_PADDING}px`,
              width: "100%",
              zIndex: 4,
              backgroundColor: "#fff",
              visibility: sticky ? "visible" : "hidden",
              boxShadow: '0px 20rpx 20rpx -20rpx rgba(0,0,0,0.08)'
            }}
          >
            {tab_sticky}
            {filter_sticky}
          </View>
          {noData ? (
            <View>
              <NoData />
            </View>
          ) : (
            <View>
              {PROJECT_TYPE.map(({ name, key }, idx_1) => {
                if (!data?.[key]?.length > 0) return null;
                const arr = data?.[key] || [];
                return (
                  <View>
                    <View className="project-add-text">
                      <Text>{`${name} ${arr.length}个`}</Text>
                    </View>
                    {arr.map((obj, i) => {
                      if (obj?.projectStageStep?.length > 0) {
                        obj.hasUpdate = true;
                      }
                      if (
                        idx_1 === PROJECT_TYPE.length - 1 &&
                        i === arr.length - 1
                      ) {
                        obj.style = {
                          paddingBottom: `${bottomBarHeight}px`
                        };
                      }
                      return <ProjectItem {...obj} />;
                    })}
                  </View>
                );
              })}
            </View>
          )}
          <View
            className="board-float-button"
            style={{ bottom: `calc(${112 + 30 + 'rpx'} + ${bottomBarHeight}px)` }}
          >
            <FButton
              onClick={() => {
                Taro.navigateTo({
                  url: "/pages/addProject/index",
                });
              }}
            >
              <Image
                className="board-float-button-image"
                src="https://p0.meituan.net/ingee/8d49c7b5fd67f053cb60b0bbf296d0a8588.png"
              />
            </FButton>
          </View>
        </ScrollView>
      )}
    </>
  );
}

const NAME_MAPPING_ARR = [
  {
    name: '确定合作',
    cooperStatus: 1,
    key: 'ensureCooperate'
  },
  {
    name: '接触中',
    cooperStatus: 0,
    key: 'inContact'
  },
  {
    name: '合作暂停',
    cooperStatus: 3,
    key: 'suspendCooperate'
  },
  {
    name: '正常完结',
    cooperStatus: 2,
    key: 'normalEnd'
  },
  {
    name: '合作取消',
    cooperStatus: 4,
    key: 'cancelCooperate'
  },
];

const DEFAULT_ARR = NAME_MAPPING_ARR.map(({ name }) => {
  return {
    p1: name,
  }
});

function useStatusTab() {
  const [active, setActive] = useState(0);
  const activeCache = useRef(NAME_MAPPING_ARR[active]);
  const [data, setData] = useState(DEFAULT_ARR);
  const dataCache = useRef(DEFAULT_ARR);
  const [type, setType] = useState('default');

  useEffect(() => {
    PureReq_Cooperation().then((data) => {
      const arr = NAME_MAPPING_ARR.map(({ name, key }) => {
        return {
          p1: name,
          p2: data[key]?.value || '',
          p3: data[key]?.value ? '部' : '-',
          p4: data[key]?.add ? '近7日' : '',
          p5: data[key]?.add ? `+${data[key].add}` : '',
        }
      })
      setData(arr);
      dataCache.current = JSON.parse(JSON.stringify(arr));
    });
  }, [])

  const props = {
    list: data,
    active,
    onClick: (i) => setActive((v) => {
      activeCache.current = NAME_MAPPING_ARR[v];
      return i;
    }),
    type,
  }

  return {
    component: (
      <NiceTab {...props}/>
    ),
    Component: NiceTab,
    props,
    tabSelected: NAME_MAPPING_ARR[active],
    tabSelected_ref: activeCache,
    setType,
    setData,
    dataCache
  };
}


const CLASSNAME_BOARD = {
  default: 'board-tab-item',
  small: 'board-tab-item-small'
}
function NiceTab(props) {
  const { list = [], active, onClick, type = 'small' } = props;

  return (
    <View className={`board-tab ${type === 'small' ? 'board-tab-small' : ''}`}>
      {list.map((item, i) => {
        const {p1 = '-', p2 = '-', p3 = '部', p4 = '近7日', p5 = ''} = item;
        const className = `
          ${CLASSNAME_BOARD[type]}
          ${
            i === 0
              ? `${CLASSNAME_BOARD[type]}-head`
              : i + 1 === list.length
              ? `${CLASSNAME_BOARD[type]}-tail`
              : ''
          }
          ${active === i ? `${CLASSNAME_BOARD[type]}-active` : ''}
        `;
        return (
          <View
            key={item}
            className={className}
            key={item}
            onClick={() => {
              if (onClick instanceof Function) onClick(i);
            }}
          >
            <View className={`${CLASSNAME_BOARD[type]}-p1`}>{p1}</View>
            {type === 'default' && (
              <>
                <View className="board-tab-item-p2">
                  <Text>{p2}</Text>
                  <Text className="board-tab-item-p3">{p3}</Text>
                </View>
                <View className="board-tab-item-p4">
                  <View>{p5 ? p4 : ''}</View>
                  <View
                    className={`${
                      active === i
                        ? 'board-tab-item-p5-active'
                        : 'board-tab-item-p5'
                    }`}
                  >
                    {p5}
                  </View>
                </View>
              </>
            )}
          </View>
        );
      })}
    </View>
  );
}

function useBoardFilter(config = {}) {
  const {
    filterPanelPropsMixIn = {},
  } = config

  const [filterActive, setFilterActive] = useState('');
  const [params, setParams] = useState(null);
  const { option, Component: FilterPanel } = useFilterPanel({
    titleHeight: SCROLL_TOP_MARGIN + 20,
    filterActive,
    filterPanelPropsMixIn,
    ongetFilterShow(v) {
      setFilterActive('');
      setParams(v);
    },
  });

  const optionArr = useMemo(() => {
    const arr = FILTER_ITEMS_INIT();

    const dateOption = option.dateSet.find((item) => item.checked === 'checked');
    const hasProjectType = option.projectType.find((item) => item.active === true);
    const hasCooperType = option.cooperateType.find((item) => item.active === true);
    const has1 = option.projectStage.find((item) => item.active === true);
    const has2 = option.jobType.find((item) => item.active === true);
    const has3 = option.movieLocation.find((item) => item.active === true);
    const has4 = option.member.find((item, i) => i !== 0 && item.active === true);
    const has5 = option.department.find((item, i) => i !== 0 && item.active === true);

    if (dateOption) {
      arr[0].changed = true;
      arr[0].name = dateOption.label;
    }
    if (hasProjectType) {
      arr[1].changed = true;
    }
    if (hasCooperType) {
      arr[2].changed = true;
    }
    if (has1 || has2 || has3 || has4 || has5) {
      arr[3].changed = true;
    }

    if (option.filterShow === '4' ) {
      arr[0].active = true;
    }
    if (option.filterShow === '1') {
      arr[1].active = true;
    }
    if (option.filterShow === '2') {
      arr[2].active = true;
    }
    if (option.filterShow === '3') {
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
      cooperateType,
      jobType,
      movieLocation,
      projectType,
      projectStage,
    } = option;
  
    return {
      dtPickerOption,
      dateSet,
      cooperateType,
      jobType,
      movieLocation,
      projectType,
      projectStage,
    };
  }, []);

  return {
    params: params || defaultParams,
    setFilterActive,
    component: <BoardFilter {...props} />,
    Component: BoardFilter,
    props,
    reset: option.reset,
  };
}

function BoardFilter(props) {
  const { filterActive = '', setFilterActive, tabs = [], panel = null } = props;

  return (
    <View style={{ position: 'relative' }} catchMove>
      <View className="board-filter">
        {tabs.map((item, i) => {
          return (
            <View
              className="board-filter-item"
              onClick={() => setFilterActive(item.type)}
            >
              <Text className={`board-filter-item-name ${(filterActive ? item.active : item.changed)  ? 'board-filter-item-active' : ''}`}>{item.name}</Text>
              <Image
                className="board-filter-item-img"
                src={item.active ? 'https://p0.meituan.net/ingee/ea15b5df924dfa97a89712fa6f8ce739518.png' : 'https://p0.meituan.net/ingee/818987cccac281bfd0c522339c2a33dd519.png'}
              />
            </View>
          );
        })}
      </View>
      {filterActive && (
        <View
          catchMove
          className="board-filter-mask"
          onClick={() => setFilterActive('')}
        />
      )}
      {panel}
    </View>
  );
}

const OBJECT_TYPE = {
  1: '网络剧',
  2: '电视剧',
  3: '院线电影',
  4: '网络电影',
  5: '综艺',
  0: '其他',
}

function jumpDetail(projectId){
  Taro.navigateTo({
    url: `/pages/detail/index?projectId=${projectId}`,
  })
}

function ProjectItem(props) {
  const {
    type,
    name = '-',
    pic,
    cooperType = [],
    releaseDate,
    box,
    estimateBox,
    estimateScore,
    scheduleType,
    score,
    projectStageStep = [],
    hasUpdate = false,
    projectId,
    releaseStage,
    style,
  } = props;

  const [val, unit] = useMemo(() => {
    const rsl = formatNumber(estimateBox || box, 'floor');
    return [rsl.num, rsl.unit];
  }, [estimateBox, box]);

  const [stageName, stageDescribe, stageLength] = useMemo(() => {
    if (projectStageStep.length === 0) return [];
    const { projectStage, describe = '' }  = projectStageStep[projectStageStep.length - 1];
    return [`[${PROJECT_STAGE_MAPPING[projectStage]}]`, describe, projectStageStep.length]
  }, [projectStageStep])

  const formattedDate = useMemo(() => {
    return releaseDate.replace(/[^\d-~]/g, '');
  }, [releaseDate])

  return (
    <View className="project-item" style={style} onClick={ ()=>{jumpDetail(projectId)} }>
      <View className="project-item-type">
        <View className="project-item-type-name" style={{backgroundImage:`url(${OBJECT_TYPE[type] ? labelBgMap[OBJECT_TYPE[type].length]: twoTextLabel })`}}>
          {OBJECT_TYPE[type] || '-'}
        </View>
      </View>
      <Image className=".project-item-img" src={pic ? picFn(pic) : DefaultPic} />
      <View className="project-item-detail">
        <View className="project-item-title">
          <View className="project-item-title-name">{name}</View>
          {
            type === 3 ? (
              <View className="project-item-title-predict">
                { releaseStage === 1 || box === null || box === undefined ? '预估' : '累计'}
                <Text className="project-item-title-predict-num">{val}</Text>
                {unit}
              </View>
            ) : (
              <View className="project-item-title-predict-yellow">
                评估
                <Text className="project-item-title-predict-num">{score || '-'}</Text>
                分
              </View>
            )
          }
        </View>
        <View className="project-item-ps">
          <View className="project-item-ps-cooperType">
            {cooperType.join(' / ')}
          </View>
          {
            type === 3 && (
              releaseStage === 2 && score !== null && score !== undefined ? (
                score ? <View className="project-item-score">猫眼{score}分</View> : null
              ) : (
                <View className="project-item-score">预估{estimateScore || '-'}分</View>
              )
            )
          }
        </View>
        <View className="project-item-date">
          <Text>{formattedDate}</Text>
          <SchedulerTag type={scheduleType}/>
        </View>
        <View className="project-item-status">
          <View className="project-item-status-text">
            {hasUpdate && (
              <Text className="project-item-status-text-status">
                {stageName}&nbsp;
              </Text>
            )}
            {hasUpdate ? stageDescribe : <Text className="project-item-status-text-no-update">本周暂无更新</Text>}
          </View>
          {hasUpdate && (
            <View className="project-item-status-btn">
              <View>{stageLength}</View>
              <Image
                className="project-item-status-btn-dropdown"
                src="../../static/icon/arrow-down.svg"
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const SCHEDULER = {
  1: {
    label: '已定档',
    bgColor: 'rgba(20,204,20,0.10)',
    color: '#14CC14',
  },
  2: {
    label: '非常确定',
    bgColor: 'rgba(241,48,61,0.10)',
    color: '#F1303D',
  },
  3: {
    label: '可能',
    bgColor: 'rgba(253,156,0,0.10)',
    color: '#FD9C00',
  },
  4: {
    label: '内部建议',
    bgColor: 'rgba(20,204,20,0.10)',
    color: '#14CC14',
  },
  5: {
    label: '待定',
    bgColor: 'rgba(51,51,51,0.10)',
    color: '#333333',
  },
}
function SchedulerTag(props) {
  const { type,  } = props;
  if (!type) return null;
  const { label, bgColor, color } = SCHEDULER[type];
  return <Text className="scheduler-tag" style={{ color, backgroundColor: bgColor  }}>{label}</Text>
}

function onHandleResponse(res, type = 'arr') {
  const { success, data, error } = res;
  if (success) return data;
  if (type === 'arr') return [];
  if (type === 'obj') return {};
  return [];
}

function PureReq_ListInfo(params = {}) {
  Taro.addInterceptor(interceptor);
  const {
    projectType,
    startDate,
    endDate,
    cooperStatus = 0,
    cooperateType = [],
    movieLocation = [],
    jobType = [],
    member = [],
    department = [],
  } = params;
  return reqPacking(
    {
      method: 'GET',
      url: 'api/management/lisInfo',
      data: {
        startDate: startDate || 1611072000000,
        endDate: endDate || 1611676799999,
        type: projectType,
        cooperStatus,
        cooperType: cooperateType,
        movieSource: movieLocation,
        participation: jobType,
        members: member,
        department: department,
      }
    },
    'server',
  ).then((res) => onHandleResponse(res, 'obj'))
}

function PureReq_Cooperation(params) {
  return reqPacking(
    {
      url: 'api/management/stateCooperation',
    },
    'server',
  ).then((res) => onHandleResponse(res))
}

function PureReq_Permission(params) {
  return reqPacking(
    {
      url: 'api/management/userPermissions',
    },
    'server',
  ).then((res) => onHandleResponse(res))
}

function PureReq_OrgTree() {
  return reqPacking(
    {
      url: 'api/management/org/queryorgtree',
      data: {
        leaderFilter: true
      }
    },
    'server',
  ).then((res) => onHandleResponse(res))
}

const interceptor = function (chain) {
  const requestParams = chain.requestParams;
  const { method, data, url } = requestParams;

  if (method === 'GET'){
    if (data){
      let str = '';
      Object.keys(data).forEach((key) => {
        const val = data[key];
        if (val instanceof Array) {
          val.forEach((item) => {
            str += `${key}=${item}&`
          })
        } else {
          str += `${key}=${val}&`
        }
      })
      str = str.replace(/&$/, '');
      requestParams.url = requestParams.url + '?' + str;
      requestParams.data = undefined;
    }
  }
 
  return chain.proceed(requestParams)
      .then(res => {
        return res
      })
};