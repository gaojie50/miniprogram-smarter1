import React from 'react';
import Taro from '@tarojs/taro';
import Tab from '../m5/tab-bar';
import '../m5/style/components/tab-bar.scss';

const TAB_ACTIVE = {
  '/pages/list/index': 0,
  '/pages/board/index': 1,
};

const ROUTER = {};

Object.keys(TAB_ACTIVE).forEach((url) => {
  ROUTER[TAB_ACTIVE[url]] = url;
})

const TAB_LIST = [
  { title: '市场情报', image: 'https://p0.meituan.net/ingee/618771a1bcebae82663a09ee4bdca3291948.png', selectedImage: 'https://p0.meituan.net/ingee/618771a1bcebae82663a09ee4bdca3291948.png' },
  { title: '项目看板', image: 'https://p0.meituan.net/ingee/310af67cab9b77341a62c338f8918c9c2387.png', selectedImage: 'https://p0.meituan.net/ingee/310af67cab9b77341a62c338f8918c9c2387.png' },
  // { title: '项目评估', image: 'https://p0.meituan.net/ingee/ae541bbbc5e5c7bff5f66671bdc50b982975.png', selectedImage: 'https://p0.meituan.net/ingee/a64c4d5613b78f62cc3c3c14b5c092182201.png' }
];



export default () => {
  const currentPath = Taro.getCurrentInstance().router.path;
  const current = TAB_ACTIVE[currentPath];

  return (
    <Tab
      current={current}
      tabList={TAB_LIST}
      fixed
      onClick={(val) => {
        Taro.navigateTo({
          url: `${ROUTER[val]}`,
        });
      }}
    />
  )
}