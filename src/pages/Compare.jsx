import styled from 'styled-components';

import qs from 'qs';

import { useLocation } from 'react-router-dom';
import { useEffect, useLayoutEffect, useState } from 'react';

//component
import TabBar from '../components/common/Tabbar';

// 그래프 라이브러리
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

const VersusContent = ({ medicineInfo, query }) => {
  // ------------------------------------------------------------
  const [versusContentDesc, setVersusContentDesc] = useState('');

  useEffect(() => {
    switch (query) {
      case '효능 효과':
        setVersusContentDesc(medicineInfo.eeDocData);
        break;
      case '용법 용량':
        setVersusContentDesc(medicineInfo.udDocData);
        break;
      case '첨가물':
        setVersusContentDesc(medicineInfo.ingrName);
        break;
      case '보관 방법':
        setVersusContentDesc(medicineInfo.eeDocData);
        break;
    }
  }, [query]);
  // ------------------------------------------------------------
  //그래프 부분

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
    <div className='versusContentWrap'>
      {query === '성분 순위' ? (
        <>
          <div className='graphTop3Title'>{medicineInfo.itemName}</div>
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
        </>
      ) : (
        <>{versusContentDesc}</>
      )}
    </div>
  );
};

const ComparePage = () => {
  const location = useLocation().pathname;
  const query = qs.parse(window.location.search, {
    ignoreQueryPrefix: true,
  }).tab;

  const versusList = [
    {
      itemName: '타이레노오오오오올',
      itemImage:
        'https://s3-alpha-sig.figma.com/img/917a/ce7b/9262f5da2e74cdc931cf2bd206ad200a?Expires=1673827200&Signature=nEazUdsurlwUoj0vV8Tq-wHew19d0LJCoEcz2EPKB-xjLVp79AHdcbWgefejMlP9tpKV8S~EwOrPsPFxVXXeEzt01PSwL5hO-4yymSZtPb24keioTp0nCQYVTjYgBARSpVryPiZEq9HSX-AT0VFy3vgFpRu-5bv0Mo0I1NJwFKP1kodqHMeLLbQOkbMg7KIvqczdsBgqTL0rrKtK6hBc9dhCPQq58sGHeN7dSdbFFjtKm3Uj61IKyvC476xpocW6bkp2buhdiroQKWNL-BkxrN7y0b~Pgh8JUfX86xIDGhpDNdFPlF-mhTRwE7mc~ooM2aqbfNcWAM59xBUjvF8maA__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4',
      entpName: '삼진제약(주)',
      etcOtcCode: '일반의약품',
      eeDocData: '정신이 몽롱해지고 곧...',
      udDocData: '용법용량 블라블라',
      ingrName: 'ingr, ingr, ingr, ingr',
      materialName: [
        { 총량: '1정 중 1300밀리그램' },
        { material: '모르핀', 분량: '100', 단위: '밀리그램' },
        { material: '수면제', 분량: '200', 단위: '밀리그램' },
        { material: '마약', 분량: '500', 단위: '밀리그램' },
        { material: '미원', 분량: '400', 단위: '밀리그램' },
      ],
    },
    {
      itemName: '게보린',
      itemImage:
        'https://s3-alpha-sig.figma.com/img/917a/ce7b/9262f5da2e74cdc931cf2bd206ad200a?Expires=1673827200&Signature=nEazUdsurlwUoj0vV8Tq-wHew19d0LJCoEcz2EPKB-xjLVp79AHdcbWgefejMlP9tpKV8S~EwOrPsPFxVXXeEzt01PSwL5hO-4yymSZtPb24keioTp0nCQYVTjYgBARSpVryPiZEq9HSX-AT0VFy3vgFpRu-5bv0Mo0I1NJwFKP1kodqHMeLLbQOkbMg7KIvqczdsBgqTL0rrKtK6hBc9dhCPQq58sGHeN7dSdbFFjtKm3Uj61IKyvC476xpocW6bkp2buhdiroQKWNL-BkxrN7y0b~Pgh8JUfX86xIDGhpDNdFPlF-mhTRwE7mc~ooM2aqbfNcWAM59xBUjvF8maA__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4',
      entpName: '삼진제약(주)',
      etcOtcCode: '일반의약품',
      eeDocData: '기강이 해이해지고 곧...',
      udDocData: '용법용량 블라블라',
      ingrName: 'ingr, ingr, ingr, ingr',
      materialName: [
        { 총량: '1정 중 550밀리그램' },
        { material: '모르핀', 분량: '100', 단위: '밀리그램' },
        { material: '수면제', 분량: '250', 단위: '밀리그램' },
        { material: '마약', 분량: '200', 단위: '밀리그램' },
        { material: '사랑', 분량: '500', 단위: '밀리그램' },
      ],
    },
  ];
  //   --------------------------------------------------------------
  // 그래프

  let medicineA = {
    medicineName: versusList[0].itemName,
  };
  let medicineB = {
    medicineName: versusList[1].itemName,
  };
  const inPill = [];

  const medicineIngredient = [medicineA, medicineB];

  useLayoutEffect(() => {
    // medicineA에 속성 추가
    for (let i = 1; i < versusList[0].materialName.length; i++) {
      //inPill배열에 추가되지 않은 성분일 경우 해당 성분 추가
      if (!inPill.includes(versusList[0].materialName[i].material)) {
        inPill.push(versusList[0].materialName[i].material);
      }

      //객체에 '성분 : 분량' 방식으로 추가
      medicineA[versusList[0].materialName[i].material] = Number(
        versusList[0].materialName[i].분량
      );
    }
    // medicineB에 속성 추가
    for (let i = 1; i < versusList[1].materialName.length; i++) {
      //inPill배열에 추가되지 않은 성분일 경우 해당 성분 추가
      if (!inPill.includes(versusList[1].materialName[i].material)) {
        inPill.push(versusList[1].materialName[i].material);
      }

      //객체에 '성분 : 분량' 방식으로 추가
      medicineB[versusList[1].materialName[i].material] = Number(
        versusList[1].materialName[i].분량
      );
    }
  }, []);

  useLayoutEffect(() => {
    const root = am5.Root.new('chartdiv');

    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,

        // 스크롤 이벤트 시 애니메이션 활용 여부
        // wheelX: 'panY',
        // wheelY: 'zoomY',

        layout: root.verticalLayout,
      })
    );

    //차트 색 변경
    chart
      .get('colors')
      .set('colors', [
        am5.color(0xcb76ff),
        am5.color(0x6faffa),
        am5.color(0xfde284),
      ]);

    // y축 라벨, 그리드 없애기
    const yRenderer = am5xy.AxisRendererY.new(root, {});
    yRenderer.labels.template.set('visible', false);
    yRenderer.grid.template.set('visible', false);

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        max: 100,
        numberFormat: "#'%'",
        strictMinMax: true,
        calculateTotals: true,

        renderer: yRenderer,
      })
    );

    // x축 라벨, 그리드 없애기
    const xRenderer = am5xy.AxisRendererX.new(root, {});
    xRenderer.grid.template.set('visible', false);

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: 'medicineName',

        renderer: xRenderer,
      })
    );
    xAxis.data.setAll(medicineIngredient);

    // 범례 설정, 위치 잡기. unshift = 위 / push = 아래
    const legend = chart.children.unshift(am5.Legend.new(root, {}));

    // 시리즈
    for (let i = 0; i < inPill.length; i++) {
      const series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          // 차트 border 설정
          stroke: am5.color(0xffffff),
          strokeWidth: 2,
          strokeOpacity: 0,

          // 속성이름
          name: inPill[i],

          //쌓아올리는 막대 구분
          stacked: true,

          xAxis: xAxis,
          yAxis: yAxis,
          baseAxis: xAxis,
          valueYField: inPill[i],
          valueYShow: 'valueYTotalPercent',
          categoryXField: 'medicineName',
        })
      );
      series.data.setAll(medicineIngredient);

      series.columns.template.setAll({
        // 마우스 오버 시 툴팁 출력, 위치 조정
        tooltipText: '{name}: {valueY}mg',
        tooltipX: am5.percent(50),
        tooltipY: am5.percent(30),

        //radius 값 주기
        cornerRadiusTL: 5,
        cornerRadiusTR: 5,
        cornerRadiusBL: 5,
        cornerRadiusBR: 5,

        //바 굴기 조절
        width: 100,
      });

      series.appear();

      // 차트 가운데 라벨
      series.bullets.push(() => {
        return am5.Bullet.new(root, {
          sprite: am5.Label.new(root, {
            text: "{name} {valueYTotalPercent.formatNumber('#.#')}%",
            fill: root.interfaceColors.get('alternativeText'),
            centerY: am5.p50,
            centerX: am5.p50,
            populateText: true,
          }),
        });
      });

      legend.data.push(series);
    }

    return () => {
      root.dispose();
    };
  }, []);
  //   --------------------------------------------------------------
  return (
    <Wrap>
      <MainWrap>
        <div className='title'>선택한 약품 비교하기</div>
        <div className='versus'>
          <div className='card' key={versusList[0].itemName}>
            <div
              className='cardImg'
              style={{
                backgroundImage: `url(${versusList[0].itemImage})`,
              }}></div>
            <div className='cardName'>{versusList[0].itemName}</div>
            <div className='cardContentDesc'>{versusList[0].entpName}</div>
            <div className='cardContentDesc'>{versusList[0].etcOtcCode}</div>
            <button>이 약품만 보러가기</button>
          </div>
          <div id='chartdiv'></div>
          <div className='card' key={versusList[1].itemName}>
            <div
              className='cardImg'
              style={{
                backgroundImage: `url(${versusList[1].itemImage})`,
              }}></div>
            <div className='cardName'>{versusList[1].itemName}</div>
            <div className='cardContentDesc'>{versusList[1].entpName}</div>
            <div className='cardContentDesc'>{versusList[1].etcOtcCode}</div>
            <button>이 약품만 보러가기</button>
          </div>
        </div>
      </MainWrap>
      <TabBar location={location} query={query} />
      <SubWrap>
        <div className='content'>
          <VersusContent medicineInfo={versusList[0]} query={query} />
          <VersusContent medicineInfo={versusList[1]} query={query} />
        </div>
      </SubWrap>
    </Wrap>
  );
};

