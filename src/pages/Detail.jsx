import React, { useLayoutEffect, useState, useEffect } from 'react';
import styled from 'styled-components';
import defaultImg from '../assets/img/pill_image.png';
import star1Img from '../assets/img/Star1.png';
import star2Img from '../assets/img/Star2.png';
import { ReactComponent as Pick } from '../assets/img/pick.svg';
import { useLocation } from 'react-router';
import qs from 'qs';

// 그래프 라이브러리
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

// 컴포넌트
import TabBar from '../components/common/Tabbar';

const GraphTop3 = ({ medicineInfo }) => {
  const [totalWeight, setTotalWeight] = useState(0);

  // 전체 무게 초기화
  let addedNumber = 0;

  // top1
  const [topNumberNum, setTopNumberNum] = useState(0);
  const [topNumberName, setTopNumberName] = useState('');

  let topNumberNumData = 0;
  let topNumberNameData = '';

  // top2
  const [topNO2Num, setTopNO2Num] = useState(0);
  const [topNO2Name, setTopNO2Name] = useState('');

  let topNO2NumData = 0;
  let topNO2NameData = '';

  // top3
  const [top3NumberNum, setTop3NumberNum] = useState(0);
  const [top3NumberName, setTop3NumberName] = useState('');

  let top3NumberNumData = 0;
  let top3NumberNameData = '';

  useEffect(() => {
    for (let i = 1; i < medicineInfo.materialName.length; i++) {
      addedNumber += Number(medicineInfo.materialName[i].분량);
    }
    // top1
    for (let i = 1; i < medicineInfo.materialName.length; i++) {
      if (Number(medicineInfo.materialName[i].분량) > topNumberNumData) {
        topNumberNumData = Number(medicineInfo.materialName[i].분량);
        topNumberNameData = medicineInfo.materialName[i].material;
      }
    }
    // top2
    for (let i = 1; i < medicineInfo.materialName.length; i++) {
      if (
        Number(medicineInfo.materialName[i].분량) > topNO2NumData &&
        Number(medicineInfo.materialName[i].분량) < topNumberNumData
      ) {
        topNO2NumData = Number(medicineInfo.materialName[i].분량);
        topNO2NameData = medicineInfo.materialName[i].material;
      }
    }

    // top3
    for (let i = 1; i < medicineInfo.materialName.length; i++) {
      if (
        Number(medicineInfo.materialName[i].분량) > top3NumberNumData &&
        Number(medicineInfo.materialName[i].분량) < topNO2NumData
      ) {
        top3NumberNumData = Number(medicineInfo.materialName[i].분량);
        top3NumberNameData = medicineInfo.materialName[i].material;
      }
    }
    //총 무게
    setTotalWeight(addedNumber);

    //top1
    setTopNumberNum(topNumberNumData);
    setTopNumberName(topNumberNameData);

    //top2
    setTopNO2Num(topNO2NumData);
    setTopNO2Name(topNO2NameData);

    //top3
    setTop3NumberNum(top3NumberNumData);
    setTop3NumberName(top3NumberNameData);
  }, []);
  return (
    <div className='graphTop3'>
      <div className='graphTop3Content'>
        <div className='graphTop3Material'>
          <div className='materialPercent'>
            {Math.round((topNumberNum / totalWeight) * 100)}%
          </div>
          <div className='materialName'>{topNumberName}</div>
        </div>
        <div className='graphTop3Material'>
          <div className='materialPercent'>
            {Math.round((topNO2Num / totalWeight) * 100)}%
          </div>
          <div className='materialName'>{topNO2Name}</div>
        </div>
        <div className='graphTop3Material'>
          <div className='materialPercent'>
            {Math.round((top3NumberNum / totalWeight) * 100)}%
          </div>
          <div className='materialName'>{top3NumberName}</div>
        </div>
      </div>
    </div>
  );
};

