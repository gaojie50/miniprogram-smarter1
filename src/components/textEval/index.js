import React, { useState } from 'react';
import { View, Image,Text} from '@tarojs/components';
import './index.scss';

const ItemLimit = 5;
export default function TextEval({ title, questionNum, texts }) {
  const [ packUp, setPackUp ] = useState(true);

  const shrinkEvt = () => setPackUp(!packUp);
  const total = texts.reduce((acc, val) => {
    acc += val.memberList.length;
    return acc;
  }, 0);

  const textsHandle = up => {
    if (!up) return texts;
    let num = 0;

    return texts.reduce((acc, item) => {
      if (num >= ItemLimit) return acc;

      acc.push(num + item.memberList.length <= ItemLimit ? item : {
        groupName: item.groupName,
        memberList: item.memberList.filter((v, i) => i < ItemLimit - num)
      });

      num += item.memberList.length;
      return acc;
    }, []);
  };

  return <View className="textEval-wrap">
    <View className="h5">{questionNum}、{title}</View>

    <View className="table-wrap">
      <View className="table">
        <View className="thead">
          <View className="tr">
            <Text className="th">评估人</Text>
            <Text className="th">评估内容</Text>
          </View>
        </View>
        <View className="tbody">
          {textsHandle(packUp).map(({ groupName, memberList }, turn) =>
            <React.Fragment key={ turn }>
              <View className="tr groupName">{groupName}</View>
              {memberList.map(({ name, content }, index) =>
                <View key={ index } className={ `tr tr-line ${memberList.length == index + 1 ? "no-line" : ""}` }>
                  <Text className="td">{name}</Text>
                  <Text className="td">{content}</Text>
                </View>)}
            </React.Fragment>)}
          {total > ItemLimit ? <View className="tr shrink" onClick={ shrinkEvt }>{packUp ? `展开剩余${total - ItemLimit}条` : "收起"}<Image className="arrow" src="../../static/arrow-down.png" /></View> : null}
        </View>
      </View>
    </View>
  </View>;
}