const Wrap = styled.div`
  width: 100%;
`;
const MainWrap = styled.div`
  width: 100%;
  margin: 0 auto 15px;
  .title {
    font-size: 30px;
    font-weight: bold;
    line-height: 43px;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 24px;
  }
  .versus {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .card {
    width: 513px;
    height: 477px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid #d0d0d0;
    border-radius: 25px;
  }
  .cardImg {
    width: 310px;
    height: 170.5px;
    background-size: 130%;
    background-position: center;
    margin: 40px 0 21.5px;
  }
  .cardName {
    font-size: 28px;
    font-weight: bold;
    line-height: 41px;
    color: #242424;
    margin-bottom: 14px;
  }
  .cardContentDesc {
    font-weight: bold;
    font-size: 20px;
    color: #868686;
    margin-bottom: 14px;
  }
  button {
    width: 326px;
    height: 50px;
    background-color: #868686;
    color: #ffffff;
    border: none;
    font-size: 14px;
    line-height: 20px;
    cursor: pointer;
  }
  #chartdiv {
    width: 500px;
    height: 500px;
  }
`;
const SubWrap = styled.div`
  width: 100%;
  margin-bottom: 90px;
  .content {
    display: flex;
    align-items: center;
    gap: 42px;
  }
  .versusContentWrap {
    width: 90%;
    background-color: #ebebeb;
    border-radius: 25px;
    padding: 24px 25px;
  }
  .graphTop3Material {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
  }
  .materialPercent {
    font-size: 24px;
    line-height: 35px;
    font-weight: bold;
    margin-right: 13px;
  }
  .graphTop3Title {
    color: #868686;
    font-size: 30px;
    font-weight: bold;
    line-height: 43px;
    margin-bottom: 31px;
  }
  .materialName {
    font-size: 18px;
    line-height: 26px;
    color: #242424;
  }
`;

export default ComparePage;
