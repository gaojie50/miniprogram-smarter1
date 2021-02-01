import {
  Block,
  View,
  Label,
  Image,
  Input,
  ScrollView,
  Text,
  Picker
} from '@tarojs/components'
import React, { useState, useMemo, useEffect, useCallback } from 'react'
import Taro from '@tarojs/taro'
import reqPacking from '../../utils/reqPacking.js'
import List from '../../components/m5/list';
import ListItem from '../../components/m5/list/item';
import M5Input from '../../components/m5/input';
import FloatCard from '../../components/m5/float-layout';
import M5Grid from '../../components/m5/grid';
import Toast from '../../components/m5/toast';
import '../../components/m5/style/components/input.scss';
import '../../components/m5/style/components/list.scss';
import '../../components/m5/style/components/float-layout.scss';
import '../../components/m5/style/components/grid.scss';
import '../../components/m5/style/components/toast.scss';
import './index.scss'
import { MOVIE_TYPE_LIST } from './lib';
import utils from '../../utils/index.js'
import { get as getGlobalData } from '../../global_data'

const { 
  debounce
} = utils;

const CATAGORY = [
  { label: '网络剧', value: 1 },
  { label: '电视剧', value: 2 },
  { label: '院线电影', value: 3 },
  { label: '网络电影', value: 4 },
  { label: '综艺', value: 5 },
  { label: '其他', value: 0 },
];
const COOPER_TYPE = [
  { label: '主投', value: '主投' },
  { label: '跟投', value: '跟投' },
  { label: '开发', value: '开发' },
  { label: '宣传', value: '宣传' },
  { label: '主发', value: '主发' },
  { label: '联发', value: '联发' },
  { label: '票务合作', value: '票务合作' },
  { label: '其他', value: '其他' },
];
const COOPER_STATE = [
  { label: '接触中', value: '接触中' },
  { label: '确定合作', value: '确定合作' },
  { label: '正常完结', value: '正常完结' },
  { label: '合作暂停', value: '合作暂停' },
  { label: '合作取消', value: '合作取消' },
  { label: '未合作', value: '未合作' },
];
const textVoid = <Text style={{ color: '#CCCCCC' }}>请选择</Text>;

const divider = <View className="divider" />

export default function AddProject() {
  const [name, setName] = useState('');
  const [catagory, setCatagory] = useState();
  const [types, setTypes] = useState({});
  const [openTypeSelector, setOpenTypeSelector] = useState(false);
  const [showToast, setShowToast] = useState('');
  const [cooperType, setCooperType] = useState({});
  const [openCooperSelector, setOpenCooperSelector] = useState(false);
  const [cooperState, setCooperState] = useState();

  const [searchResult, setSearchResult] = useState([]);

  const typeStr = useMemo(() => {
    const keys = Object.keys(types);
    return keys.length ? keys.join(' / ') : textVoid;
  }, [types])

  const cooperStr = useMemo(() => {
    const keys = Object.keys(cooperType);
    return keys.length ? keys.join(' / ') : textVoid;
  }, [cooperType])

  const searchMovie = useCallback(debounce((val) => {
    PureReq_Search_Movie({
      keyword: val
    }).then((data) => {
      setSearchResult(data)
    })
  }, 300), [])

  return (
    <View style={{
      height: '100vh',
      backgroundColor: ' #f8f8f8',
      boxSizing: 'border-box',
      padding: '30rpx 0',
      overflow: 'scroll'
    }}>
      <View
        style={{
          boxShadow: '0 2px 10px 0 rgba(0,0,0,0.02)',
          borderRadius: '16rpx',
          backgroundColor: '#fff',
          margin: '0 30rpx 30rpx 30rpx',
        }}>
        <M5Input placeholder='请输入片名' value={name} onChange={(val) => {
          if (val !== name) {
            setName(val);
            searchMovie(val);
          }
        }} />
        <FloatCard
          isOpened={!!searchResult.length}
          onClose={() => setSearchResult([])}
        >
          OK
        </FloatCard>
        {divider}
        <Picker
          mode='selector'
          range={CATAGORY.map((item) => item.label)}
          onChange={(e) => setCatagory(e.detail.value)}
        >
          <ListItem title='品类' extraText={CATAGORY?.[catagory]?.label || textVoid} arrow />
        </Picker>
        {divider}
        <ListItem title='类型' extraText={typeStr} arrow onClick={() => setOpenTypeSelector(true)} />
        <FloatCard
          isOpened={openTypeSelector}
          title="选择类型"
          onClose={() => setOpenTypeSelector(false)}
        >
          <M5Grid
            hasBorder={false}
            mode="rect"
            data={MOVIE_TYPE_LIST.map((item) => ({ value: item.name, valueClassName: types[item.name] ? 'm5-grid-item-checked' : '' }))}
            onClick={({ value }) => {
              const keys = Object.keys(types);
              if (!types[value]) {
                if (keys.length < 3) {
                  types[value] = true;
                } else {
                  setShowToast('最多可以添加三个类型')
                }
              } else {
                delete types[value];
              }
              setTypes({ ...types });
            }}
          />
        </FloatCard>
        <Toast isOpened={showToast} text={showToast} onClose={() => setShowToast('')} />
        {divider}
        <ListItem title='意向合作类型' extraText={cooperStr} arrow onClick={() => setOpenCooperSelector(true)} />
        <FloatCard
          isOpened={openCooperSelector}
          title="选择意向合作类型"
          onClose={() => setOpenCooperSelector(false)}
        >
          <M5Grid
            hasBorder={false}
            mode="rect"
            data={COOPER_TYPE.map((item) => ({ value: item.label, valueClassName: cooperType[item.value] ? 'm5-grid-item-checked' : '' }))}
            onClick={({ value }) => {
              const keys = Object.keys(cooperType);
              if (!cooperType[value]) {
                cooperType[value] = true;
              } else {
                delete cooperType[value];
              }
              setCooperType({ ...cooperType });
            }}
          />
        </FloatCard>
        {divider}
        <Picker
          mode='selector'
          range={COOPER_STATE.map((item) => item.label)}
          onChange={(e) => setCooperState(e.detail.value)}
        >
          <ListItem title='合作状态' extraText={COOPER_STATE?.[cooperState]?.label || textVoid} arrow />
        </Picker>
      </View>
      <View className="add-project-confirm">
        <View className="add-project-confirm-btn">保存</View>
      </View>
    </View>
  )
}

function PureReq_Search_Movie({ keyword = '' }) {
  return reqPacking(
    {
      url: 'api/management/search',
      data: {
        keyword,
        onlyProject: false,
      }
    },
    'server',
  ).then((res) => onHandleResponse(res))
}

function onHandleResponse(res) {
  const { success, data, error } = res;
  if (success) return data;
  return [];
}

function MovieList(props) {
  const { data = []} = props;
  return (
    <View className="movie-search">
      {
        data.map((item) => {
          re
        })
      }

    </View>
  )
}