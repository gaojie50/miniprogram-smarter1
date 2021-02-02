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
import './search.scss';
import { MOVIE_TYPE_LIST, CATEGORY_LIST } from './lib';
import utils from '../../utils/index.js'
import { get as getGlobalData } from '../../global_data'

const CATEGORY_MAPPING = {};
CATEGORY_LIST.map((item) => {
  CATEGORY_MAPPING[item.key] = item.name;
})
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
  const [category, setCategory] = useState();
  const [openCategorySelector, setOpenCategorySelector] = useState(false);

  const [types, setTypes] = useState({});
  const [openTypeSelector, setOpenTypeSelector] = useState(false);
  const [showToast, setShowToast] = useState('');

  const [cooperType, setCooperType] = useState({});
  const [openCooperSelector, setOpenCooperSelector] = useState(false);

  const [cooperState, setCooperState] = useState();
  const [openCooperStateSelector, setOpenCooperStateSelector] = useState(false);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const typeStr = useMemo(() => {
    const keys = Object.keys(types);
    return keys.length ? keys.join(' / ') : textVoid;
  }, [types]);

  const cooperStr = useMemo(() => {
    const keys = Object.keys(cooperType);
    return keys.length ? keys.join(' / ') : textVoid;
  }, [cooperType]);

  const searchMovie = useCallback(debounce(async (val) => {
    setLoading(true);
    await PureReq_Search_Movie({
      keyword: val
    }).then((data) => {
      setData(data);
    });
    setLoading(false);
  }, 800), []);

  const resetOther = useCallback(() => {
    setCategory();
    setCooperState();
    setCooperType({});
    setTypes({});
  }, [])

  const handleChoose = useCallback((item) => {
    const { name, cooperType = [], category, cooperStatus, type } = item;
    setName(name);
    const t1 = CATAGORY.find((item1) => item1.value === category)
    setCategory(t1?.label || undefined);
    setCooperState(cooperStatus);

    const cooperTypeObj = {};
    cooperType?.forEach((item2) => {
      cooperTypeObj[item2] = true;
    });
    setCooperType(cooperTypeObj);

    const typeObj = {};
    type?.forEach((item2) => {
      typeObj[item2] = true;
    });
    setTypes(typeObj);

    setData([]);
  }, []);

  const handleSave = useCallback(() => {
    const t1 = CATAGORY.find((item1) => item1.label === category)
    const cooperTypeArr = Object.keys(cooperType || {});
    const type = Object.keys(types || {});
    PureReq_Create_Project({
      name,
      category: t1?.value,
      cooperType: cooperTypeArr,
      cooperStatus: cooperState,
      type,
    }).then((data) => {
      setShowToast('新建成功')
      Taro.redirectTo({
        url: `/pages/detail/index?projectId=${data}`,
      })
    })
  }, [name, category, cooperType, types, cooperState])

  return (
    <View className="add-project">
      <View
        style={{
          boxShadow: '0 2px 10px 0 rgba(0,0,0,0.02)',
          borderRadius: '16rpx',
          backgroundColor: '#fff',
          margin: '0 30rpx 110rpx 30rpx',
        }}>
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <M5Input autoFocus placeholder='请输入片名' value={name} onChange={(val) => {
            if (val !== name) {
              setName(val);
              searchMovie(val);
            }
            return val
          }} />
          {
            loading && (<View className="movie-search-loading">
              <mpLoading type="circle" show={true} tips="" />
            </View>)
          }
        </View>
        {
          data.length > 0 && name && (
            <>
              {divider}
              <CustomName value={name} onChoose={() => {
                setData([]);
                resetOther();
              }} />
              {divider}
              <MovieList data={data} onChoose={handleChoose} />
            </>
          )
        }
        {divider}
        <ListItem title='类型' extraText={category || textVoid} arrow onClick={() => setOpenCategorySelector(true)} />
        <FloatCard
          isOpened={openCategorySelector}
          title="选择类型"
          onClose={() => setOpenCategorySelector(false)}
        >
          <M5Grid
            hasBorder={false}
            columnNum={2}
            mode="rect"
            data={CATAGORY.map((item) => ({ value: item.label, valueClassName: category === item.label ? 'm5-grid-item-checked' : '' }))}
            onClick={({ value }) => {
              setCategory(value);
            }}
          />
        </FloatCard>
        {divider}
        <ListItem title='品类' extraText={typeStr} arrow onClick={() => setOpenTypeSelector(true)} />
        <FloatCard
          isOpened={openTypeSelector}
          title="选择品类"
          onClose={() => setOpenTypeSelector(false)}
        >
          <M5Grid
            hasBorder={false}
            columnNum={4}
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
        <Toast duration={1000} isOpened={showToast} text={showToast} onClose={() => setShowToast('')} />
        {divider}
        <ListItem title='意向合作类型' extraText={cooperStr} arrow onClick={() => setOpenCooperSelector(true)} />
        <FloatCard
          isOpened={openCooperSelector}
          title="选择意向合作类型"
          onClose={() => setOpenCooperSelector(false)}
        >
          <M5Grid
            hasBorder={false}
            className="grid-checkbox"
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
        <ListItem title='合作状态' extraText={COOPER_STATE?.[cooperState]?.label || textVoid} arrow onClick={() => setOpenCooperStateSelector(true)} />
        <FloatCard
          isOpened={openCooperStateSelector}
          title="选择合作状态"
          onClose={() => setOpenCooperStateSelector(false)}
        >
          <M5Grid
            hasBorder={false}
            className="grid-checkbox"
            mode="rect"
            data={COOPER_STATE.map((item, idx) => ({ value: item.value, valueClassName: idx === cooperState ? 'm5-grid-item-checked' : '' }))}
            onClick={({ value }) => {
              const t = COOPER_STATE.findIndex((item) => item.value === value)
              setCooperState(t);
            }}
          />
        </FloatCard>
      </View>
      <View className="add-project-confirm">
        <View className="add-project-confirm-btn" onClick={handleSave}>保存</View>
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

function PureReq_Create_Project(
  { category, cooperStatus, cooperType, customType = "", maoyanId = null, projectId = null, name, type }
) {
  return reqPacking(
    {
      url: 'api/management/createProject',
      data: {
        category,
        cooperStatus,
        cooperType,
        customType,
        maoyanId,
        name,
        projectId,
        type,
      },
      method: 'POST'
    },
    'server',
  ).then((res) => onHandleResponse(res))
}

function onHandleResponse(res) {
  const { success, data, error } = res;
  if (success) {
    if (data instanceof Array) {
      data.forEach(item => {
        item.pic = item.pic
          ? `${item.pic.replace('/w.h/', '/')}@460w_660h_1e_1c`
          : `../../static/icon/default-pic.svg`
      });
    }
    return data;
  }
  return [];
}

function CustomName(props) {
  const { value = '', onChoose = () => { } } = props;
  return (
    <View
      className="custom-project"
      onClick={() => {
        onChoose();
      }}
    >
      <View>
        <Text className="custom-project-name">创建新项目“{value}”</Text>
      </View>
    </View>
  )
}

function MovieList(props) {
  const { data = [], onChoose = () => { } } = props;
  return (
    <ScrollView className="search-list" scrollY>
      {data.map((item, index) => {
        return (
          <View
            className="item"
            key={item.id}
            data-id={item.maoyanId + '-' + item.projectId}
            onClick={() => onChoose(item)}
          >
            <Image src={item.pic}></Image>
            <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <View>
                <View className="name">{item.name}</View>
                <View className="cooperType">
                  {item?.cooperType?.join('/')}
                </View>
                <View className="director">
                  {'导演：' + (item.director ? item.director : '-')}
                </View>
                <View className="release">
                  <Text>{item.releaseDesc ? item.releaseDesc : ''}</Text>
                </View>
              </View>
              <View className="category">
                {CATEGORY_MAPPING[item.category]}
              </View>
            </View>
          </View>
        )
      })}
    </ScrollView>
  )
}