const BottomContents = ({ medicineInfo, query }) => {
  const [ContentDesc, setContentDesc] = useState('');

  useEffect(() => {
    switch (query) {
      case '용법 용량':
        setContentDesc(medicineInfo.udDocData);
        break;
      case '첨가물':
        setContentDesc(medicineInfo.ingrName);
        break;
      case '주의사항':
        setContentDesc(medicineInfo.nbDocData);
        break;
    }
  }, [query]);
  return (
    <div>
      {query === '효능 효과' ? (
        <div>{medicineInfo.eeDocData}</div>
      ) : (
        <>{ContentDesc}</>
      )}
    </div>
  );
};

const Detail = () => {
  const location = useLocation().pathname;
  const query = qs.parse(window.location.search, {
    ignoreQueryPrefix: true,
  }).tab;

  const medicineItem = {
    itemName: '타이레노오오오오올',
    itemImage:
      'https://s3-alpha-sig.figma.com/img/917a/ce7b/9262f5da2e74cdc931cf2bd206ad200a?Expires=1673827200&Signature=nEazUdsurlwUoj0vV8Tq-wHew19d0LJCoEcz2EPKB-xjLVp79AHdcbWgefejMlP9tpKV8S~EwOrPsPFxVXXeEzt01PSwL5hO-4yymSZtPb24keioTp0nCQYVTjYgBARSpVryPiZEq9HSX-AT0VFy3vgFpRu-5bv0Mo0I1NJwFKP1kodqHMeLLbQOkbMg7KIvqczdsBgqTL0rrKtK6hBc9dhCPQq58sGHeN7dSdbFFjtKm3Uj61IKyvC476xpocW6bkp2buhdiroQKWNL-BkxrN7y0b~Pgh8JUfX86xIDGhpDNdFPlF-mhTRwE7mc~ooM2aqbfNcWAM59xBUjvF8maA__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4',
    entpName: '삼진제약(주)',
    productType: '해열.진통.소염제',
    etcOtcCode: '일반의약품',
    eeDocData: '효능효과 블라블라',
    udDocData: '용법 용량',
    ingrName: '첨가물1, 첨가물2, 첨가물3',
    nbDocData: '주의 사항',
    materialName: [
      { 총량: '1정 중 1300밀리그램' },
      { material: '모르핀', 분량: '100', 단위: '밀리그램' },
      { material: '수면제', 분량: '200', 단위: '밀리그램' },
      { material: '마약', 분량: '500', 단위: '밀리그램' },
      { material: '미원', 분량: '400', 단위: '밀리그램' },
      { material: '설탕', 분량: '150', 단위: '밀리그램' },
    ],
  };

  // 그래프
  const medicine = [];

  useLayoutEffect(() => {
    // medicine에 속성 추가
    for (let i = 1; i < medicineItem.materialName.length; i++) {
      medicine.push(medicineItem.materialName[i]);
    }
  }, []);

  useLayoutEffect(() => {
    const root = am5.Root.new('chartdiv');

    // Set themes
    root.setThemes([am5themes_Animated.new(root)]);

    // Create chart
    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        innerRadius: am5.percent(50),
      })
    );

    // Create series
    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: '분량',
        categoryField: 'material',
        alignLabels: false,
      })
    );

    // series.labels.template.setAll({
    //   textType: "circular",
    //   centerX: 30,
    //   centerY: 0
    // });

    // 그래프 마우스 오버 시 툴팁
    series.slices.template.set('tooltipText', '{category}: {value}mg');

    series.data.setAll(medicine);

    // Create legend
    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        marginTop: 15,
        marginBottom: 15,
      })
    );

    legend.data.setAll(series.dataItems);
    legend.data.setAll(series.dataItems);

    // Play initial series animation
    series.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, []);

  return (
    <>
      <TopSection>
        <CardBox>
          <WrapContents>
            <Image src={defaultImg} alt='' />
            <Name>게보린정(수출명:돌로린정)</Name>
            <div className='labelWrap'>
              <LeftLabel>일반의약품</LeftLabel>
              <RightLabel>삼진제약(주)</RightLabel>
            </div>
            <Categorize>{medicineItem.productType}</Categorize>
            <ReviewWrap>
              <Star>
                <img src={star1Img} alt='' />
                <img src={star1Img} alt='' />
                <img src={star1Img} alt='' />
                <img src={star1Img} alt='' />
                <img src={star2Img} alt='' />
              </Star>
              <Review>(203개)</Review>
            </ReviewWrap>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Picked>
                <Pick />
              </Picked>
              <CompareBox>비교함 담기</CompareBox>
            </div>
          </WrapContents>
        </CardBox>
        <MiddleCardBox>
          <GraphLabel>성분 그래프</GraphLabel>
          <div id='chartdiv' />
        </MiddleCardBox>
        <RightCardBox>
          <GraphLabel>성분 상위 3개</GraphLabel>
          <GraphTop3 medicineInfo={medicineItem} />
        </RightCardBox>
      </TopSection>
      <TabBar location={location} query={query} />
      <BottomSection>
        <BottomContents medicineInfo={medicineItem} query={query} />
      </BottomSection>
    </>
  );
};

