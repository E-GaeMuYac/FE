import React, { useLayoutEffect, useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router';
import qs from 'qs';
import styled from 'styled-components';
import { useNavigate } from 'react-router';
import { useRecoilState } from 'recoil';
import { compareBoxData } from '../recoil/recoilStore';

import { useGetDetailQuery } from '../query/detailQuery';

// 그래프 라이브러리
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

// 컴포넌트
import TabBar from '../components/common/Tabbar';

const GraphTop3 = ({ medicineInfo, objGraph }) => {
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
    if (objGraph) {
      for (let i = 0; i < medicineInfo.materialName?.length; i++) {
        addedNumber += Number(medicineInfo.materialName[i].분량);
      }
      // top1
      for (let i = 0; i < medicineInfo.materialName?.length; i++) {
        if (Number(medicineInfo.materialName[i].분량) > topNumberNumData) {
          topNumberNumData = Number(medicineInfo.materialName[i].분량);
          topNumberNameData = medicineInfo.materialName[i].material;
        }
      }
      // top2
      for (let i = 0; i < medicineInfo.materialName?.length; i++) {
        if (
          Number(medicineInfo.materialName[i].분량) > topNO2NumData &&
          Number(medicineInfo.materialName[i].분량) < topNumberNumData
        ) {
          topNO2NumData = Number(medicineInfo.materialName[i].분량);
          topNO2NameData = medicineInfo.materialName[i].material;
        }
      }

      // top3
      for (let i = 0; i < medicineInfo.materialName?.length; i++) {
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
    }
  }, [objGraph]);
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
      case '유통기한':
        setContentDesc(medicineInfo.validTerm);
        break;
      default: //기본값 생략
    }
  }, [query]);
  return (
    <div>
      {query === '효능 효과' ? (
        <ScrollBar>
          <div className='scroll-area'>{medicineInfo.eeDocData}</div>
        </ScrollBar>
      ) : (
        <ScrollBar>
          <div className='scroll-area'>{ContentDesc}</div>
        </ScrollBar>
      )}
    </div>
  );
};

