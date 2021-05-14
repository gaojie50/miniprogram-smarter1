import React from 'react';
import { View, Image, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import utils from '@utils/index.js';
import ArrowLeft from '@static/detail/arrow-left.png';
import M5Indexes from '@components/m5/indexes';
import '@components/m5/style/components/indexes.scss';
import '@components/m5/style/components/search-bar.scss';
import '@components/m5/style/components/list.scss';
import '@components/m5/style/components/toast.scss';
import { get as getGlobalData } from '../../global_data';
import cities from './commonCity.json'
import './index.scss'


export default class checkCity extends React.Component {
  constructor(props){
    super(props);
    const url = Taro.getCurrentPages();
    const options = url[url.length - 1].options;
    this.fromUrl = decodeURIComponent(options.fromUrl);
    this.state = {
      list: [],
      // name: options.name,
      // projectId: options.projectId,
      // isMovieScreening: (options.isMovieScreening == 'true'),
    }
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
  handleBack = () => {
    Taro.redirectTo({
      url: this.fromUrl,
    })
  }

  handleCity = (item) => {
    // console.log(this.fromUrl);
    // console.log(this.fromUrl.replace(/cityName=\p{Unified_Ideograph}/u, `cityName=${item.name}`));
    Taro.redirectTo({
      url: this.fromUrl.replace(/cityId=(\d*)/, `cityId=${item.id}`).replace(/cityName=(\p{Unified_Ideograph}*)/u, `cityName=${item.name}`),
    })
  }

  render() {
    const {list} = this.state;
    const systemInfo = Taro.getSystemInfoSync();
    const { rpxTopx } = utils;
    const capsuleLocation = getGlobalData('capsuleLocation');
    const headerBarHeight = capsuleLocation.bottom + rpxTopx(15);
    return (
      <View>
        <View className='detail-top' style={{ height: `${headerBarHeight}px` }}>
          <View className='top'>
            <View className='header'>
              <View className='backPage' onClick={()=>this.handleBack()}>
                <Image src={ArrowLeft}></Image>
              </View>
              <Text className='header-title'>选择城市</Text>
            </View>
          </View>
        </View>
        <ScrollView scrollY style={{ height: `${systemInfo.windowHeight - headerBarHeight}px`, marginTop: headerBarHeight}}>
          <M5Indexes list={list} onClick={this.handleCity.bind(this)}></M5Indexes>
        </ScrollView>
      </View>
    )
  }
}