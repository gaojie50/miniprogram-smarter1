import React from 'react';
import Taro from '@tarojs/taro';
import Tab from '../m5/tab-bar';
import MarketActive from '../../static/tab/market_active.svg';
import Board from '../../static/tab/board.svg';
import BoardActive from '../../static/tab/board_active.svg';
import Assessment from '../../static/tab/assessment.svg';
import AssessmentActive from '../../static/tab/assessment_active.svg';
import Income from '../../static/tab/income.png';
import IncomeActive from '../../static/tab/income_active.png';
import '../m5/style/components/tab-bar.scss';

const TAB_ACTIVE = {
  '/pages/list/index': 0,
  // '/pages/board/index': 1,
  '/pages/assessList/index': 2,
  '/pages/board/index': 3,
};

const ROUTER = {};

Object.keys(TAB_ACTIVE).forEach((url) => {
  ROUTER[TAB_ACTIVE[url]] = url;
})

const TAB_LIST = [
  { title: '市场情报', image: 'https://p0.meituan.net/ingee/618771a1bcebae82663a09ee4bdca3291948.png', selectedImage: MarketActive },
  { title: '收入测算', image: Income, selectedImage: IncomeActive },
  { title: '评估列表', image: Assessment, selectedImage: AssessmentActive },
  { title: '项目看板', image: Board, selectedImage: BoardActive },
];



export default (props) => {
  const currentPath = Taro.getCurrentInstance().router.path;
  const current = TAB_ACTIVE[currentPath];
  const { isLogin=true } = props;
  return (
    <Tab
      current={current}
      tabList={TAB_LIST}
      fixed
      onClick={(val) => {
        if (val !== current) {
          if( isLogin ){
            Taro.switchTab({
              url: `${ROUTER[val]}`
            });
          }else{
            Taro.redirectTo({
              url: `/pages/welcome/index?target=${encodeURIComponent(ROUTER[val])}`
            })
          }
          
        }
      }}
    />
  )
}