const Detail = () => {
  const param = useParams();
  const [objGraph, setObjGraph] = useState({});
  const [compareBox, setCompareBox] = useState();
  const location = useLocation().pathname;
  const query = qs.parse(window.location.search, {
    ignoreQueryPrefix: true,
  }).tab;

  const medicineItem = objGraph;

  // 그래프
  const medicine = [];

  useLayoutEffect(() => {
    if (objGraph) {
      // medicine에 속성 추가
      for (let i = 0; i < medicineItem.materialName?.length; i++) {
        medicine.push(medicineItem.materialName[i]);
      }
    }
  }, [objGraph]);

  useLayoutEffect(() => {
    if (objGraph) {
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
          // stroke: am5.color(0xffffff),
          // strokeWidth: 2,
          // strokeOpacity: 0,
          // position: 'absolute',
          // X: am5.percent(600),
          centerX: am5.percent(-22),
          y: am5.percent(-4),
          legendValueText: '{category}',
          legendLabelText: `[bold {fill}]{value.formatNumber('#.#')}mg`,
          // tooltipText: "{name} {valuePercent.formatNumber('#.#')}%",
        })
      );

      //labels
      series.labels.template.setAll({
        // text: `{category}`,
        // textType: 'circular',
        // inside: true,
        // radius: 10,
        maxWidth: 0,
        // inside: true,
        oversizedBehavior: 'wrap',
        textAlign: 'left',
        // wordBreak: 'keepAll',
      });

      series.ticks.template.setAll({
        stroke: am5.color(0xffffff),
        strokeWidth: 2,
        strokeOpacity: 0,
      });

      // label.set("text", "[#888]{categoryX}[/]: [bold]{valueY}[/]");

      series.labels.template.setAll({});

      // 그래프 마우스 오버 시 툴팁
      series.slices.template.set(
        'tooltipText',
        `{category} : {valuePercentTotal.formatNumber('0.00')}%`
      );
      // tooltipText: "{name} {valueTotalPercent.formatNumber('#.#')}%",

      const tooltip = am5.Tooltip.new(root, {});
      tooltip.label.setAll({
        oversizedBehavior: 'wrap',
        maxWidth: 20,
      });

      series.data.setAll(medicine);

      // Create legend
      // const legend = chart.children.push(
      //   am5.Legend.new(root, {
      //     centerX: am5.percent(50),
      //     x: am5.percent(50),
      //     marginTop: 15,
      //     marginBottom: 15,
      //   })
      // );

      // let legendRoot = am5.Root.new('legenddiv');

      // let legend = legendRoot.container.children.push(
      //   am5.Legend.new(legendRoot, {
      //     // width: am5.percent(100),
      //     // centerX: am5.percent(50),
      //     // x: am5.percent(50),
      //     position: 'absolute',
      //     width: 400,
      //     height: 300,

      //     layout: legendRoot.verticalLayout,
      //   }),
      // );

      // let legend = legendRoot.container.children.push(
      //   am5.Legend.new(legendRoot, {
      //     // width: am5.percent(100),
      //     // centerX: am5.percent(50),
      //     // x: am5.percent(50),
      //     position: 'absolute',
      //     width: 400,
      //     height: 300,
      //     // verticalScrollbar: am5.Scrollbar.new(legendRoot, {
      //     //   orientation: 'vertical',
      //     // }),
      //     layout: legendRoot.verticalLayout,
      //   })
      // );

      // legend.data.setAll(series.dataItems);

      // legend.data.setAll(series.dataItems);

      const legend = chart.children.push(
        am5.Legend.new(root, {
          // x: am5.percent(80),
          // centerX: am5.percent(50),
          // centerY: am5.percent(50),
          // y: am5.percent(50),
          // height: am5.percent(500),

          position: 'absolute',
          oversizedBehavior: 'wrap',
          width: 380,
          height: 290,
          x: am5.percent(3),
          y: am5.percent(8),
          layout: root.verticalLayout,
          verticalScrollbar: am5.Scrollbar.new(root, {
            orientation: 'vertical',
          }),
        })
      );

      legend.markerRectangles.template.setAll({
        cornerRadiusTL: 20,
        cornerRadiusTR: 20,
        cornerRadiusBL: 20,
        cornerRadiusBR: 20,
        width: 30,
        height: 30,
      });

      legend.labels.template.setAll({
        maxWidth: 77,
        minWidth: 77,
        marginLeft: 28,
        fontSize: 18,
        lineHeight: 1.8,
        width: 30,
        height: 30,
        //centerY: 0, // if we want labels to be top-aligned
        oversizedBehavior: 'wrap',
      });

      legend.valueLabels.template.setAll({
        maxWidth: 200,
        minWidth: 200,
        fontSize: 18,
        lineHeight: 2,
        oversizedBehavior: 'truncate',
      });

      legend.data.setAll(series.dataItems);

      // Play initial series animation
      series.appear(1000, 100);

      return () => {
        root.dispose();
      };
    }
  }, [objGraph]);

  const medicineId = param.id;
  const data = useGetDetailQuery(medicineId);

  console.log(data);

  useEffect(() => {
    if (data) {
      setObjGraph(data.data.product);
      console.log(data.data.product);
    }
    console.log(objGraph);
  }, [data]);

  console.log(medicineItem);
  console.log(objGraph);
  console.log(objGraph.medicineId);
  console.log(medicineId);

  // const medicineItem = arr.product;
  // // searchedWord가 변경될 때만 refetch
  // useEffect(() => {
  //   if (searchedWord) {
  //     refetch();
  //   }
  // }, [searchedWord]);

  // // data가 undefined가 아닐 때 state 변경
  // useEffect(() => {
  //   if (data) {
  //     setSearhArr(data.data);
  //   }
  // }, [data]);

  // useLayoutEffect(() => {}, [arr, query]);

  const [compareBoxArr, setCompareBoxArr] = useRecoilState(compareBoxData);

  const putInToCompareBox = (list) => {
    for (let i = 0; i < compareBoxArr.length; i++) {
      if (compareBoxArr[i].itemName === 'null') {
        let newArr = [...compareBoxArr];
        newArr[i] = list;
        setCompareBoxArr(newArr);
        break;
      }
    }
  };

  return (
    <>
      <TopSection>
        <CardBox>
          <WrapContents>
            {/* <Image src={defaultImg} alt='' /> */}
            <Image imgUrl={medicineItem?.itemImage} />
            <div style={{ marginRight: '20px' }}>
              <Name>{medicineItem?.itemName}</Name>
              <Categorize>
                <div>{medicineItem?.productType}</div>
              </Categorize>
            </div>
            <div className='labelWrap'>
              <TopLabel>{medicineItem?.entpName}</TopLabel>
              <BottomLabel>
                {medicineItem?.etcOtcCode}
                <div className='etcOtcCodeDesc'>
                  {medicineItem?.etcOtcCode === '전문의약품' ? (
                    <span className='tooltipText'>
                      의사 또는 치과의사의 지시와 감독에 따라 사용되어야 하는
                      의약품으로, 의사의 처방전에 의해서만 구입하여 사용할 수
                      있다.
                    </span>
                  ) : (
                    <span className='tooltipText'>
                      처방전 없이 약국에서 구입할 수 있는 의약품으로, 포장
                      용기에 기재된 설명대로 올바르게 복용한다면 비교적 안전하게
                      사용할 수 있다.
                    </span>
                  )}
                </div>
              </BottomLabel>
            </div>
            <div className='boxWrap'>
              <Picked>
                <div className='pickedImg'></div>
              </Picked>
              {medicineItem?.medicineId === compareBoxArr[0].medicineId ||
              medicineItem?.medicineId === compareBoxArr[1].medicineId ? (
                <div className='compareBox'>비교함 담기</div>
              ) : (
                <div
                  className='compareBox active'
                  onClick={() => {
                    putInToCompareBox(objGraph);
                  }}>
                  비교함 담기
                </div>
              )}
            </div>
          </WrapContents>
        </CardBox>
        <div
          style={{
            display: 'flex',
            marginTop: '43px',
            justifyContent: 'space-between',
          }}>
          <MiddleCardBox>
            <div
              style={{
                display: 'flex',
                position: 'relative',
                marginBottom: '55px',
              }}>
              <GraphLabel style={{ position: 'absolute', left: '90px' }}>
                유효성분 함량
              </GraphLabel>
              <GraphLabel style={{ position: 'absolute', right: '170px' }}>
                성분 그래프
              </GraphLabel>
            </div>
            <div id='chartdiv' />
          </MiddleCardBox>
          <RightCardBox>
            <GraphLabel>주요 유효성분</GraphLabel>
            <GraphTop3 medicineInfo={medicineItem} objGraph={objGraph} />
          </RightCardBox>
        </div>
      </TopSection>
      <div style={{ marginBottom: '128px' }}>
        <TabBar location={location} query={query} />
        <BottomSection>
          {/* <div id='legenddiv' /> */}
          <BottomContents medicineInfo={medicineItem} query={query} />
        </BottomSection>
      </div>
    </>
  );
};

