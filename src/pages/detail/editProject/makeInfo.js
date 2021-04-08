import { Block, View, Text } from '@tarojs/components';
import React, { forwardRef, useEffect, useReducer, useState} from 'react';
import Taro from '@tarojs/taro';
import ListItem from '@components/m5/list/item';
import FloatCard from '@components/m5/float-layout';
import '@components/m5/style/components/float-layout.scss';
import '@components/m5/style/components/grid.scss';
import M5Grid from '@components/m5/grid';
import Divider from './component/divider';
import { Source } from '../constant';
import './makeInfo.scss';

const textVoid = <View style={{ color: '#CCCCCC', marginTop: '12rpx' }}>请选择</View>;
const sourceTextVoid = <View style={{ color: '#CCCCCC' }}>请选择</View>;
const divider = <Divider />
const types = {
  mainControl: '主控方',
  producer: '出品方',
  issuer: '发行方',
  director: '导演',
  protagonist: '主演',
}

export default function makeInfo(props, ref) {
  const { changeScroll = () => {}, movieData } = props;
  const [openSource, setOpenSource] = useState(false);
  const [source, setSource] = useState([]);

  useEffect(() => {
    if(ref.current && ref.current.filmSource) {
      setSource(ref.current.filmSource)
    }
  }, [ref.current])

  return (
    <Block>
      <View className="makeInfo-title">
        制作信息
      </View>
      <View className="makeInfo-content">
        <View className="makeInfo-item">
          {listItemWrap('mainControl', ref)}
          {divider}
          <ListItem className="source-float" title='片源地' extraText={source.join(' / ') || sourceTextVoid} arrow onClick={() => {setOpenSource(true);changeScroll(false)}} />
          <FloatCard
            isOpened={openSource}
            title="片源地"
            onClose={() => {setOpenSource(false);changeScroll(true)}}
          >
              <M5Grid
                hasBorder={false}
                columnNum={4}
                mode="rect"
                data={Source.map((item) => ({ value: item.label, valueClassName: source.indexOf(item.label) !== -1 ? 'm5-grid-item-checked' : '' }))}
                onClick={({ value }) => {
                  let newSource = JSON.parse(JSON.stringify(source));
                  const index = source.indexOf(value);
                  if(index === -1) {
                    newSource.push(value)
                  } else {
                    newSource.splice(index, 1);
                  }
    
                  ref.current.filmSource = newSource;
                  setSource(newSource);
                }}
              />
          </FloatCard>
          {divider}
        </View>
        {listItemWrap('producer', ref)}
        {divider}
        {listItemWrap('issuer', ref)}
        {divider}
        {listItemWrap('director', ref)}
        {divider}
        {listItemWrap('protagonist', ref)}
      </View>
    </Block>
  )
}

function listItemWrap(param, ref) {
  const [extraTextItem, setExtraTextItem] = useState([]);

  useEffect(() => {
    const subList = handleCon(param, ref.current);
    setExtraTextItem(subList);
  }, [ref.current])

  const updateCon = () => {
    const subList = handleCon(param, ref.current);
    setExtraTextItem(subList);
  }

  const value = extraTextItem.map(i => <Text className="extraText-item" style={{marginBottom: extraTextItem.length === 1 ? '0' : '10rpx'}}>{i}</Text>);

  return <ListItem title={types[param]} extraText={extraTextItem.length > 0 ? value : textVoid} arrow onClick={() => moveToSearch(param, ref, updateCon)} />
}

function handleCon(param, data) {
  let list = [];
  if(data) {
    if(param === 'mainControl' && data[param] && data[param].name) {
      list.push(data[param].name)
    } else {
      Array.isArray(data[param]) && data[param].length > 0 &&
      data[param].forEach(item => {
        list.push(item.name)
      })
    }
  }

  return list;
}

function moveToSearch(param, ref, update) {
  Taro.navigateTo({
    url: (param === 'director' || param === 'protagonist') ? '/pages/searchActor/index' : '/pages/detail/searchCompany/index',
    events: {
      submitData: function(data) {
          ref.current[param] = data;
          update(ref)
      },
    },
    success: function (res) {
      res.eventChannel.emit('acceptDataFromOpenerPage', { type: param, data: ref.current })
    }
  })
}