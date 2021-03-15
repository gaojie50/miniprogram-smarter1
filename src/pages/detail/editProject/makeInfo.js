import { Block, View, Text } from '@tarojs/components';
import React, { useEffect, useState} from 'react';
import ListItem from '@components/m5/list/item';
import FloatCard from '@components/m5/float-layout';
import M5Grid from '@components/m5/grid';
import Divider from './component/divider';
import { Source } from '../constant';
import './makeInfo.scss';

const textVoid = <Text style={{ color: '#CCCCCC' }}>请选择</Text>;
const divider = <Divider />
const types = {
  producer: '出品方',
  issuer: '发行方',
  director: '导演',
  protagonist: '主演',
}

export default function makeInfo(props) {
  console.log(props)
  const { changeScroll = () => {}, movieData } = props;

  const [openSource, setOpenSource] = useState(false);
  const [source, setSource] = useState([]);

  useEffect(() => {
    if(movieData.filmSource) {
      setSource(movieData.filmSource)
    }
  }, [props])

  return (
    <Block>
      <View className="makeInfo-title">
        制作信息
      </View>
      <View className="makeInfo-content">
        <View className="makeInfo-item">
          <ListItem title='片源地' extraText={source.join(' / ') || textVoid} arrow onClick={() => {setOpenSource(true);changeScroll(false)}} />
          <FloatCard
            isOpened={openSource}
            title="片源地"
            onClose={() => {setOpenSource(false);changeScroll(true)}}
          >
              <M5Grid
                hasBorder={false}
                columnNum={4}
                mode="rect"
                data={Source.map((item) => ({ value: item.label, valueClassName: source === item.label ? 'm5-grid-item-checked' : '' }))}
                onClick={({ value }) => {
                  let newSource = JSON.parse(JSON.stringify(source));
                  const index = source.indexOf(value);
                  if(index === -1) {
                    newSource.push(value)
                  } else {
                    newSource.splice(index, 1);
                  }
    
                  setSource(newSource);
                }}
              />
          </FloatCard>
          {divider}
        </View>
        {listItemWrap('producer', movieData)}
        {divider}
        {listItemWrap('issuer', movieData)}
        {divider}
        {listItemWrap('director', movieData)}
        {divider}
        {listItemWrap('protagonist', movieData)}
      </View>
    </Block>
  )
}

function listItemWrap(param, data) {
  let extraTextItem = [];
  data[param] && data[param].length > 0 &&
  data[param].forEach(item => {
    extraTextItem.push(item.name)
  })

  const value = extraTextItem.map(i => <Text className="extraText-item">{i}</Text>)

  return <ListItem title={types[param]} extraText={extraTextItem.length > 0 ? value : textVoid} arrow onClick={() => {setOpenSource(true)}} />
}