const TopSection = styled.div`
  width: 1380px;
  /* display: flex; */
  margin-bottom: 58px;
`;

const BottomSection = styled.div`
  width: 100%;
  height: 325px;
  border-radius: 23px;
  background-color: #ebebeb;
  display: flex;
  padding: 34px 30px;

  #legenddiv {
    display: flex;
    margin: auto;
    padding-top: 10px;
    width: 100%;
    height: 380px;
    font-size: 12px;
  }
`;

const CardBox = styled.div`
  width: 100%;
  /* height: 130px; */
  margin: auto;
  border-radius: 25px;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);
`;

const MiddleCardBox = styled.div`
  width: 950px;
  height: 485px;
  /* float: left; */
  border-radius: 25px;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);
  position: relative;
  padding: 40px;
  #chartdiv {
    /* position: absolute; */
    /* left: 0; */
    display: flex;
    margin: auto;
    padding-top: 10px;
    width: 100%;
    height: 380px;
    font-size: 12px;
  }
`;

const RightCardBox = styled.div`
  width: 380px;
  height: 485px;
  /* margin: auto; */
  padding: 40px;
  border-radius: 25px;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);
  .graphTop3 {
    width: 330px;
    /* margin-top: 76px; */
    /* display: flex; */
    align-items: center;
    justify-content: center;
    gap: 50px;
    margin-top: 60px;
  }
  .graphTop3Content {
    width: 300px;
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
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
`;

