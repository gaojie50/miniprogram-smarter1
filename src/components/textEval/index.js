import React, { useState } from 'react';
import { View, Image, Text, Textarea } from '@tarojs/components';
import FloatLayout from '@components/m5/float-layout';
import Taro from '@tarojs/taro';
import reqPacking from '@utils/reqPacking.js';
import utils from '@utils/index';
import './index.scss';

const {formatNumber} = utils;
export default function TextEval({
  title,
  questionNum,
  texts,
  permissions,
  resultPageTextTitleEditingGuideState,
  setResultPageTextTitleEditingGuideState,
  isAppendContent,
  summaryText,
  isTopic,
  projectId,
  roundId,
  type,
  questionId,
  rightText,
}) {
  const [packUp, setPackUp] = useState(true);
  const shrinkEvt = () => setPackUp(!packUp);
  const [showProgress, setShowProgress] = useState(false);
  const [itemLimit, setItemLimit] = useState(5);
  let joinNum = 0;
  let summary = 0;
  let  allMemberList = [];
  const total = texts.reduce((acc, val) => {
    acc += val.memberList.length;
    
    if(val.memberList?.length) allMemberList.push(...val.memberList);

    val?.memberList?.map(item => {
      if(item.content || item.content === 0) {
        if(isTopic) summary += Number(item.content);
        joinNum += 1;
      };
    });

    return acc;
  }, 0);
  const [describe, setDescribe] = useState(summaryText || allMemberList.reduce((acc,val) =>{
    const {name,content} = val;
    
    if(content) acc += `- ${content}\n`;
    return acc;
  },""));

  const textsHandle = up => {
    if (!up) return texts;
    let num = 0;

    return texts.reduce((acc, item) => {
      if (num >= itemLimit) return acc;

      acc.push(num + item.memberList.length <= itemLimit ? item : {
        groupName: item.groupName,
        memberList: item.memberList.filter((v, i) => i < itemLimit - num)
      });

      num += item.memberList.length;
      return acc;
    }, []);
  };

  const inputDescribe = ({ detail }) => setDescribe(detail.value);

  const blurEvent = () => {
    reqPacking({
      url: 'api/applet/management/update',
      data: {
        projectId,
        roundId,
        texts:{
          type,
          questionId,
          'content':describe
        },
        isAppendContent,
      }
    }).then(res => {
      const { error } = res;

      if(error){
        Taro.showToast({
          title: error.message||'请求失败',
          icon: 'none',
          duration: 2000
        });
      }
    })

  };

  const focusEvent = () => {
    if (!resultPageTextTitleEditingGuideState) {
      setResultPageTextTitleEditingGuideState(true);
      Taro.setStorageSync('ResultPageTextTitleEditingGuide', true);
    }
  }

  const toDetails = () => {
    if (permissions || isTopic) setItemLimit(9999);
    setShowProgress(true);
  }

  const detailCont = () => {
    return <View className="table-wrap">
      <View className="table">
        <View className="thead">
          <View className="tr">
            <Text className="th">评估人</Text>
            <Text className="th">评估内容</Text>
          </View>
        </View>
        <View className="tbody">
          {textsHandle(packUp).map(({ groupName, memberList }, turn) =>
            <React.Fragment key={turn}>
              <View className="tr groupName">{groupName}</View>
              {memberList.map(({ name, content }, index) =>
                <View key={index} className={`tr tr-line ${memberList.length == index + 1 ? "no-line" : ""}`}>
                  <Text className="td">{name}</Text>
                  <Text className="td">{content}</Text>
                </View>)}
            </React.Fragment>)}
          {total > itemLimit ? <View className="tr shrink" onClick={shrinkEvt}>{packUp ? `展开剩余${total - itemLimit}条` : "收起"}<Image className="arrow" src="../../static/arrow-down.png" /></View> : null}
        </View>
      </View>
    </View>;
  }
  return <View className="textEval-wrap">
    <View className={`h5 ${(permissions) ? "rich" : ""}`}>
      {questionNum}、{title}
      {
        permissions ?
          <Text className="detail" onClick={toDetails}>评估详情 <Text className="arrow" /></Text> : ''
      }
    </View>
    {isTopic ? 
     <View className="filling">
       评估均值 <Text className="join">(共{joinNum}人参与)</Text>
       <Text className="val">{formatNumber(summary/joinNum).text} {rightText}</Text>
     </View>:
      (permissions ?
        <View className="textarea-wrap">
          {
            !resultPageTextTitleEditingGuideState ? <Image className="editable" src="https://s3plus.meituan.net/v1/mss_e2821d7f0cfe4ac1bf9202ecf9590e67/cdn-prod/file:96011a7c/editable.svg" /> : ""
          }
          <Textarea
            className="textarea"
            onInput={inputDescribe}
            onBlur={blurEvent}
            onFocus={focusEvent}
            value={describe}
            placeholderStyle={'color:#ccc;'}
            placeholder="暂无汇总内容" />
        </View> : detailCont())
    }

    <FloatLayout
      isOpened={showProgress}
      title={title}
      className='layout-process'
      onClose={ () => setShowProgress(false) }>
      {detailCont()}
    </FloatLayout>
  </View>;
}