const TopSection = styled.div`
  width: 100%;
  display: flex;
`;

const BottomSection = styled.div`
  width: 1320px;
  height: 325px;
  border-radius: 23px;
  background-color: #ebebeb;
  display: flex;
  padding: 34px 30px;
`;

const CardBox = styled.div`
  width: 450px;
  height: 485px;
  margin: auto;
  border-radius: 25px;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);
`;

const MiddleCardBox = styled.div`
  width: 450px;
  height: 485px;
  margin: auto;
  border-radius: 25px;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);
  #chartdiv {
    display: flex;
    margin: auto;
    padding-top: 10px;
    width: 450px;
    height: 380px;
    font-size: 12px;
  }
`;

const RightCardBox = styled.div`
  width: 381px;
  height: 485px;
  margin: auto;
  border-radius: 25px;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);
  .graphTop3 {
    width: 330px;
    margin-top: 76px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 50px;
  }
  .graphTop3Material {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
  }
  .materialPercent {
    font-size: 28px;
    line-height: 41px;
    font-weight: 900;
    margin-right: 13px;
  }
  .materialName {
    font-size: 20px;
    font-weight: 500;
    line-height: 34px;
    color: #242424;
  }
`;

const WrapContents = styled.div`
  width: 340px;
  height: 405px;
  margin: auto;
  align-items: center;
  justify-content: center;
  margin-top: 40px;
  .labelWrap {
    width: 100%;
    display: flex;
    margin: auto;
    justify-content: center;
    margin-top: 22px;
  }
`;

const Image = styled.img`
  width: 340px;
  height: 140px;
  margin: auto;
  display: flex;
`;

const Name = styled.div`
  width: 340px;
  margin: auto;
  font-size: 24px;
  font-weight: 700;
  line-height: 41px;
  margin-top: 18px;
  justify-content: center;
  display: flex;
`;

const LeftLabel = styled.div`
  height: 24px;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  color: #868686;
  border-right: 2px solid #d9d9d9;
  padding-right: 7px;
`;

const RightLabel = styled.div`
  height: 24px;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  color: #868686;
  padding-left: 7px;
`;

const Categorize = styled.div`
  width: 140px;
  height: 40px;
  background: #ebebeb;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;
  display: flex;
  margin: auto;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
`;

const ReviewWrap = styled.div`
  display: flex;
  margin: auto;
  justify-content: center;
`;

const Star = styled.div`
  color: #868686;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  display: flex;
  align-items: center;
  margin-top: 16px;
  gap: 5px;
  margin-right: 4px;
`;

const Review = styled.div`
  color: #868686;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  display: flex;
  align-items: center;
  margin-top: 16px;
`;

const Picked = styled.div`
  width: 50px;
  height: 50px;
  background-color: #d9d9d9;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 18px;
`;

const CompareBox = styled.div`
  width: 263px;
  height: 50px;
  background-color: #d9d9d9;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 18px;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  cursor: pointer;
`;

const GraphLabel = styled.div`
  color: #868686;
  display: flex;
  justify-content: center;
  margin-top: 30px;
  font-size: 30px;
  font-weight: 700;
  line-height: 43px;
`;

export default Detail;
