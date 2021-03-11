import {
  Block,
  View,
  Label,
  Image,
  Input,
  ScrollView,
  Text,
  Picker,
  Textarea,
} from '@tarojs/components';
import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react'
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
import { MOVIE_TYPE_LIST, TV_TYPE_LIST, VARIETY_TYPE_LIST } from './lib';
import utils from '../../utils/index.js'
import { get as getGlobalData } from '../../global_data'
import { CustomName } from './component/custom-project';
import { MovieList } from './component/movie-list';
import Divider from './component/divider';

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

const divider = <Divider />

export default function AddProject() {
  const pathParams = Taro.getCurrentInstance().router.params;
  const { name: passedName = '' } = pathParams;
  const [name, setName] = useState(passedName);
  const [category, setCategory] = useState();
  const [customCategory, setCustomCategory] = useState();
  const [openCategorySelector, setOpenCategorySelector] = useState(false);

  const [types, setTypes] = useState({});
  const [openTypeSelector, setOpenTypeSelector] = useState(false);
  const [showToast, setShowToast] = useState('');

  const [cooperType, setCooperType] = useState({});
  const [customCooperType, setCustomCooperType] = useState();
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
    }).then(({ success, data }) => {
      if (success) { setData(data); }
      else {
        setData([]);
      }
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

  const isOtherCategory = useMemo(() => {
    return category === '其他';
  }, [category])

  useEffect(() => {
    if (category === '其他') {
      setTypes({});
    } else {
      setCustomCategory();
    }
  }, [category])

  const hasOtherCooperType = useMemo(() => {
    return !!cooperType['其他'];
  }, [cooperType])

  const handleSave = useCallback(() => {
    const t1 = CATAGORY.find((item1) => item1.label === category)
    const cooperTypeArr = Object.keys(cooperType || {});
    const type = Object.keys(types || {});
    if (hasOtherCooperType && customCooperType) {
      cooperTypeArr.push(customCooperType);
    }

    if (!name) {
      setShowToast('请填写片名')
      return
    }
    if (!t1) {
      setShowToast('请选择品类')
      return
    }

    if (isOtherCategory && !customCategory) {
      setShowToast('请填写品类名称')
      return
    }

    if (cooperTypeArr.length === 0) {
      setShowToast('请填写意向合作类型')
      return
    }
    if (cooperState === undefined) {
      setShowToast('请填写合作状态')
      return
    }

    PureReq_Create_Project({
      name,
      category: t1?.value,
      cooperType: cooperTypeArr,
      cooperStatus: cooperState,
      customType: isOtherCategory ? customCategory : undefined,
      type,
    }).then(({ success, data, error }) => {
      if (success) {
        setShowToast('新建成功')
        Taro.redirectTo({
          url: `/pages/detail/index?projectId=${data}`,
        })
      } else {
        setShowToast(error.message || `未知错误，请联系管理员`);
      }
    })
  }, [name, category, cooperType, types, cooperState, isOtherCategory, hasOtherCooperType, customCategory, customCooperType])

  const TYPES = useMemo(() => {
    if (category === '网络剧' || category === '电视剧') {
      return TV_TYPE_LIST;
    }

    if (category === '院线电影' || category === '网络电影') {
      return MOVIE_TYPE_LIST
    }

    if (category === '综艺') {
      return VARIETY_TYPE_LIST;
    }

    return [];
  }, [category]);

  return (
    <View className="add-project">
      <View
        style={{
          boxShadow: '0 2px 10px 0 rgba(0,0,0,0.02)',
          borderRadius: '16rpx',
          backgroundColor: '#fff',
          margin: '0 30rpx 110rpx 30rpx',
        }}>
        <View className="add-project-input-wrapper">
          <Textarea autoHeight className="add-project-input-wrapper-content" autoFocus placeholder='请输入片名' placeholderClass="add-project-input-placeholder" value={name} onInput={(e) => {
            const val = e.detail.value;
            if (val !== name) {
              setName(val);
              searchMovie(val);
            }
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
              <MovieList data={data} onChoose={handleChoose} right="user" />
            </>
          )
        }
        {divider}
        <ListItem title='品类' extraText={category || textVoid} arrow onClick={() => setOpenCategorySelector(true)} />
        {
          isOtherCategory && (
            <View className="add-project-input-wrapper">
              <Input
                className="add-project-input-wrapper-content"
                autoFocus placeholder='请填写品类名称'
                placeholderClass="add-project-input-placeholder"
                value={customCategory} onInput={(e) => {
                  const val = e.detail.value;
                  setCustomCategory(val);
                }}
              />
            </View>
          )
        }
        <FloatCard
          isOpened={openCategorySelector}
          title="选择品类"
          onClose={() => setOpenCategorySelector(false)}
        >
          <View className="M5Grid-wrap">
          <M5Grid
            hasBorder={false}
            columnNum={4}
            mode="rect"
            data={CATAGORY.map((item) => ({ value: item.label, valueClassName: category === item.label ? 'm5-grid-item-checked' : '' }))}
            onClick={({ value }) => {
              setCategory(value);
              setTypes({});
            }}
          />
          </View>
        </FloatCard>
        {divider}
        <ListItem disabled={isOtherCategory || !category} title='类型' extraText={typeStr} arrow onClick={() => setOpenTypeSelector(true)} />
        <FloatCard
          isOpened={openTypeSelector}
          title="选择类型"
          className="type-select-float"
          onClose={() => setOpenTypeSelector(false)}
        >
          <View className="M5Grid-wrap">
            <M5Grid
              hasBorder={false}
              columnNum={4}
              mode="rect"
              data={TYPES.map((item) => ({ value: item.name, valueClassName: types[item.name] ? 'm5-grid-item-checked' : '' }))}
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
          </View>
        </FloatCard>
        <Toast duration={1000} isOpened={showToast} text={showToast} onClose={() => setShowToast('')} />
        {divider}
        <ListItem title='意向合作类型' extraText={cooperStr} arrow onClick={() => setOpenCooperSelector(true)} />
        {
          hasOtherCooperType && (
            <View className="add-project-input-wrapper">
              <Input
                className="add-project-input-wrapper-content"
                placeholder='请填写合作类型'
                placeholderClass="add-project-input-placeholder"
                value={customCooperType} onInput={(e) => {
                  const val = e.detail.value;
                  setCustomCooperType(val);
                }}
              />
            </View>
          )
        }
        <FloatCard
          isOpened={openCooperSelector}
          title="选择意向合作类型"
          onClose={() => setOpenCooperSelector(false)}
        >
          <View className="M5Grid-wrap">
            <M5Grid
              hasBorder={false}
              className="grid-checkbox"
              columnNum={4}
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
          </View>
        </FloatCard>
        {divider}
        <ListItem title='合作状态' extraText={COOPER_STATE?.[cooperState]?.label || textVoid} arrow onClick={() => setOpenCooperStateSelector(true)} />
        <FloatCard
          isOpened={openCooperStateSelector}
          title="选择合作状态"
          onClose={() => setOpenCooperStateSelector(false)}
        >
          <View className="M5Grid-wrap">
            <M5Grid
              hasBorder={false}
              columnNum={4}
              className="grid-checkbox"
              mode="rect"
              data={COOPER_STATE.map((item, idx) => ({ value: item.value, valueClassName: idx === cooperState ? 'm5-grid-item-checked' : '' }))}
              onClick={({ value }) => {
                const t = COOPER_STATE.findIndex((item) => item.value === value)
                setCooperState(t);
              }}
            />
          </View>
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
    return {
      data,
      success,
    };
  }
  return {
    success,
    error,
  };
}
