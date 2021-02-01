import Two from '../../static/detail/two.png';
import Three from '../../static/detail/three.png';
import Four from '../../static/detail/four.png';

const CategoryList = [
  {
    label: '其他', value: 0, icon: Two, name: 'else'
  },
  {
    label: '网络剧', value: 1, icon: Three, name: 'internalTv'
  },
  {
    label: '电视剧', value: 2, icon: Three, name: 'tv'
  },
  {
    label: '院线电影', value: 3, icon: Four, name: 'movie'
  },
  {
    label: '网络电影', value: 4, icon: Four, name: 'internalMovie'
  },
  {
    label: '综艺', value: 5, icon: Two, name: 'variety'
  },
];

const ScheduleType = [
  {
    name: "已定档",
    color: '#14CC14',
    bgColor: 'rgba(20,204,20, 0.10)',
    width: '44px',
  },
  {
    name: "非常确定",
    color: '#F1303D',
    bgColor: 'rgba(241,48,61, 0.10)',
    width: '56px',
  },
  {
    name: "可能",
    color: '#FD9C00',
    bgColor: 'rgba(253,156,0, 0.10)',
    width: '32px',
  },
  {
    name: "内部建议",
    color: '#FD9C00',
    bgColor: 'rgba(253,156,0, 0.10)',
    width: '56px',
  },
  {
    name: "待定",
    color: 'rgba(51,51,51, 0.40)',
    bgColor: 'rgba(51,51,51, 0.10)',
    width: '32px',
  },
];

const BasicItem = [
  {
    key: 'name',
    name: '片名'
  },
  {
    key: 'type',
    name: '类型'
  },
  {
    key: 'duration',
    name: '片长'
  },
  {
    key: 'movieSource',
    name: '制片地'
  },
  {
    key: 'newDirector',
    name: '导演'
  },{
    key: 'newMainRole',
    name: '主演'
  },{
    key: 'mainControl',
    name: '主控方'
  },{
    key: 'mainProduct',
    name: '出品方'
  },{
    key: 'mainIssue',
    name: '发行方'
  }
];

const FollowList = {
  developStageList: {
    name: '开发',
    color: '#FD9C00',
    bgColor: 'rgba(253,156,0, 0.06)',
    tipColor: '#B26F01',
    tipBgColor: 'rgba(253,156,0, 0.10)'
  },
  completedStageList: {
    name: '完片',
    color: '#69BF13',
    bgColor: 'rgba(105,191,19, 0.06)',
    tipColor: '#4D8C0E',
    tipBgColor: 'rgba(105,191,19, 0.10)'
  },
  publicityStageList: {
    name: '宣传',
    color: '#6666FF',
    bgColor: 'rgba(102,102,255, 0.06)',
    tipColor: '#4747B2',
    tipBgColor: 'rgba(102,102,255, 0.10)'
  },
  publishStageList: {
    name: '发行',
    color: '#09B3B3',
    bgColor: 'rgba(9,179,179, 0.06)',
    tipColor: '#067D7D',
    tipBgColor: 'rgba(9,179,179, 0.10)'
  },
  showStageList: {
    name: '上映',
    color: '#D92BD9',
    bgColor: 'rgba(217,43,217, 0.06)',
    tipColor: '#981E98',
    tipBgColor: 'rgba(217,43,217, 0.10)'
  },
  showAfterStageList: {
    name: '映后',
    color: '#9F40FF',
    bgColor: 'rgba(159,64,255, 0.06)',
    tipColor: '#981E98',
    tipBgColor: 'rgba(159,64,255, 0.10)'
  },
};

export {
  CategoryList,
  ScheduleType,
  BasicItem,
  FollowList
}