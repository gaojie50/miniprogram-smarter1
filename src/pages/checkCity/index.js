import React from 'react';
import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import M5Indexes from '@components/m5/indexes';
import '@components/m5/style/components/indexes.scss';
import '@components/m5/style/components/search-bar.scss';
import '@components/m5/style/components/list.scss';
import '@components/m5/style/components/toast.scss';
import cities from './cities.json'


export default class checkCity extends React.Component {
  state = {
    list: [],
  }

  componentWillMount() {
    let letterCities =  this.transformCities(cities.cts).letterMap
    console.log(cities)
    console.log(this.transformCities(cities.cts))
    let lists = [];
    for(let key in letterCities){
      let obj={};
      obj.title = key
      obj.key = key
      obj.items = letterCities[key]
      lists.push(obj)
    }
    this.setState({list: lists});
    console.log(lists);
  }

  transformCities = (cities)=> {
    const nameMap = {};
    const idMap = {};
    const letterMap = {};
    for (let charCode = 65; charCode <= 90; charCode++) {
      letterMap[String.fromCharCode(charCode)] = [];
    }
    for (let i = 0, l = cities.length; i < l; i++) {
      const city = cities[i];
      nameMap[city.nm] = city;
      idMap[city.id] = city;
      letterMap[city.py[0].toUpperCase()].push(city);
    }
  
    Object.keys(letterMap).forEach(key => {
      if (!letterMap[key].length) {
        delete letterMap[key];
      }
    });
  
    return {
      nameMap,
      idMap,
      letterMap,
    };
  }

  render() {
    const {list} = this.state;
    return (
      <View>
        <M5Indexes list={list}></M5Indexes>
      </View>
    )
  }
}