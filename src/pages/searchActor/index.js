import React, { useState, useEffect } from 'react';
import { View, ScrollView, Image, Radio, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import reqPacking from '@utils/reqPacking.js';
import util from '@utils';
import { defaultMovieCover } from '@utils/imageUrl';
import './index.scss';

const { debounce } = util;
const types = {
  director: '导演',
  protagonist: '主演',
}

export default function SearchActor() {
  const [focus, setFocus] = useState(false);
  const [type, setType] = useState('director');
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const [firstDataList, setFirstDataList] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [list, setList] = useState([]);
  const [radioChecked, setRadioChecked] = useState([]);
  const [searchChecked, setSearchChecked] = useState([]);
  const [refresh,setRefresh] = useState(false);

  useEffect(()=>{
    const pages =Taro.getCurrentPages();
    const current = pages[pages.length - 1];
    const eventChannel = current.getOpenerEventChannel();

    eventChannel.on("acceptDataFromOpenerPage",(res)=>{
      if(res.type) {
        const title = types[res.type];
        Taro.setNavigationBarTitle({title});
        setType(res.type);
      }
      if(res.data) {
        setFirstDataList(res.data[res.type] || []);
        setList(res.data[res.type] || []);
        res.data[res.type] && res.data[res.type].map((item, index) => {
          radioChecked.push(index);
        });

        setRadioChecked(radioChecked);
        setRefresh(!refresh);
      }
    })
  },[])

  const handleSearch = debounce(e => {
    if(e.detail.value.trim() === '') {
      setInputValue(''); 
      setList(firstDataList);
      setSearchChecked([]);
      
      return;
    };

    setLoading(true);
    setInputValue(e.detail.value);
    setList([]);
    requestSearch({keyword: e.detail.value})
    .then(res => {
      const { success, data, error } = res;
      if(success) {
        setSearchResult(data);
        setList(data);
      } else {
        wx.showToast({
          title: error.message,
          icon: 'none',
        })
      }
      setLoading(false)
    })
  })

  const selectedList = (item, index) => {
    const subChecked = inputValue === '' ? radioChecked : searchChecked;
    const select = JSON.parse(JSON.stringify(subChecked));
    const _index = select.indexOf(index);
    if(_index === -1) {
      select.push(index);
    } else {
      select.splice(_index, 1);
    }
    if(inputValue === '') {
      setRadioChecked(select);
    } else {
      setSearchChecked(select);
    }
  }

  const submit = () => {
    if(inputValue !== '') {
      
      searchChecked.map((item) => {
        for(let i =0; i<firstDataList.length; i++) {
          if(firstDataList[i].maoyanId === list[item].maoyanId) {
            return
          }
        }

        radioChecked.push(firstDataList.length);
        firstDataList.push(list[item]);
        console.log(radioChecked, 334)
      })
      setList(firstDataList);
      setInputValue('');
      setSearchChecked([]);
    } else {
      const newList = list.filter((item, index) => radioChecked.indexOf(index) !== -1);
      const pages =Taro.getCurrentPages();
      const current = pages[pages.length - 1];
      const eventChannel = current.getOpenerEventChannel();

      eventChannel.emit('submitData', newList)
      Taro.navigateBack()
    }
  }

  return (
    <View className="search-actor"> 
      <View className="search-actor-box">
        <View className="search-actor-wrap">
          <View className="search-actor-bar" style={{width: focus || inputValue !== '' ? '612rpx' : '690rpx'}}>
            <Image src="../../static/icon/search.png" alt=""></Image>
            <Input value={inputValue} onInput={e => handleSearch(e)} placeholder={`搜索并添加${types[type]}`} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} className="search-actor-bar-input"></Input>
            {loading && (<View className="loading"><mpLoading type="circle" show={true} tips="" /></View>)}
            {(focus || inputValue !== '') ? <View className="cancel" onClick={()=> {setInputValue(''); setList(firstDataList);setSearchChecked([]);}}>取消</View> : null}
          </View>
        </View>
      </View>
      <ScrollView scrollY className="edit-rearch-result">
        {
          list.length > 0 && list.map((item, index) => {

            return <View className="edit-rearch-result-item" key={ index }>
              <Radio color="#F1303D" onClick={() => selectedList(item,index)} checked={ (inputValue === '' && radioChecked.indexOf(index) !== -1) || (inputValue !== '' && searchChecked.indexOf(index) !== -1) ? true : ''} />
              <View className="right">
                <label className="border">
                  <Image src={item.pic ? item.pic.replace(/w.h\//, '') : defaultMovieCover}></Image>
                </label>
                <View className="content">
                  <View className="name" style={{marginBottom: item.roleStr || item.representativeWork  ? '20rpx' : '0'}}>{item.name}</View>
                  <View className="describe">{item.roleStr && item.roleStr.join('/')}</View>
                  <View className="describe">{item.representativeWork && item.representativeWork.map(v => `《${v}》`)}</View>
                </View>
                {/* <View className="last" onClick={() => {setOpenSheet(true);setOpenIndex(index)}}>
                  <Image src="../../static/detail/company-edit.png" alt=""></Image>
                </View> */}
              </View>
            </View>
          })
        }
      </ScrollView>
      <View className="bottom-confirm">
        <View className="bottom-confirm-btn" onClick={submit}>确定（{inputValue === '' ? radioChecked.length : searchChecked.length}）</View>
      </View>
    </View>
  )
}

function requestSearch({keyword = ''}, type = 105) {
  return reqPacking({
    url: 'api/home/search',
    data: {
      keyword,
      type,
    }
  }).then(res => res)
}



