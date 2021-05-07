import React, { useState,useEffect } from 'react';
import { View, Image, Text } from '@tarojs/components';
import FloatLayout from '@components/m5/float-layout';
import reqPacking from '@utils/reqPacking.js';
import './index.scss';

const toFixed = (num, precision) => (+(`${Math.round(+(`${num}e${precision}`))}e${-precision}`)).toFixed(precision);

export default function CoreSection({ categoryType, core, permissions,projectId,roundId }) {
  const [showProgress, setShowProgress] = useState(false);
  const [itemLimit, setItemLimit] = useState(5);
  const clacScore = (arrOut = [], digits = 1) => {
    const arr = arrOut.filter(item => item);

    if (!arr || arr.length == 0) return;

    if (arr.every(item => item === null)) {
      return {
        min: "-",
        max: "-",
        average: "-"
      };
    }

    let max = 0;
    let min = 0;
    const toDigits = num => {
      if (digits === 1) return toFixed(num, 1);
      if (digits === 2) return Math.floor(num * 100) / 100;

      return Number(num.toFixed(digits));
    };
    const total = arr.reduce((acc, value, index) => {
      const val = Number(value);
      acc += val;

      if (index == 0) {
        max = val;
        min = val;
      }

      if (val > max) max = val;
      if (val < min) min = val;
      return acc;
    }, 0);

    const average = total / arr.length;

    return {
      max: toDigits(max),
      min: toDigits(min),
      average: toDigits(average),
    };
  };

  const clacFieldNumObj = arr => {
    return arr.reduce((prev, next) => {
      prev[next] = (prev[next] + 1) || 1;
      return prev;
    }, {});
  };
  const [packUp, setPackUp] = useState(true);
  let evaluationList = core.evaluationList || [];
  let recommendedList = core.recommendedList || [];
  let commentList = core.commentList || [];

  let [scoreArr,setScoreArr] = useState([]);
  let [totalScoreArr,setTotalScoreArr] = useState([]);
  let [boxArr,setBoxArr]= useState([]);
  let [recommendedArr,setRecommendedArr]= useState([]);
  let [commentArr,setCommentArr]= useState([]);
  let [groupSetObj,setGroupSetObj] = useState({});
  const total = evaluationList.length;

  useEffect(function(){
    let innerGroupSetObj = {};
    let innerScoreArr = [];
    let innerTotalScoreArr=[];
    let innnerBoxArr = [];
    let innerRecommendedArr = [];
    let innerCommentArr = [];

    evaluationList.map(item => {
      const {
        score, totalScore, box, comment, evaluation, groupName, scoreFinished,isHidden
      } = item;
  
      if(!isHidden) innerScoreArr.push(score);
  
      if (!isHidden && scoreFinished !== false) innerTotalScoreArr.push(totalScore);
  
      if(!isHidden) innnerBoxArr.push(box);
      innerCommentArr.push(evaluation);
      innerRecommendedArr.push(comment);
  
      if (!innerGroupSetObj[groupName]) {
        innerGroupSetObj[groupName] = [item];
  
        return item;
      }
      innerGroupSetObj[groupName].push(item);
  
      return item;
    });

    setScoreArr(innerScoreArr);
    setTotalScoreArr(innerTotalScoreArr);
    setBoxArr(innnerBoxArr);
    setRecommendedArr(innerRecommendedArr);
    setCommentArr(innerCommentArr);

    setGroupSetObj(innerGroupSetObj);
  },[core])

  useEffect(function(){
    let arr = [];
    let innerScoreArr = [];
    let innerTotalScoreArr=[];
    let innnerBoxArr = [];

    Object.values(groupSetObj).map(item => arr.push(...item));
    
    arr.map(({score,isHidden,totalScore,box,scoreFinished}) =>{
      if(!isHidden) innerScoreArr.push(score);
  
      if (!isHidden && scoreFinished !== false) innerTotalScoreArr.push(totalScore);
  
      if(!isHidden) innnerBoxArr.push(box);
    });
    
    setScoreArr(innerScoreArr);
    setTotalScoreArr(innerTotalScoreArr);
    setBoxArr(innnerBoxArr);
  },[groupSetObj])

  const recommendedNumList = recommendedList.map(item => {
    const num = clacFieldNumObj(recommendedArr)[item] || 0;

    return { title: item, num, ratio: `${Math.round(num / total * 1000) / 10}%` };
  });

  const commentNumList = commentList.map(item => {
    const num = clacFieldNumObj(commentArr)[item] || 0;

    return { title: item, num, ratio: `${Math.round(num / total * 1000) / 10}%` };
  });

  const groupSetArr = up => {
    if (!up) return Object.keys(groupSetObj).map(item => ({ groupName: item, list: groupSetObj[item] }));
    let num = 0;

    return Object.keys(groupSetObj).reduce((acc, item) => {
      if (num >= itemLimit) return acc;

      acc.push({
        groupName: item,
        list: num + groupSetObj[item].length <= itemLimit ? groupSetObj[item] : groupSetObj[item].filter((v, i) => i < itemLimit - num),
      });

      num += groupSetObj[item].length;
      return acc;
    }, []);
  };

  const toDetails = () => {
    if (permissions) setItemLimit(9999);
    setShowProgress(true);
  }

  const shrinkEvt = () => setPackUp(!packUp);
  const scoreExistSign = scoreArr.some(item => item);
  const commentExistSign = commentNumList.length != 0;
  const controlData = (isHidden,userId,groupName) => {
    reqPacking({
      url: 'api/applet/management/hiddenScore',
      data: {
        projectId,
        roundId,
        isHidden,
        userId
      }
    }).then(res => {
      const { error } = res;
      if(!error){
        let innnerGroup = {};
        innnerGroup[groupName] = groupSetObj[groupName].map(item => {
          if(item.userId == userId) item.isHidden = isHidden;
          return item;
        });

        setGroupSetObj(Object.assign({},groupSetObj,innnerGroup));
      }
    })
  }
  const detailCont = () => {
    if (categoryType == 1 || categoryType == 2) {
      return <View className="table-wrap">
        <View className="table column2">
          <View className="thead">
            <View className="tr">
              <Text className="th">评估人</Text>
              <Text className="th">总得分</Text>
              {permissions ? <Text className="th">推荐程度</Text> : ""}
            </View>
          </View>
          <View className="tbody">
            {groupSetArr(packUp).map(({ groupName, list }, index) =>
              <React.Fragment key={index}>
                <View className="tr groupName">{groupName}</View>
                {list.map(({
                  name, totalScore, scoreFinished, score, isHidden, userId,
                }, turn) => <View key={turn} className={`tr ${isHidden ? "hidden-color" : ""} ${list.length == turn + 1 ? "no-line" : ""}`}>
                    <Text className="td">{name}</Text>
                    <Text className="td">
                      {
                        scoreExistSign ? (
                          score || score === 0 ? score : '-'
                        ) :
                          (
                            scoreFinished === false ? '未完成' : totalScore
                          )
                      }
                    </Text>
                    {
                      permissions ? <View className="td control-btn" onClick={() => controlData(!isHidden,userId,groupName)}>{
                        isHidden ? <Image className="control-icon" src="https://p0.meituan.net/ingee/89bb33cbda2a92c06d24395f402555aa700.png" /> :
                          <Image className="control-icon" src="https://p0.meituan.net/ingee/0e9248e47bdc5311effa23a0f2953594797.png" />
                      }</View> : ""
                    }
                  </View>)}

              </React.Fragment>)}
            {total > itemLimit ? <View className="tr shrink" onClick={shrinkEvt}>{packUp ? `展开剩余${total - itemLimit}条` : "收起"}<Image className="arrow" src="../../static/arrow-down.png" /></View> : null}
          </View>
        </View>
      </View>;
    };

    return <View className="table-wrap">
      <View className={`table ${commentExistSign ? `column5` : `column3`}`}>
        <View className="thead">
          <View className="tr">
            <Text className="th">评估人</Text>
            <Text className="th">{scoreExistSign ? "预估评分" : "总得分"}</Text>
            <Text className="th">预估票房</Text>
            {
              permissions ? <Text className="th">推荐程度</Text> :
                commentExistSign ? <React.Fragment>
                  <Text className="th">整体评价</Text>
                  <Text className="th">推荐程度</Text>
                </React.Fragment> : null
            }
          </View>
        </View>
        <View className="tbody">
          {groupSetArr(packUp).map(({ groupName, list }, index) =>
            <React.Fragment key={index}>
              <View className="tr groupName">{groupName}</View>
              {list.map(({
                name, score, box, comment, evaluation, totalScore, scoreFinished, isHidden, userId,
              }, turn) => <View key={turn} className={`tr ${isHidden ? "hidden-color" : ""} ${list.length == turn + 1 ? "no-line" : ""}`}>
                  <Text className="td">{name}</Text>
                  <Text className="td">
                    {
                      scoreExistSign ? (
                        score || score === 0 ? score : '-'
                      ) :
                        (
                          scoreFinished === false ? '未完成' : totalScore
                        )
                    }
                  </Text>
                  <Text className="td">{box === null ? "-" : `${box}亿`}</Text>
                  {
                    permissions ?
                      <View className="td control-btn" onClick={() => controlData(!isHidden,userId,groupName)}>{
                        isHidden ? <Image className="control-icon" src="https://p0.meituan.net/ingee/89bb33cbda2a92c06d24395f402555aa700.png" /> :
                          <Image className="control-icon" src="https://p0.meituan.net/ingee/0e9248e47bdc5311effa23a0f2953594797.png" />
                      }</View> :
                      commentExistSign ? <React.Fragment>
                        <Text className="td">{comment}</Text>
                        <Text className="td">{evaluation}</Text>
                      </React.Fragment> : null
                  }
                </View>)}

            </React.Fragment>)}
          {total > itemLimit ? <View className="tr shrink" onClick={shrinkEvt}>{packUp ? `展开剩余${total - itemLimit}条` : "收起"}<Image className="arrow" src="../../static/arrow-down.png" /></View> : null}
        </View>
      </View>
    </View>
  }

  return <View className="coreSection-wrap">
    <View className="h5">1、核心数据
      {
        permissions ? <Text className="detail" onClick={toDetails}>评估详情 <Text className="arrow" /></Text> : ''
      }
    </View>
    {categoryType == 1 || categoryType == 2 ?
      <View>
        <Box
          colorArr={[255, 144, 52]}
          width="100%"
          headTitle="总得分"
          scoreObj={clacScore(totalScoreArr, 1)} />
        {
          permissions ?
            <FloatLayout
              isOpened={showProgress}
              title="核心数据"
              className='layout-process core-process'
              onClose={() => setShowProgress(false)}>
              <View className="core-tip">评估信息隐藏后仅自己可见，且不计入总平均值</View>
              {detailCont()}
            </FloatLayout> : detailCont()
        }
      </View> :
      <View>
        <View className="box-wrap">
          <Box
            colorArr={[255, 144, 52]}
            commentExistSign={commentExistSign}
            width="335rpx"
            headTitle={scoreExistSign ? "预估评分" : "总得分"}
            scoreObj={clacScore(scoreExistSign ? scoreArr : totalScoreArr, 1)} />
          <Box
            colorArr={[241, 48, 61]}
            commentExistSign={commentExistSign}
            width="335rpx"
            headTitle="预估票房(亿元)"
            scoreObj={clacScore(boxArr, 2)} />
        </View>
        {commentExistSign ? <React.Fragment>
          <ProcessBox colorArr={[72, 195, 29]} list={recommendedNumList} headTitle="整体评价" />
          <ProcessBox colorArr={[24, 144, 255]} list={commentNumList} headTitle="推荐程度" />
        </React.Fragment> : ""}
        {
          permissions ?
            <FloatLayout
              isOpened={showProgress}
              title="核心数据"
              className='layout-process core-process'
              onClose={() => setShowProgress(false)}>
              <View className="core-tip">评估信息隐藏后仅自己可见，且不计入总平均值</View>
              {detailCont()}
            </FloatLayout> : detailCont()
        }
      </View>
    }
  </View>
}

