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
import React from 'react';
import { CATEGORY_LIST } from '../lib';
import './movie-list.scss';

const CATEGORY_MAPPING = {};
CATEGORY_LIST.map((item) => {
  CATEGORY_MAPPING[item.key] = item.name;
})


export function MovieList(props) {
    const { data = [], onChoose = () => {}, right = 'category' } = props;

    const right_mapping = {
      category: (item) => <View className="category">{CATEGORY_MAPPING[item.category]}</View>,
      user: (item) => {
        if (!item.creator) return null

        return (
          <View className="user">
            <View className="p1">已创建</View>
            <View className="p2">by {item.creator}</View>
          </View>
        )
      },
    }

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
                {
                  right_mapping[right] ? right_mapping[right](item) : null
                }
              </View>
            </View>
          )
        })}
      </ScrollView>
    )
  }