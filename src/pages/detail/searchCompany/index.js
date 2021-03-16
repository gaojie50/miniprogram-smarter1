import React, { useState, useEffect } from 'react';
import { View, ScrollView, Image, Radio, Text, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import reqPacking from '@utils/reqPacking.js';
import './index.scss';

export default function SearchCompany() {
  const [focus, setFocus] = useState(false);
  const [type, setType] = useState('producer');
  const [firstDataList, setFirstDataList] = useState([]);

  useEffect(()=>{
    const pages =Taro.getCurrentPages();
    const current = pages[pages.length - 1];
    const eventChannel = current.getOpenerEventChannel();
    eventChannel.on("acceptDataFromOpenerPage",(res)=>{
      console.log(res,999)
      if(res.type) {
        setType(res.type)
      }
      if(res.data) {
        setFirstDataList(res.data[res.type])
      }
    })
  },[])

  const handleSearch = value => {
    console.log(value,12455)
    requestSearch({value})
    .then(res => {
      console.log(res,236666)
    })
  }
  console.log(firstDataList, type)
  return (
    <View className="edit-search-company"> 
      <View className="edit-search-company-box">
        <View className="edit-search-company-wrap">
          <View className="edit-search-company-bar" style={{width: focus ? '612rpx' : '690rpx'}}>
            <Image src="../../../static/icon/search.png" alt=""></Image>
            <Input onChange={value => {console.log(11233);handleSearch(value)}} placeholder="搜索并添加出品方" onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} className="edit-search-company-bar-input"></Input>
            {focus ? <View className="cancel">取消</View> : null}
          </View>
        </View>
      </View>
      <ScrollView scrollY className="edit-rearch-result">
        {
          firstDataList.length > 0 && firstDataList.map((item, index) => {
            return <View className="edit-rearch-result-item" key={ index }>
              <Radio color="#F1303D" />
              <View className="right">
                <label className="border main">
                  <Image></Image>
                </label>
                <View className="content">
                  <View className="name">{item.name}</View>
                  {/* <View className="describe"></View>
                  <View className="describe"></View> */}
                </View>
                <View className="last">
                  <Image src="../../../static/detail/company-edit.png" alt=""></Image>
                </View>
              </View>
            </View>
          })
        }
      </ScrollView>
    </View>
  )
}

function requestSearch({keyword = ''}) {
  return reqPacking({
    url: 'api/company/search',
    data: {
      keyword
    }
  }).then(res => res)
}