const WrapContents = styled.div`
  /* width: 340px; */
  padding: 21px 30px;
  /* height: 405px; */
  margin: auto;
  align-items: center;
  /* justify-content: center; */
  margin-top: 40px;
  display: flex;
  position: relative;
  .labelWrap {
    /* width: 100%; */
    /* margin: auto; */
    justify-content: center;
    /* align-items: center; */
    /* margin-top: 22px; */
    text-align: left;
  }
  .boxWrap {
    display: flex;
    position: absolute;
    right: 30px;
    /* float: right; */
    /* justify-content: right; */
    /* justify-content: space-between; */
    /* margin-top: 20px; */
  }
  .etcOtcCodeDesc {
    width: 20px;
    height: 20px;
    background-image: url('/assets/image/의약품목설명아이콘.png');
    background-size: cover;
    background-position: center;
    margin-left: 5px;
    display: inline-block;
    :hover .tooltipText {
      display: block;
    }
    .tooltipText {
      border-radius: 8px;
      box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.2);
      display: none;
      position: absolute;
      max-width: 300px;
      padding: 18px;
      /* border: 1px solid; */
      font-size: 15px;
      line-height: 21px;
      color: #5a5a5a;
      background-color: #ffffff;
      opacity: 1;
      z-index: 2;
    }
  }
  .compareBox {
    width: 276px;
    height: 50px;
    background-color: #cccccc;
    box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.2);
    color: #ffffff;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    /* margin-top: 18px; */
    font-size: 18px;
    font-weight: 700;
    line-height: 20px;
    cursor: pointer;
  }
  .compareBox.active {
    background-color: #3366ff;
    cursor: pointer;
  }
`;

// const Image = styled.img`
//   width: 340px;
//   height: 140px;
//   margin: auto;
//   display: flex;
// `;

const Image = styled.div`
  width: 160px;
  height: 85px;
  border-radius: 8px;
  background-image: ${({ imgUrl }) =>
    imgUrl ? `url(${imgUrl})` : `url('/assets/image/default_img.png')`};
  /* ${({ imgUrl }) => `url(${imgUrl})`}; */
  background-size: 120%;
  background-position: center;
  margin-right: 30px;
`;

const Name = styled.div`
  min-width: 360px;
  max-width: 380px;
  margin: auto;
  font-size: 24px;
  font-weight: 700;
  line-height: 35px;
  /* margin-top: 18px; */
  justify-content: center;
  /* display: flex; */
`;

const TopLabel = styled.div`
  height: 24px;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  color: #868686;
  /* border-right: 2px solid #d9d9d9; */
  /* padding-right: 7px; */
  margin-bottom: 10px;
`;

const BottomLabel = styled.div`
  height: 24px;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  color: #868686;
  display: flex;
  align-items: center;
  justify-content: center;
  /* padding-left: 7px; */
  margin-top: 10px;
`;

const Categorize = styled.div`
  /* min-width: 140px;
  max-width: 300px; */
  /* padding: 0 10px; */
  /* align-items: center; */
  div {
    /* text-align: center; */
    padding: 0 12px;
    min-width: 140px;
    height: 40px;
    background: #ebf0ff;
    color: #3366ff;
    font-size: 16px;
    justify-content: center;
    align-items: center;
    font-weight: 700;
    line-height: 20px;
    border-radius: 8px;
    display: flex;
  }

  display: flex;
  /* margin: auto; */

  margin-top: 10px;
  /* position: absolute;
  bottom: 0; */
`;

const Picked = styled.div`
  width: 50px;
  height: 50px;
  /* background-color: #d9d9d9; */
  display: flex;
  align-items: center;
  justify-content: center;
  /* margin-top: 18px; */
  margin-right: 24px;
  border-radius: 8px;
  box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.2);
  .pickedImg {
    width: 34px;
    height: 34px;
    background-image: url('/assets/image/icon_heart1.png');
    background-size: cover;
    background-position: center;
    cursor: pointer;
  }
`;

const GraphLabel = styled.div`
  color: #868686;
  display: flex;
  justify-content: center;
  /* margin-top: 30px; */
  font-size: 30px;
  font-weight: 700;
  line-height: 43px;
`;

const ScrollBar = styled.div`
  font-size: 20px;
  line-height: 33px;
  overflow-x: hidden;
  overflow-y: auto;
  height: 260px;
  .scroll-area {
    padding: 0 12px 0 0;
  }
  ::-webkit-scrollbar {
    width: 12px;
    height: 5px;
  }
  ::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 5px;
  }
`;

export default Detail;