const colorCalc = (arr, opacity = 1) => `rgba(${arr.join(',')},${opacity})`;

function Box({
  colorArr = [255, 144, 52], width = "100%", scoreObj = {}, headTitle,
}) {
  const { max, min, average } = scoreObj;
  const limitValHidden = max == min && min == average;

  return <View className="core-box"
    style={{
      width,
      backgroundColor: `${colorCalc(colorArr, 0.1)}`
    }}>
    <View className="h5">{headTitle}</View>
    <View className="dl">
      <View className="dt" style={{ color: `${colorCalc(colorArr)}` }}>{!average && average !== 0 ? '-' : average}</View>
      <View className="dt">
        {limitValHidden ? "" : <Text className="dd">最高{max}</Text>}
        {limitValHidden ? "" : <Text className="dd">最低{min}</Text>}
      </View>
    </View>
  </View>;
}

function ProcessBox({ colorArr, list = [], headTitle }) {
  const innerList = list.filter(item => item.num);

  return <View className="process-box"
    style={{ backgroundColor: `${colorCalc(colorArr, 0.1)}` }}>
    <View className="h5">{headTitle}</View>
    <View className="ul">
      {innerList.map(({ title, ratio, num }, index) => <View className="li" key={index}>
        <Text className="span item-name">{title}</Text>
        <Text className="span process-num">{ratio} {num}人</Text>
        <View className="process-item">
          <View className="inner" style={{ width: `${ratio}`, backgroundColor: `${colorCalc(colorArr)}` }} />
        </View>
      </View>)}
    </View>
  </View>;
}