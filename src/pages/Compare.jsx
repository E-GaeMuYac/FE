import styled from 'styled-components';

import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { useLayoutEffect } from 'react';

const ComparePage = () => {
  const versusList = [
    {
      itemName: '타이레놀',
      itemImage:
        'https://s3-alpha-sig.figma.com/img/917a/ce7b/9262f5da2e74cdc931cf2bd206ad200a?Expires=1673827200&Signature=nEazUdsurlwUoj0vV8Tq-wHew19d0LJCoEcz2EPKB-xjLVp79AHdcbWgefejMlP9tpKV8S~EwOrPsPFxVXXeEzt01PSwL5hO-4yymSZtPb24keioTp0nCQYVTjYgBARSpVryPiZEq9HSX-AT0VFy3vgFpRu-5bv0Mo0I1NJwFKP1kodqHMeLLbQOkbMg7KIvqczdsBgqTL0rrKtK6hBc9dhCPQq58sGHeN7dSdbFFjtKm3Uj61IKyvC476xpocW6bkp2buhdiroQKWNL-BkxrN7y0b~Pgh8JUfX86xIDGhpDNdFPlF-mhTRwE7mc~ooM2aqbfNcWAM59xBUjvF8maA__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4',
      entpName: '삼진제약(주)',
      etcOtcCode: '일반의약품',
      materialName: [
        { 총량: '1정 중 800밀리그램' },
        { material: '모르핀', 분량: '100', 단위: '밀리그램' },
        { material: '수면제', 분량: '200', 단위: '밀리그램' },
        { material: '마약', 분량: '500', 단위: '밀리그램' },
        { material: '미원', 분량: '500', 단위: '밀리그램' },
      ],
    },
    {
      itemName: '게보린',
      itemImage:
        'https://s3-alpha-sig.figma.com/img/917a/ce7b/9262f5da2e74cdc931cf2bd206ad200a?Expires=1673827200&Signature=nEazUdsurlwUoj0vV8Tq-wHew19d0LJCoEcz2EPKB-xjLVp79AHdcbWgefejMlP9tpKV8S~EwOrPsPFxVXXeEzt01PSwL5hO-4yymSZtPb24keioTp0nCQYVTjYgBARSpVryPiZEq9HSX-AT0VFy3vgFpRu-5bv0Mo0I1NJwFKP1kodqHMeLLbQOkbMg7KIvqczdsBgqTL0rrKtK6hBc9dhCPQq58sGHeN7dSdbFFjtKm3Uj61IKyvC476xpocW6bkp2buhdiroQKWNL-BkxrN7y0b~Pgh8JUfX86xIDGhpDNdFPlF-mhTRwE7mc~ooM2aqbfNcWAM59xBUjvF8maA__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4',
      entpName: '삼진제약(주)',
      etcOtcCode: '일반의약품',
      materialName: [
        { 총량: '1정 중 550밀리그램' },
        { material: '모르핀', 분량: '100', 단위: '밀리그램' },
        { material: '수면제', 분량: '250', 단위: '밀리그램' },
        { material: '마약', 분량: '200', 단위: '밀리그램' },
        { material: '사랑', 분량: '500', 단위: '밀리그램' },
      ],
    },
  ];

  const medicineA = {
    medicineName: versusList[0].itemName,
  };
  const medicineB = {
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

  //   --------------------------------------------------------------

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

    const yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: 'medicineName',
        renderer: am5xy.AxisRendererY.new(root, {}),
        tooltip: am5.Tooltip.new(root, {}),
      })
    );
    yAxis.data.setAll(medicineIngredient);

    const xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        max: 100,
        numberFormat: "#'%'",
        strictMinMax: true,
        calculateTotals: true,
        renderer: am5xy.AxisRendererX.new(root, {}),
      })
    );

    const legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50,
      })
    );

    for (let i = 0; i < inPill.length; i++) {
      const series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          // 차트 border 설정
          stroke: am5.color(0xffffff),
          strokeWidth: 2,

          // 속성이름
          name: inPill[i],

          //쌓아올리는 막대 구분
          stacked: true,

          xAxis: xAxis,
          yAxis: yAxis,
          baseAxis: yAxis,
          valueXField: inPill[i],
          valueXShow: 'valueXTotalPercent',
          categoryYField: 'medicineName',
        })
      );
      series.data.setAll(medicineIngredient);

      // 마우스 오버 시 문구 출력
      series.columns.template.setAll({
        tooltipText: '{name}: {valueX}mg',
        tooltipY: am5.percent(100),
      });

      series.appear();

      // 차트 가운데 라벨
      series.bullets.push(() => {
        return am5.Bullet.new(root, {
          sprite: am5.Label.new(root, {
            text: "{valueXTotalPercent.formatNumber('#.#')}%",
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
          {versusList.map((list) => (
            <div className='card' key={list.itemName}>
              <div
                className='cardImg'
                style={{
                  backgroundImage: `url(${list.itemImage})`,
                }}></div>
              <div className='cardName'>{list.itemName}</div>
              <div className='cardContentDesc'>{list.entpName}</div>
              <div className='cardContentDesc'>{list.etcOtcCode}</div>
              <button>이 약품만 보러가기</button>
            </div>
          ))}
        </div>
      </MainWrap>
      <SubWrap>
        <div className='title'>그래프 비교</div>
        <div id='chartdiv' style={{ width: '90%', height: '290px' }}></div>
      </SubWrap>
    </Wrap>
  );
};

const Wrap = styled.div`
  width: 100%;
`;
const MainWrap = styled.div`
  width: 1080px;
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
    justify-content: space-between;
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
`;
const SubWrap = styled.div`
  width: 100%;
  .title {
    text-align: center;
    margin: 16px 0 23px;
    font-size: 30px;
    line-height: 43px;
    font-weight: bold;
    color: #242424;
  }
`;

export default ComparePage;
