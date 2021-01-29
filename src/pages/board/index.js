import { Block, View, Image, Text, ScrollView } from '@tarojs/components'
import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react'
import Taro from '@tarojs/taro'
import utils from '../../utils/index.js'
import { picFn } from '../../utils/pic';
import projectConfig from '../../constant/project-config.js'
import { set as setGlobalData, get as getGlobalData } from '../../global_data'
import Filter from './filterPanel';


import './index.scss'
const { getMaoyanSignLabel } = projectConfig

const {
  rpxTopx,
  formatNumber,
  formatDirector,
  getFutureTimePeriod,
  handleReleaseDesc,
  handleNewDate,
  formatWeekDate,
} = utils

const reqPacking = getGlobalData('reqPacking')
const capsuleLocation = getGlobalData('capsuleLocation')
const barHeight = getGlobalData('barHeight')

function strip(num, precision = 12) {
  return +parseFloat(num.toPrecision(precision));
}

Taro.setNavigationBarColor({
  frontColor: '#000000',
  backgroundColor: '#ffffff',
})

const HEAD_HEIGHT = capsuleLocation.bottom - capsuleLocation.top;
const SYSTEM_BAR_HEIGHT = capsuleLocation.top;
const SCROLL_TOP_MARGIN = HEAD_HEIGHT + SYSTEM_BAR_HEIGHT;

const FILTER_ITEMS = [
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
];

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


export default function Board() {
  const [data, setData] = useState({});
  const [sticky, setSticky] = useState(false);
  const scroller = useRef(null);

  const {
    tabSelected,
    Component: StatusTab,
    props: tabProps,
  } = useStatusTab();
  const {
    Component: BoardFilterComponent,
    props: boardFilterProps,
  } = useBoardFilter();

  const { filterActive } = boardFilterProps;

  const tab = <StatusTab {...tabProps} type="default" />;
  const filter = <BoardFilterComponent {...boardFilterProps} />;
  const tab_sticky = <StatusTab {...tabProps} type="small" />;
  const filter_sticky = <BoardFilterComponent {...boardFilterProps} />;

  useEffect(() => {
    const { cooperStatus } = tabSelected;
    PureReq_ListInfo({
      cooperStatus,
    }).then((d) => {
      setData(d);
    });
  }, [tabSelected])

  useEffect(() => {
    setTimeout(() => {
      scroller.current = Taro.createSelectorQuery().select('#board-list-scroll')
    }, 200)
  }, [])

  useEffect(() => {
    if (filterActive) {
      setSticky(true);
    } else {
      if (scroller.current) {
        scroller.current.scrollOffset((res) => {
          const { scrollTop } = res;
          if (scrollTop > 150) {
            setSticky(true)
          } else {
            setSticky(false)
          }
        }).exec();
      }
    }
  }, [filterActive])

  const checkIfSticky = useCallback((t) => {
    if (t > 150) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  }, [])

  return (
    <>
      <View className="board-header">
        <View
          className="board-header-title"
          style={{
            paddingTop: `${SYSTEM_BAR_HEIGHT}px`,
            height: `${HEAD_HEIGHT}px`,
          }}
        >
          <Image
            className="board-header-search"
            src="https://p0.meituan.net/ingee/84c53e3349601b84eb743089196457d52891.png"
          />
          <Text className="board-header-title-text">项目看板</Text>
        </View>
      </View>
      <ScrollView
        id="board-list-scroll"
        className="board"
        scrollY
        style={{
          paddingTop: `calc(${SCROLL_TOP_MARGIN}px + 20rpx)`,
          height: `calc(100vh - ${SCROLL_TOP_MARGIN}px - 20rpx)`,
        }}
        // onScrollToUpper={() => {
        //   checkIfSticky(0)
        // }}
        onScroll={(e) => {
          checkIfSticky(e.detail.scrollTop);
        }}
      >
        <View
          style={{
            visibility: sticky ? 'hidden' : 'visible',
          }}
        >
          {tab}
          {filter}
        </View>
        {sticky && (
          <View
            style={{
              position: 'fixed',
              top: `${HEAD_HEIGHT + SYSTEM_BAR_HEIGHT}px`,
              width: '100%',
              zIndex: 3,
              backgroundColor: '#fff',
              // visibility: sticky ? 'visible' : 'hidden',
            }}
          >
            {tab_sticky}
            {filter_sticky}
          </View>
        )}

        <View>
          {PROJECT_TYPE.map(({ name, key }) => {
            if (!data?.[key]?.length > 0) return null;
            const arr = data?.[key] || [];
            return (
              <View>
                <View className="project-add-text">
                  <Text>{name}</Text>
                </View>
                {arr.map((obj) => {
                  if (obj?.projectStageStep?.length > 0) {
                    obj.hasUpdate = true;
                  }
                  return <ProjectItem {...obj} />;
                })}
              </View>
            );
          })}
        </View>
      </ScrollView>
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
  const [active, setActive] = useState(1);
  const [data, setData] = useState(DEFAULT_ARR);
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
    });
  }, [])

  const props = {
    list: data,
    active,
    onClick: (i) => setActive(i),
    type,
  }

  return {
    component: (
      <NiceTab {...props}/>
    ),
    Component: NiceTab,
    props,
    tabSelected: NAME_MAPPING_ARR[active],
    setType,
  };
}


