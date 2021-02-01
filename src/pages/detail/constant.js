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

export {
  CategoryList,
  ScheduleType,
}