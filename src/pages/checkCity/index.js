import React from 'react';
import { View, Image, Text, ScrollView } from '@tarojs/components';
import Taro, { redirectTo } from '@tarojs/taro';
import utils from '@utils/index.js';
import ArrowLeft from '@static/detail/arrow-left.png';
import M5Indexes from '@components/m5/indexes';
import '@components/m5/style/components/indexes.scss';
import '@components/m5/style/components/search-bar.scss';
import '@components/m5/style/components/list.scss';
import '@components/m5/style/components/toast.scss';
import { set as setGlobalData, get as getGlobalData } from '../../global_data';
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
    }
  }

  componentWillMount() {
    let letterCities =  this.transformCities(cities.cts).letterMap
    let lists = [{key: "全国", title: "全国", items: [{id: '', name: "全国", py: "qunguo"}]}];
    for(let key in letterCities){
      let obj={};
      obj.title = key
      obj.key = key
      obj.items = letterCities[key]
      lists.push(obj)
    }
    this.setState({list: lists});
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
    if (/^\/pages\/hotMovieSortingList\/index\/index/.test(this.fromUrl)) {
      // 热映影片排序页属于tabbar页 需使用switchTab
      Taro.switchTab({
        url: this.fromUrl,
      })
    } else {
      Taro.redirectTo({
        url: this.fromUrl,
      });
    }
  }

  handleCity = (item) => {
    let redirectUrl = "";
    if (/cityId=(\d*)/.test(this.fromUrl) && (/cityName=(\p{Unified_Ideograph}*)/u).test(this.fromUrl)) {
      redirectUrl = this.fromUrl.replace(/cityId=(\d*)/, `cityId=${item.id}`).replace(/cityName=(\p{Unified_Ideograph}*)/u, `cityName=${item.name}`);
    } else {
      let concat = this.fromUrl.indexOf('?') > -1 ? `&` : '?';
      redirectUrl = this.fromUrl + concat + `cityId=${item.id}&cityName=${item.name}`;
    }
    if (/^\/pages\/hotMovieSortingList\/index\/index/.test(this.fromUrl)) {
      // 热映影片排序页属于tabbar页 需使用switchTab
      setGlobalData('hotMovieSortingListQuery', { cityId: item.id, cityName: item.name });
      Taro.switchTab({
        url: this.fromUrl,
      })
    } else {
      Taro.redirectTo({
        url: redirectUrl,
      });
    }
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