const CLASSNAME_BOARD = {
  default: 'board-tab-item',
  small: 'board-tab-item-small'
}
function NiceTab(props) {
  const { list = [], active, onClick, type = 'small' } = props;

  return (
    <ScrollView className="board-tab" scrollX>
      {list.map((item, i) => {
        const {p1 = '-', p2 = '-', p3 = '', p4 = '近7日', p5 = ''} = item;
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
                  <View>{p4}</View>
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
    </ScrollView>
  );
}

function useBoardFilter() {
  const [filterActive, setFilterActive] = useState('');
  const props = {
    filterActive,
    setFilterActive,
  }
  return {
    setFilterActive,
    component: <BoardFilter {...props} />,
    Component: BoardFilter,
    props,
  };
}

function BoardFilter(props) {
  const { filterActive = '', setFilterActive } = props;
  return (
    <View style={{ position: 'relative' }}>
      <View className="board-filter">
        {FILTER_ITEMS.map((item) => {
          return (
            <View
              className="board-filter-item"
              onClick={() => setFilterActive(item.type)}
            >
              <Text className="board-filter-item-name">{item.name}</Text>
              <Image
                className="board-filter-item-img"
                src={
                  '../../static/' +
                  (false ? 'arrow-down-active' : 'arrow-down') +
                  '.png'
                }
              />
            </View>
          );
        })}
      </View>
      {filterActive && (
        <View
          catchMove={false}
          className="board-filter-mask"
          onClick={() => setFilterActive('')}
        />
      )}
      <Filter
        titleHeight={SCROLL_TOP_MARGIN + 20}
        filterShow={filterActive}
        ongetFilterShow={(v) => {
          setFilterActive('');
        }}
      />
    </View>
  );
}

const OBJECT_TYPE = {
  3: '院线电影',
  1: '网络剧',
}

function ProjectItem(props) {
  const {
    type,
    name = '-',
    pic,
    cooperType = [],
    releaseDate,
    estimateBox,
    scheduleType,
    score = '8.5',
    projectStageStep = [],
    hasUpdate = false,
  } = props;

  const [val, unit] = useMemo(() => {
    return trans(estimateBox)
  }, [estimateBox]);

  const [stageName, stageDescribe, stageLength] = useMemo(() => {
    if (projectStageStep.length === 0) return '';
    const { stageStatus:[ stageName = '' ], describe = '' }  = projectStageStep[projectStageStep.length - 1];
    return [`[${stageName}]`, describe, projectStageStep.length]
  }, [projectStageStep])

  return (
    <View className="project-item">
      <View className="project-item-type">{OBJECT_TYPE[type] || '-'}</View>
      <Image className=".project-item-img" src={picFn(pic)} />
      <View className="project-item-detail">
        <View className="project-item-title">
          <View className="project-item-title-name">{name}</View>
          <View className="project-item-title-predict">
            预估
            <Text className="project-item-title-predict-num">{val}</Text>
            {unit}
          </View>
        </View>
        <View className="project-item-ps">
          <View className="project-item-publication">
            {cooperType.join('/')}
          </View>
          <View className="project-item-score">{score}</View>
        </View>
        <View className="project-item-date">
          <Text>{releaseDate}</Text>
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

function onHandleResponse(res) {
  const { success, data, error } = res;
  if (success) return data;
  return [];
}

function PureReq_ListInfo(params) {
  const { 
    cooperStatus = 0
  } = params;
  return reqPacking(
    {
      url: 'api/management/lisInfo',
      data: {
        startDate: 1611072000000,
        endDate: 1611676799999,
        cooperStatus,
      }
    },
    'server',
  ).then((res) => onHandleResponse(res))
}

function PureReq_Cooperation(params) {
  return reqPacking(
    {
      url: 'api/management/stateCooperation',
    },
    'server',
  ).then((res) => onHandleResponse(res))
}

function trans(input) {
  if (!typeof input === 'number') return [];
  let unit = '';
  let val = input;
  if (input > 1e9) {
    unit = '亿';
    val = (input / 1e9).toFixed(2);
  } else if (input > 1e5 && input < 1e9) {
    unit = '万';
    val = (input / 1e5).toFixed(1);
  } else {
    unit = '';
  }
  return [val, unit];
}
