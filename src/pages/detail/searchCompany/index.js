import React, { useState, useEffect } from 'react';
import { View, ScrollView, Image, Radio, Text, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import reqPacking from '@utils/reqPacking.js';
import AtActionSheet from '@components/m5/action-sheet';
import AtActionSheetItem from '@components/m5/action-sheet/body/item';
import './index.scss';

export default function SearchCompany() {
  const [focus, setFocus] = useState(false);
  const [type, setType] = useState('producer');
  const [inputValue, setInputValue] = useState('');

  const [firstDataList, setFirstDataList] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [list, setList] = useState([]);

  const [openSheet, setOpenSheet] = useState(false);
  const [main, setMain] = useState(0);
  const [checkedList, setCheckedList] = useState([0]);

  useEffect(()=>{
    const pages =Taro.getCurrentPages();
    const current = pages[pages.length - 1];
    const eventChannel = current.getOpenerEventChannel();
    eventChannel.on("acceptDataFromOpenerPage",(res)=>{
      if(res.type) {
        const title = res.type === 'producer' ? '出品方' : '发行方';
        Taro.setNavigationBarTitle({title});
        setType(res.type)
      }
      if(res.data) {
        setFirstDataList(res.data[res.type])
        setList(res.data[res.type])
      }
    })
  },[])

  const handleSearch = e => {
    setInputValue(e.detail.value);
    requestSearch({keyword: e.detail.value})
    .then(res => {
      const { success, data, error } = res;
      if(success) {
        setSearchResult(data.respList);
        setList(data.respList)
      } else {
        wx.showToast({
          title: error.message,
          icon: 'none',
        })
      }
    })
  }

  const selectedList = (item, index) => {
    console.log(item, index)
    const select = [];
    select.push(index);
    setCheckedList(select);
  }

  const submit = () => {

  }
  console.log(openSheet)
  return (
    <View className="edit-search-company"> 
      <View className="edit-search-company-box">
        <View className="edit-search-company-wrap">
          <View className="edit-search-company-bar" style={{width: focus || inputValue !== '' ? '612rpx' : '690rpx'}}>
            <Image src="../../../static/icon/search.png" alt=""></Image>
            <Input value={inputValue} onInput={e => handleSearch(e)} placeholder={type === 'producer' ? '搜索并添加出品方' : '搜索并添加发行方'} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} className="edit-search-company-bar-input"></Input>
            {focus || inputValue !== '' ? <View className="cancel" onClick={()=> setInputValue('')}>取消</View> : null}
          </View>
        </View>
      </View>
      <ScrollView scrollY className="edit-rearch-result">
        {
          list.length > 0 && list.map((item, index) => {
            return <View className="edit-rearch-result-item" key={ index }>
              <Radio color="#F1303D" onClick={() => selectedList(item,index)} checked={checkedList.indexOf(index) !== -1} />
              <View className="right">
                <label className={(main === index) && (inputValue === '') ? "border main" : "border"}>
                  <Image></Image>
                </label>
                <View className="content">
                  <View className="name">{item.name}</View>
                  {/* <View className="describe"></View>
                  <View className="describe"></View> */}
                </View>
                {
                  inputValue === '' ? 
                  <View className="last" onClick={() => {console.log(666);setOpenSheet(true)}}>
                    <Image src="../../../static/detail/company-edit.png" alt=""></Image>
                  </View> : null
                }
              </View>
            </View>
          })
        }
      </ScrollView>
      <AtActionSheet isOpened={openSheet}>
        <AtActionSheetItem>1123</AtActionSheetItem>
      </AtActionSheet>
      <View className="bottom-confirm">
        <View className="bottom-confirm-btn" onClick={submit}>确定</View>
      </View>
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



