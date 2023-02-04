import styled from 'styled-components';

import qs from 'qs';

import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useLayoutEffect, useState } from 'react';

//component
import TabBar from '../../components/common/Tabbar';

// 그래프 라이브러리
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

import { useRecoilValue } from 'recoil';
// import { compareBoxData } from '../../recoil/recoilStore';
import { compareBoxData } from '../../recoil/recoilStore';

import { useGetVersusQuery } from '../../query/versusQuery';
import LikeItBtn from '../../components/common/LikeItBtn';
import Layout from '../../components/layout/Layout';

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
      case '유효기간':
        setVersusContentDesc(medicineInfo.validTerm);
        break;
    }
  }, [query]);
  // ------------------------------------------------------------
  //그래프 부분
  return <div className='versusContentWrap'>{versusContentDesc}</div>;
};

const VersusCard = ({ info, type }) => {
  const navigate = useNavigate();
  const gotoDetail = (id) => {
    navigate(`/detail/${id}?tab=효능 효과`);
  };
  return (
    <VersusCardWrap image={info.itemImage} type={type}>
      <div className='card'>
        <div className='cardImg'></div>
        <div className='cardName'>{info.itemName}</div>
        <div className='cardContentDescWrap'>
          <div className='cardContentDesc' style={{ textAlign: 'right' }}>
            {info.etcOtcCode}
          </div>
          <hr />
          <div className='cardContentDesc'>{info.entpName}</div>
        </div>
        <div className='cardContentTagWrap'>
          {info.productType.map((tag) => (
            <div key={tag} className='cardContentTag'>
              {tag}
            </div>
          ))}
        </div>
        <div className='cardBtnWrap'>
          <LikeItBtn id={info.medicineId} dibs={info.dibs} />
          <button
            className='goToDetailBtn'
            onClick={() => {
              gotoDetail(info.medicineId);
            }}>
            이 약품만 보러가기
          </button>
        </div>
      </div>
      <div className='characterImg'></div>
    </VersusCardWrap>
  );
};

const LaptopCompare = () => {
  const location = useLocation().pathname;
  const query = qs.parse(window.location.search, {
    ignoreQueryPrefix: true,
  }).tab;
  const navigate = useNavigate();

  const [versusList, setVersusList] = useState([]);

  const compareBoxArr = useRecoilValue(compareBoxData);

  const comparePillIdA = compareBoxArr.arr[0].medicineId;
  const comparePillIdB = compareBoxArr.arr[1].medicineId;

  useEffect(() => {
    if (!localStorage.getItem('refreshToken')) {
      alert('로그인 시 이용 가능합니다.');
      navigate('/');
    }
  }, []);

  const { refetch, isLoading, data } = useGetVersusQuery(
    comparePillIdA,
    comparePillIdB
  );

  useEffect(() => {
    if (comparePillIdA !== 1 && comparePillIdB !== 2) {
      refetch();
    }
  }, [comparePillIdA, comparePillIdB]);

  useEffect(() => {
    if (data) {
      setVersusList([data.data.compareA, data.data.compareB]);
    }
  }, [data]);
  //   --------------------------------------------------------------
  // 그래프
  let allergyDataArray1 = [];
  let allergyDataArray2 = [];
  const [allergy1, setAllergy1] = useState(false);
  const [allergy2, setAllergy2] = useState(false);

  let graphData = [];
  const [grapDataArr, setGrapDataArr] = useState([]);

  const [materialAExplainActive, setMaterialAExplainActive] = useState(false);
  const [materialBExplainActive, setMaterialBExplainActive] = useState(false);
  const [materialExplainY, setMaterialExplainY] = useState(0);
  const [materialExplainName, setMaterialExplainName] = useState('');
  const [materialExplainDesc, setMaterialExplainDesc] = useState('');

  useLayoutEffect(() => {
    if (versusList.length === 2 && query === '성분그래프') {
      //그래프 초기화
      allergyDataArray1 = [];
      allergyDataArray2 = [];

      // 등록한 알러지 성분 정보 받아오기
      for (let i = 0; i < versusList[0]?.materialName?.length; i++) {
        const allergyData = {
          material: versusList[0]?.materialName[i]?.material,
          allergy: versusList[0]?.materialName[i]?.allergy,
        };
        allergyDataArray1.push(allergyData);
        if (versusList[0]?.materialName[i]?.allergy === true) {
          setAllergy1(true);
        }
      }

      for (let j = 0; j < versusList[1]?.materialName?.length; j++) {
        const allergyData = {
          material: versusList[1]?.materialName[j]?.material,
          allergy: versusList[1]?.materialName[j]?.allergy,
        };
        allergyDataArray2.push(allergyData);
        if (versusList[1]?.materialName[j]?.allergy === true) {
          setAllergy2(true);
        }
      }
    }
  }, [versusList, query]);

  const [legendHeightA, setLegendHeightA] = useState(0);
  const [legendHeightB, setLegendHeightB] = useState(0);

  //그래프에 들어갈 배열 생성
  useLayoutEffect(() => {
    //그래프 초기화
    graphData = [];
    if (versusList.length === 2 && query === '성분그래프') {
      // 첫 번째 약의 정보를 우선 받아오기
      for (let i = 0; i < versusList[0].materialName.length; i++) {
        const newMedicineData = {
          material: versusList[0].materialName[i].material,
          explain: versusList[0].materialName[i].설명,
          medicineA: 0,
          medicineB: 0,
        };
        if (versusList[0].materialName[i].allergy) {
          newMedicineData['columnSettings'] = {
            fill: am5.color(0xff392b),
            strokeOpacity: 0,
          };
        }
        graphData.push(newMedicineData);
      }
      //두 번째 약
      for (let i = 0; i < versusList[1].materialName.length; i++) {
        const newMedicineData = {
          material: versusList[1].materialName[i].material,
          explain: versusList[1].materialName[i].설명,
          medicineA: 0,
          medicineB: 0,
        };
        if (versusList[1].materialName[i].allergy) {
          newMedicineData['columnSettings'] = {
            fill: am5.color(0xff392b),
            strokeOpacity: 0,
          };
        }

        graphData.push(newMedicineData);
      }
      //중복 제거
      graphData = graphData.filter((item, i) => {
        return (
          graphData.findIndex((item2, j) => {
            return item.material === item2.material;
          }) === i
        );
      });

      //meterial와 같은 부분을 각각 가져오기
      for (let i = 0; i < graphData.length; i++) {
        // A약
        for (let j = 0; j < versusList[0].materialName.length; j++) {
          if (
            graphData[i].material === versusList[0].materialName[j].material
          ) {
            graphData[i].medicineA = Math.round(
              Number(versusList[0].materialName[j].분량)
            );
          }
        }
        //B약
        for (let j = 0; j < versusList[1].materialName.length; j++) {
          if (
            graphData[i].material === versusList[1].materialName[j].material
          ) {
            graphData[i].medicineB = Math.round(
              Number(versusList[1].materialName[j].분량)
            );
          }
        }
      }
      setGrapDataArr(graphData);
    }
  }, [versusList, query]);

  // 그래프 작업
  useLayoutEffect(() => {
    if (versusList.length === 2 && query === '성분그래프') {
      for (let i = 0; i < versusList[0].materialName?.length; i++) {
        for (let j = 0; j < versusList[1].materialName?.length; j++) {
          // console.log(versusList[0].materialName[i].allergy);
          // console.log(versusList[1].materialName[j].allergy);

          const root = am5.Root.new('chartdiv');

          const chart = root.container.children.push(
            am5percent.PieChart.new(root, {
              layout: root.verticalLayout,
            })
          );

          // 애니메이션 셋팅
          root.setThemes([am5themes_Animated.new(root)]);

          // 툴팁 최대 너비 지정 및 오버 시 줄바꿈
          const tootip = am5.Tooltip.new(root, {});
          tootip.label.setAll({
            oversizedBehavior: 'wrap',
            maxWidth: 200,
            fontSize: 17,
          });

          //series1
          const series = chart.series.push(
            am5percent.PieSeries.new(root, {
              name: 'Series',
              valueField: 'medicineA',
              categoryField: 'material',

              radius: am5.percent(90),
              innerRadius: am5.percent(50),
              centerX: 40,
              y: am5.percent(10),
              startAngle: -90,
              endAngle: -270,

              tooltip: tootip,
              legendValueText: '{category}',
              legendLabelText: `{value.formatNumber('#.#')}mg`,
            })
          );
          series.slices.template.setAll({
            templateField: 'columnSettings',
          });
          //색상 지정
          series
            .get('colors')
            .set('colors', [
              am5.color('#3366FF'),
              am5.color('#102693'),
              am5.color('#1939B7'),
              am5.color('#6690FF'),
              am5.color('#091A7A'),
              am5.color('#7433FF'),
              am5.color('#2D1093'),
              am5.color('#4119B7'),
              am5.color('#9B66FF'),
              am5.color('#1E097A'),
              am5.color('#00CFA5'),
              am5.color('#006E78'),
              am5.color('#009593'),
              am5.color('#38E2AF'),
              am5.color('#005163'),
              am5.color('#5598FC'),
              am5.color('#1B3C92'),
              am5.color('#2A57B5'),
              am5.color('#7FB6FD'),
              am5.color('#102978'),
            ]);

          series.data.setAll(graphData);

          //ticks, 라벨 제거
          series.ticks.template.setAll({
            strokeOpacity: 0,
          });
          series.labels.template.set('forceHidden', true);

          //series2
          const series2 = chart.series.push(
            am5percent.PieSeries.new(root, {
              name: 'Series',
              valueField: 'medicineB',
              categoryField: 'material',

              radius: am5.percent(90),
              innerRadius: am5.percent(50),
              centerX: -40,
              y: am5.percent(10),
              startAngle: -90,
              endAngle: 90,
              tooltip: tootip,
              legendValueText: '{category}',
              legendLabelText: `{value.formatNumber('#.#')}mg`,
            })
          );

          //색상 지정
          series2
            .get('colors')
            .set('colors', [
              am5.color('#3366FF'),
              am5.color('#102693'),
              am5.color('#1939B7'),
              am5.color('#6690FF'),
              am5.color('#091A7A'),
              am5.color('#7433FF'),
              am5.color('#2D1093'),
              am5.color('#4119B7'),
              am5.color('#9B66FF'),
              am5.color('#1E097A'),
              am5.color('#00CFA5'),
              am5.color('#006E78'),
              am5.color('#009593'),
              am5.color('#38E2AF'),
              am5.color('#005163'),
              am5.color('#5598FC'),
              am5.color('#1B3C92'),
              am5.color('#2A57B5'),
              am5.color('#7FB6FD'),
              am5.color('#102978'),
            ]);
          series2.slices.template.setAll({
            templateField: 'columnSettings',
          });
          series2.data.setAll(graphData);

          //ticks, 라벨 제거
          series2.ticks.template.setAll({
            strokeOpacity: 0,
          });
          series2.labels.template.set('forceHidden', true);

          //legend 루트 2개 생성
          const legendRoot = am5.Root.new('legenddiv');
          const legendRoot2 = am5.Root.new('legenddiv2');

          const legend = legendRoot.container.children.push(
            am5.Legend.new(legendRoot, {
              width: 400,
              layout: legendRoot.verticalLayout,
            })
          );
          legend.labels.template.setAll({
            minWidth: 60,
            maxWidth: 100,
            marginRight: 10,
            fill: '#242424',
            fontSize: 17,
            fontWeight: 500,
            fontFamily: 'Noto Sans KR',
          });
          legend.valueLabels.template.setAll({
            minWidth: 120,
            maxWidth: 120,
            marginRight: 10,
            fill: '#242424',
            fontSize: 16,
            fontWeight: 500,
            fontFamily: 'Noto Sans KR',
            // 오버사이즈 시 처리.
            // truncate : 말줄임, none: 겹침, wrap: 줄바꿈, fit: 딱맞게 폰트사이즈 조절
            oversizedBehavior: 'truncate',
          });

          legend.itemContainers.template.events.on('pointerover', (e) => {
            setMaterialAExplainActive(true);
            setMaterialExplainName(
              e.target.dataItem.dataContext.dataContext.material
            );
            setMaterialExplainY(e.target._privateSettings.y);
            //e.target.dataItem.dataContext.dataContext.material = 성분 이름 추출
            //e.target._privateSettings.y 축 좌표
          });
          legend.itemContainers.template.events.on('pointerout', (e) => {
            setMaterialAExplainActive(false);
          });
          legend.events.on('boundschanged', function () {
            setLegendHeightA(`${legend.height() + 30}px`);
          });
          //마커 동그랗게 변경
          legend.markerRectangles.template.setAll({
            cornerRadiusTL: 10,
            cornerRadiusTR: 10,
            cornerRadiusBL: 10,
            cornerRadiusBR: 10,
          });

          // 범례 이벤트 생성

          // 시리즈 데이터 집어넣기
          legend.data.setAll(series.dataItems);

          const legend2 = legendRoot2.container.children.push(
            am5.Legend.new(legendRoot2, {
              width: 400,
              layout: legendRoot2.verticalLayout,
            })
          );
          legend2.labels.template.setAll({
            minWidth: 60,
            maxWidth: 100,
            marginRight: 10,
            fill: '#242424',
            fontSize: 17,
            fontWeight: 500,
            fontFamily: 'Noto Sans KR',
          });
          legend2.valueLabels.template.setAll({
            minWidth: 120,
            maxWidth: 120,
            marginRight: 10,
            fill: '#242424',
            fontSize: 16,
            fontWeight: 500,
            fontFamily: 'Noto Sans KR',
            // 오버사이즈 시 처리.
            // truncate : 말줄임, none: 겹침, wrap: 줄바꿈, fit: 딱맞게 폰트사이즈 조절
            oversizedBehavior: 'truncate',
          });
          legend2.itemContainers.template.events.on('pointerover', (e) => {
            setMaterialBExplainActive(true);
            setMaterialExplainName(
              e.target.dataItem.dataContext.dataContext.material
            );
            setMaterialExplainY(e.target._privateSettings.y);
            //e.target.dataItem.dataContext.dataContext.material = 성분 이름 추출
            //e.target._privateSettings.y 축 좌표
          });
          legend2.itemContainers.template.events.on('pointerout', (e) => {
            setMaterialBExplainActive(false);
          });
          legend2.events.on('boundschanged', function () {
            setLegendHeightB(`${legend2.height() + 30}px`);
          });
          //마커 크기 변경
          legend.markers.template.setAll({
            width: 25,
            height: 25,
            marginRight: 10,
          });

          //마커 동그랗게 변경
          legend.markerRectangles.template.setAll({
            cornerRadiusTL: 30,
            cornerRadiusTR: 30,
            cornerRadiusBL: 30,
            cornerRadiusBR: 30,
          });

          //마커 크기 변경
          legend2.markers.template.setAll({
            width: 25,
            height: 25,
            marginRight: 10,
          });

          //마커 동그랗게 변경
          legend2.markerRectangles.template.setAll({
            cornerRadiusTL: 30,
            cornerRadiusTR: 30,
            cornerRadiusBL: 30,
            cornerRadiusBR: 30,
          });

          // 시리즈2 데이터 집어넣기
          legend2.data.setAll(series2.dataItems);

          // 애니메이션
          series.appear(1000, 100);
          series2.appear(1000, 100);

          return () => {
            root.dispose();
            legendRoot.dispose();
            legendRoot2.dispose();
          };
        }
      }
    }
  }, [versusList, query]);

  //성분 설명 작업
  useEffect(() => {
    if (versusList.length === 2 && query === '성분그래프') {
      for (let i = 0; i < grapDataArr.length; i++) {
        if (materialExplainName === grapDataArr[i].material) {
          if (grapDataArr[i].explain) {
            setMaterialExplainDesc(grapDataArr[i].explain);
          } else if (!grapDataArr[i].explain) {
            setMaterialExplainDesc('정보가 없습니다');
          }
        }
      }
    }
  }, [materialExplainName, versusList, query]);

  //   --------------------------------------------------------------

  //주요 성분 총량
  const medicineTotalAmount = (arr) => {
    let amount = 0;
    for (let i = 0; i < arr.materialName.length; i++) {
      amount += Number(arr.materialName[i].분량);
    }

    return amount;
  };
  //   --------------------------------------------------------------
  const [totalAmountAAxtive, setTotalAmountAAxtive] = useState(false);
  const [totalAmountBAxtive, setTotalAmountBAxtive] = useState(false);

  const AtotalAmountMouseOver = (e) => {
    if (e._reactName === 'onMouseOut') {
      setTotalAmountAAxtive(false);
    } else {
      setTotalAmountAAxtive(true);
    }
  };
  const BtotalAmountMouseOver = (e) => {
    if (e._reactName === 'onMouseOut') {
      setTotalAmountBAxtive(false);
    } else {
      setTotalAmountBAxtive(true);
    }
  };

  //   --------------------------------------------------------------

  return (
    <>
      {versusList.length === 2 ? (
        <Wrap>
          <Layout>
            <MainWrap>
              <div className='title'>선택한 약품 비교하기</div>
              <div className='versus'>
                <VersusCard info={versusList[0]} type='A' />
                <VersusCard info={versusList[1]} type='B' />
              </div>
            </MainWrap>
            <TabBar location={location} query={query} />
            <SubWrap
              totalAmountAAxtive={totalAmountAAxtive}
              totalAmountBAxtive={totalAmountBAxtive}>
              {query === '성분그래프' ? (
                <div className='content'>
                  <div className='graphWrap'>
                    <div id='chartdiv'></div>
                    <div className='graphNameWrap'>
                      <div className='graphNameBox'>
                        <div className='graphName A'>
                          {versusList[0].itemName}
                        </div>
                        <div className='totalAmountWrap A'>
                          <div className='totalAmountTitle'>총 용량</div>
                          <div
                            className='totalAmountBtn'
                            onMouseOver={AtotalAmountMouseOver}
                            onMouseOut={AtotalAmountMouseOver}>
                            더보기
                          </div>
                          <div className='totalAmountDesc'>
                            {versusList[0].totalAmount}
                          </div>
                        </div>
                      </div>
                      <div className='graphNameBox'>
                        <div className='graphName B'>
                          {versusList[1].itemName}
                        </div>
                        <div className='totalAmountWrap B'>
                          <div className='totalAmountTitle'>총 용량</div>
                          <div
                            className='totalAmountBtn'
                            onMouseOver={BtotalAmountMouseOver}
                            onMouseOut={BtotalAmountMouseOver}>
                            더보기
                          </div>
                          <div className='totalAmountDesc'>
                            {versusList[1].totalAmount}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='versusContentWrap'>
                    <div className='versusContentGraph'>
                      <div className='legendWrap'>
                        <MatrialExplainWrap
                          BoxY={materialExplainY}
                          Active={materialAExplainActive}
                          style={{ left: '1px' }}>
                          <div className='title'>
                            <span>성분명</span>
                            {materialExplainName}
                          </div>
                          <div className='desc'>{materialExplainDesc}</div>
                        </MatrialExplainWrap>
                        <div className='legendTitle'>
                          유효성분 함량
                          {allergy1 ? (
                            <WarningAllergyTrue>
                              <span>알레르기 주의</span>
                              <div className='allergyTrueIcon'>
                                <span className='allergyAmountIcon'>
                                  내가 등록한 알레르기를 유발하는 성분이
                                  포함되어 있습니다. 복용에 주의하세요!
                                </span>
                              </div>
                            </WarningAllergyTrue>
                          ) : (
                            <WarningAllergyFalse>
                              <span>주의성분 없음</span>
                              <div className='allergyFalseIcon'>
                                <span className='allergyAmountIcon'>
                                  내가 등록한 알레르기를 유발하는 성분이
                                  포함되어 있지 않습니다. 알레르기 등록은
                                  마이페이지에서 가능해요!
                                </span>
                              </div>
                            </WarningAllergyFalse>
                          )}
                        </div>
                        <div className='legendBox'>
                          <Legenddiv
                            height={legendHeightA}
                            id='legenddiv'></Legenddiv>
                        </div>
                      </div>
                    </div>
                    <div className='versusContentMaterialWrap'>
                      <div className='legendTitle'>
                        주요 유효성분
                        <div className='mainMaterialIcon'>
                          <span className='mainMaterialAmountIcon'>
                            해당 의약품에서 가장 중요한 성분 3가지를 뽑아
                            사용자에게 제공합니다. 제공되는 성분 3가지는 용량에
                            상관없이{' '}
                            <sapn className='mainMaterialDesc'>
                              오직 중요순서로 기재됩니다.
                            </sapn>
                          </span>
                        </div>
                      </div>
                      <ul>
                        {versusList[0].materialName.map((list) =>
                          versusList[0].materialName.indexOf(list) < 3 ? (
                            versusList[0].materialName.indexOf(list) === 0 ? (
                              <li key={list.material}>
                                <div
                                  className={
                                    list.allergy
                                      ? 'top1AllergyTrue'
                                      : 'top1AllergyFalse'
                                  }>
                                  <div className='versusContentMaterialPercent'>
                                    {Math.round(
                                      (Number(list.분량) /
                                        medicineTotalAmount(versusList[0])) *
                                        100
                                    )}
                                    %
                                  </div>
                                </div>
                                <div
                                  className={
                                    list.allergy
                                      ? 'versusMaterialNameAllergyTrue'
                                      : 'versusMaterialNameAllergyFalse'
                                  }>
                                  {list.material}
                                </div>
                              </li>
                            ) : versusList[0].materialName.indexOf(list) ===
                              1 ? (
                              <li key={list.material}>
                                <div className='percentBox'>
                                  <div
                                    className={
                                      list.allergy
                                        ? 'top2AllergyTrue'
                                        : 'top2AllergyFalse'
                                    }>
                                    <div className='versusContentMaterialPercent'>
                                      {Math.round(
                                        (Number(list.분량) /
                                          medicineTotalAmount(versusList[0])) *
                                          100
                                      )}
                                      %
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className={
                                    list.allergy
                                      ? 'versusMaterialNameAllergyTrue'
                                      : 'versusMaterialNameAllergyFalse'
                                  }>
                                  {list.material}
                                </div>
                              </li>
                            ) : (
                              <li key={list.material}>
                                <div className='percentBox'>
                                  <div
                                    className={
                                      list.allergy
                                        ? 'top3AllergyTrue'
                                        : 'top3AllergyFalse'
                                    }>
                                    <div className='versusContentMaterialPercent'>
                                      {Math.round(
                                        (Number(list.분량) /
                                          medicineTotalAmount(versusList[0])) *
                                          100
                                      )}
                                      %
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className={
                                    list.allergy
                                      ? 'versusMaterialNameAllergyTrue'
                                      : 'versusMaterialNameAllergyFalse'
                                  }>
                                  {list.material}
                                </div>
                              </li>
                            )
                          ) : null
                        )}
                      </ul>
                    </div>
                  </div>
                  <div className='versusContentWrap'>
                    <div
                      className='versusContentGraph'
                      style={{ float: 'right' }}>
                      <div className='legendWrap'>
                        <MatrialExplainWrap
                          BoxY={materialExplainY}
                          Active={materialBExplainActive}>
                          <div className='title'>
                            <span>성분명</span>
                            {materialExplainName}
                          </div>
                          <div className='desc'>{materialExplainDesc}</div>
                        </MatrialExplainWrap>
                        <div
                          className='legendTitle'
                          style={{
                            marginLeft: 'auto',
                            justifyContent: 'right',
                            display: 'flex',
                          }}>
                          유효성분 함량
                          {allergy2 ? (
                            <WarningAllergyTrue>
                              <span>알레르기 주의</span>
                              <div className='allergyTrueIcon'>
                                <span className='allergyAmountIcon'>
                                  내가 등록한 알레르기를 유발하는 성분이
                                  포함되어 있습니다. 복용에 주의하세요!
                                </span>
                              </div>
                            </WarningAllergyTrue>
                          ) : (
                            <WarningAllergyFalse>
                              <span>주의성분 없음</span>
                              <div className='allergyFalseIcon'>
                                <span className='allergyAmountIcon'>
                                  내가 등록한 알레르기를 유발하는 성분이
                                  포함되어 있지 않습니다. 알레르기 등록은
                                  마이페이지에서 가능해요!
                                </span>
                              </div>
                            </WarningAllergyFalse>
                          )}
                        </div>
                        <div className='legendBox2'>
                          <Legenddiv
                            height={legendHeightB}
                            id='legenddiv2'></Legenddiv>
                        </div>
                      </div>
                    </div>
                    <div
                      className='versusContentMaterialWrap'
                      style={{ float: 'right' }}>
                      <div className='legendTitle'>
                        주요 유효성분
                        <div className='mainMaterialIcon'>
                          <span className='mainMaterialAmountIcon'>
                            해당 의약품에서 가장 중요한 성분 3가지를 뽑아
                            사용자에게 제공합니다. 제공되는 성분 3가지는 용량에
                            상관없이{' '}
                            <sapn className='mainMaterialDesc'>
                              오직 중요순서로 기재됩니다.
                            </sapn>
                          </span>
                        </div>
                      </div>
                      <ul>
                        {versusList[1].materialName.map((list) =>
                          versusList[1].materialName.indexOf(list) < 3 ? (
                            versusList[1].materialName.indexOf(list) === 0 ? (
                              <li key={list.material}>
                                <div
                                  className={
                                    list.allergy
                                      ? 'top1AllergyTrue'
                                      : 'top1AllergyFalse'
                                  }>
                                  <div className='versusContentMaterialPercent'>
                                    {Math.round(
                                      (Number(list.분량) /
                                        medicineTotalAmount(versusList[1])) *
                                        100
                                    )}
                                    %
                                  </div>
                                </div>
                                <div
                                  className={
                                    list.allergy
                                      ? 'versusMaterialNameAllergyTrue'
                                      : 'versusMaterialNameAllergyFalse'
                                  }>
                                  {list.material}
                                </div>
                              </li>
                            ) : versusList[1].materialName.indexOf(list) ===
                              1 ? (
                              <li key={list.material}>
                                <div className='percentBox'>
                                  <div
                                    className={
                                      list.allergy
                                        ? 'top2AllergyTrue'
                                        : 'top2AllergyFalse'
                                    }>
                                    <div className='versusContentMaterialPercent'>
                                      {Math.round(
                                        (Number(list.분량) /
                                          medicineTotalAmount(versusList[1])) *
                                          100
                                      )}
                                      %
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className={
                                    list.allergy
                                      ? 'versusMaterialNameAllergyTrue'
                                      : 'versusMaterialNameAllergyFalse'
                                  }>
                                  {list.material}
                                </div>
                              </li>
                            ) : (
                              <li key={list.material}>
                                <div className='percentBox'>
                                  <div
                                    className={
                                      list.allergy
                                        ? 'top3AllergyTrue'
                                        : 'top3AllergyFalse'
                                    }>
                                    <div className='versusContentMaterialPercent'>
                                      {Math.round(
                                        (Number(list.분량) /
                                          medicineTotalAmount(versusList[1])) *
                                          100
                                      )}
                                      %
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className={
                                    list.allergy
                                      ? 'versusMaterialNameAllergyTrue'
                                      : 'versusMaterialNameAllergyFalse'
                                  }>
                                  {list.material}
                                </div>
                              </li>
                            )
                          ) : null
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className='content'>
                  <VersusContent medicineInfo={versusList[0]} query={query} />
                  <VersusContent medicineInfo={versusList[1]} query={query} />
                </div>
              )}
            </SubWrap>
          </Layout>
        </Wrap>
      ) : (
        <Wrap style={{ backgroundColor: '#f9faff' }}>
          <Layout>
            <NothingInBoxWrap>
              <div className='title'>약국 비교함에 약을 담아 비교해보세요!</div>
              <div className='explainImage1'></div>
              <div className='explainImage2'></div>
            </NothingInBoxWrap>
          </Layout>
        </Wrap>
      )}
    </>
  );
};

const Wrap = styled.div`
  width: 100%;
  @media screen and (max-width: 1700px) {
    min-width: 1024px;
  }
`;
const MainWrap = styled.div`
  width: 100%;
  margin: 0 auto 20px;
  .title {
    @media screen and (max-width: 1700px) {
      font-size: 26px;
    }
    font-size: 30px;
    font-weight: bold;
    line-height: 43px;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 24px;
    text-align: center;
  }
  .versus {
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    gap: 20px;
  }
`;
const VersusCardWrap = styled.div`
  position: relative;
  .card {
    @media screen and (max-width: 1700px) {
      width: 280px;
      min-height: 320px;
      padding: 20px 24px;
    }
    width: 324px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.15);
    border-radius: 25px;
    z-index: 5;
  }
  .cardImg {
    @media screen and (max-width: 1700px) {
      width: 100%;
      margin: 0 0 12px 0;
    }
    width: 256px;
    height: 110px;
    background-image: ${({ image }) =>
      image ? `url(${image})` : `url('/assets/image/PillDefaultImg.png')`};
    background-size: cover;
    background-position: 50% 20%;
    border-radius: 8px;
    background-repeat: no-repeat;
    margin: 30px 0 24px;
  }
  .cardName {
    @media screen and (max-width: 1700px) {
      /* margin-bottom: 8px; */
      font-size: 18px;
      line-height: 25px;
      margin: 0 22px 8px 22px;
      min-height: 38px;
      display: flex;
      align-items: center;
    }
    font-size: 20px;
    font-weight: bold;
    line-height: 29px;
    color: #242424;
    margin: 0 34px 22px;
    word-break: break-all;
  }
  .cardContentDescWrap {
    @media screen and (max-width: 1700px) {
      margin-bottom: 8px;
    }
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 14px;
  }
  .cardContentDesc {
    @media screen and (max-width: 1700px) {
      font-size: 14px;
      line-height: 20px;
    }
    width: 120px;
    font-size: 15px;
    line-height: 22px;
    color: #868686;
  }
  .cardContentDescWrap hr {
    @media screen and (max-width: 1700px) {
      font-size: 14px;
    }
    width: 2px;
    height: 18px;
    border: none;
    background-color: #888888;
    margin: 0 8px;
  }
  .cardContentTagWrap {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
  }
  .cardContentTag {
    @media screen and (max-width: 1700px) {
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 10px;
    }
    padding: 5px 7px;
    background-color: #ebf0ff;
    color: #3366ff;
    border-radius: 5px;
    margin-bottom: 18px;
    text-align: center;
  }
  .cardBtnWrap {
    @media screen and (max-width: 1700px) {
      margin-bottom: 0px;
    }
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 30px;
  }
  .goToDetailBtn {
    @media screen and (max-width: 1700px) {
      width: 170px;
    }
    width: 210px;
    height: 38px;
    background-color: #3366ff;
    border-radius: 8px;
    color: #ffffff;
    border: none;
    font-size: 14px;
    line-height: 20px;
    cursor: pointer;
  }
  .characterImg {
    position: absolute;
    bottom: 0;
    ${({ type }) =>
      type === 'A'
        ? `
    background-image : url("/assets/image/versusCharacterA.png");
    background-size: cover;
    background-position: center;
    width: 141px;
    height: 132px;
    left: -112.5px;
    `
        : `
    background-image : url("/assets/image/versusCharacterB.png");
    background-size: cover;
    background-position: center;
    width: 102.75px;
    height: 179.25px;
    right: -90px;
    `}
  }
`;
const SubWrap = styled.div`
  width: 100%;
  margin-bottom: 60px;
  .content {
    width: 100%;
    display: flex;
    gap: 20px;
    margin-bottom: 50px;
    position: relative;
  }
  .versusContentWrap {
    @media screen and (max-width: 1700px) {
      font-size: 17px;
      line-height: 34px;
    }
    width: 100%;
    background-color: #f6f7fa;
    border-radius: 25px;
    padding: 40px 40px;
    white-space: pre-wrap;
    word-break: break-all;
    min-height: 530px;
    font-size: 24px;
    line-height: 40px;
  }
  .versusContentGraph {
    display: flex;
    justify-content: space-between;
    gap: 114px;
    margin-bottom: 78px;
  }
  .materialPercent {
    font-size: 24px;
    line-height: 35px;
    font-weight: bold;
    margin-right: 13px;
  }
  .materialName {
    font-size: 18px;
    line-height: 26px;
    color: #242424;
  }
  .legendTitle {
    @media screen and (max-width: 1700px) {
      font-size: 22px;
    }
    color: #242424;
    font-size: 25px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .legendWrap {
    position: relative;
  }
  .legendBox {
    width: 260px;
    height: 294px;
    overflow-y: auto;
  }
  .legendBox::-webkit-scrollbar {
    width: 15px;
  }
  .legendBox::-webkit-scrollbar-thumb {
    background-color: #b7b7b7;
    border-radius: 5px;
  }
  .legendBox::-webkit-scrollbar-track {
    background-color: white;
    border-radius: 5px;
  }
  .legendBox2 {
    width: 260px;
    height: 294px;
    overflow-y: auto;
    margin-left: auto;
  }
  .legendBox2::-webkit-scrollbar {
    width: 15px;
  }
  .legendBox2::-webkit-scrollbar-thumb {
    background-color: #b7b7b7;
    border-radius: 5px;
  }
  .legendBox2::-webkit-scrollbar-track {
    background-color: white;
    border-radius: 5px;
  }
  .graphWrap {
    margin-top: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 0;
  }
  .graphNameWrap {
    width: 430px;
    display: flex;
    gap: 81px;
    justify-content: center;
  }
  .graphNameBox {
    width: 140px;
  }
  .graphName {
    @media screen and (max-width: 1700px) {
      padding: 7px 10px;
    }
    padding: 6px 10px;
    white-space: normal;
    word-break: break-all;
    border-radius: 10px;
    color: #242424;
    font-size: 15px;
    line-height: 22px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 10px;
  }
  .graphName.A {
    background-color: #a9beff;
  }
  .graphName.B {
    background-color: #7e66ff;
  }
  .totalAmountWrap {
    display: flex;
    align-items: center;
    position: relative;
  }
  .totalAmountWrap.A {
    justify-content: right;
  }
  .totalAmountWrap.B {
    justify-content: left;
  }
  .totalAmountTitle {
    @media screen and (max-width: 1700px) {
      font-size: 14px;
    }
    font-size: 16px;
    color: #868686;
    margin-right: 5px;
  }
  .totalAmountBtn {
    @media screen and (max-width: 1700px) {
      font-size: 12px;
    }
    width: 44px;
    height: 20px;
    font-size: 13px;
    line-height: 20px;
    background-color: #d0d0d0;
    border-radius: 4px;
    color: white;
    margin-left: 4px;
    text-align: center;
    cursor: pointer;
  }
  .totalAmountDesc {
    @media screen and (max-width: 1700px) {
      font-size: 14px;
      padding: 8px;
    }
    position: absolute;
    top: 30px;
    max-width: 177px;
    padding: 12px 10px;
    color: white;
    border-radius: 8px;
    background-color: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(11.5px);
    word-break: break-all;
  }
  .totalAmountWrap.A .totalAmountDesc {
    display: ${({ totalAmountAAxtive }) =>
      totalAmountAAxtive ? 'block' : 'none'};
    right: 0px;
  }
  .totalAmountWrap.B .totalAmountDesc {
    display: ${({ totalAmountBAxtive }) =>
      totalAmountBAxtive ? 'block' : 'none'};

    left: 0px;
  }
  .totalAmountDesc::after {
    content: '';
    width: 0px;
    height: 0px;
    border-bottom: 10px solid rgba(0, 0, 0, 0.65);
    border-top: 10px solid transparent;
    border-left: 3px solid transparent;
    border-right: 3px solid transparent;
    position: absolute;
    top: -20px;
  }
  .totalAmountWrap.A .totalAmountDesc::after {
    right: 19px;
  }
  .totalAmountWrap.B .totalAmountDesc::after {
    left: 71px;
  }
  #chartdiv {
    width: 430px;
    height: 300px;
    margin-bottom: 30px;
  }
  .versusContentMaterialWrap {
    width: 100%;
    height: 400px;
    padding: 30px 40px;
    background-color: white;
    border-radius: 25px;
  }
  .versusContentMaterialWrap ul {
    height: 250px;
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 24px;
  }
  .versusContentMaterialWrap ul li {
    font-size: 20px;
    height: 80px;
    display: flex;
    align-items: center;
  }
  .versusContentMaterialPercent {
    @media screen and (max-width: 1700px) {
      font-size: 22px;
    }
    width: 80px;
    font-size: 28px;
    line-height: 41px;
    font-weight: bold;
  }
  .versusMaterialNameAllergyTrue {
    width: 75%;
    line-height: 34px;
    white-space: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    margin-left: 12px;
    color: #ff3c26;
    text-align: center;
  }
  .versusMaterialNameAllergyFalse {
    @media screen and (max-width: 1700px) {
      font-size: 18px;
    }
    width: 75%;
    line-height: 34px;
    white-space: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    margin-left: 12px;
    text-align: center;
  }
  .top1AllergyFalse {
    width: 90px;
    height: 90px;
    background-color: #84a9ff;
    color: black;
    border-radius: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  .top1AllergyTrue {
    width: 90px;
    height: 90px;
    background-color: #ffecea;
    color: #ff3c26;
    border-radius: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  .top2AllergyFalse {
    width: 82px;
    height: 82px;
    background-color: #adc8ff;
    color: #434343;
    border-radius: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  .top2AllergyTrue {
    width: 82px;
    height: 82px;
    background-color: #ffecea;
    color: #ff3c26;
    border-radius: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  .top3AllergyFalse {
    width: 75px;
    height: 75px;
    background-color: #d6e4ff;
    color: #686868;
    border-radius: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  .top3AllergyTrue {
    width: 75px;
    height: 75px;
    background-color: #ffecea;
    color: #ff3c26;
    border-radius: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  .percentBox {
    width: 90px;
    height: 90px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .mainMaterialIcon {
    @media screen and (max-width: 1700px) {
      width: 26px;
      height: 26px;
      margin-top: 3px;
    }
    width: 30px;
    height: 30px;
    margin-left: 6px;
    background-image: url('/assets/image/주요유효성분아이콘.png');
    background-size: cover;
    background-position: center;
    display: inline-block;
    position: relative;
    :hover .mainMaterialAmountIcon {
      display: block;
    }
    .mainMaterialAmountIcon {
      border-radius: 8px;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(11.5px);
      display: none;
      position: absolute;
      top: 40px;
      right: -50px;
      text-align: center;
      width: 256px;
      padding: 12px 10px;
      font-size: 14px;
      line-height: 22px;
      font-weight: 350;
      color: #ffffff;
      opacity: 1;
      z-index: 2;
      word-break: break-all;
      text-align: left;
    }
    .mainMaterialAmountIcon::after {
      content: '';
      width: 0px;
      height: 0px;
      border-bottom: 10px solid rgba(0, 0, 0, 0.8);
      border-top: 10px solid transparent;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      position: absolute;
      right: 59px;
      top: -20px;
    }
    .mainMaterialDesc {
      color: #82a1ff;
      font-weight: 700;
      font-size: 15px;
    }
  }
`;
const NothingInBoxWrap = styled.div`
  width: 100%;
  height: 1000px;
  background-color: #f9faff;
  @media screen and (max-width: 1700px) {
    height: 93.8vh;
  }
  @media screen and (min-width: 2560px) {
    height: 93.8vh;
  }
  .title {
    font-size: 40px;
    line-height: 58px;
    font-weight: bold;
    color: #242424;
    text-align: center;
    margin-bottom: 58px;
    @media screen and (max-width: 1700px) {
      margin-bottom: 40px;
      font-size: 35px;
    }
    @media screen and (min-width: 2560px) {
      margin-top: 80px;
    }
  }
  .explainImage1 {
    width: 100%;
    height: 240px;
    background-image: url('/assets/image/explainCompare1.png');
    background-size: cover;
    background-position: center;
    margin-bottom: 55px;
    @media screen and (max-width: 1700px) {
      background-size: 100%;
      background-repeat: no-repeat;
      margin-bottom: 0px;
      height: 200px;
    }
    @media screen and (min-width: 2560px) {
      margin-bottom: 80px;
    }
  }
  .explainImage2 {
    width: 100%;
    height: 440px;
    background-image: url('/assets/image/explainCompare2.png');
    background-size: cover;
    background-position: center;
    @media screen and (max-width: 1700px) {
      background-size: 100%;
      background-repeat: no-repeat;
      height: 340px;
    }
  }
`;
const MatrialExplainWrap = styled.div`
  display: ${({ Active }) => (Active ? 'block' : 'none')};
  width: 259px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(11.5px);
  padding: 15px 30px 20px 30px;
  /* padding: 29px 24px 16px; */
  border-radius: 15px;
  line-height: 34px;
  position: absolute;
  left: 2px;
  z-index: 1;
  color: white;
  /* top: ${({ BoxY }) => `${BoxY - 15}px`}; */
  top: 0px;

  backdrop-filter: blur(5px);
  .title {
    margin-top: 15px;
    font-size: 20px;
    margin-bottom: 15px;
    display: flex;
    /* align-items: center; */
    color: #87a5ff;
    font-weight: 700;
    min-height: 65px;
    /* margin-left: 6px; */
  }
  .title span {
    min-width: 56px;
    font-size: 17px;
    margin-right: 6px;
    line-height: 34px;
    color: white;
  }
  .desc {
    font-size: 16px;
    line-height: 34px;
    font-weight: 400;
  }
`;

const WarningAllergyTrue = styled.div`
  @media screen and (max-width: 1700px) {
    width: 120px;
    height: 30px;
  }
  width: 140px;
  height: 34px;
  background-color: #ffecea;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 700;
  line-height: 20px;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  color: #ff392b;
  .allergyTrueIcon {
    @media screen and (max-width: 1700px) {
      width: 18px;
      height: 18px;
      margin-top: 1px;
      margin-left: 4px;
    }
    margin-left: 6px;
    width: 20px;
    height: 20px;
    background-image: url('/assets/image/알러지성분안내아이콘_red.png');
    background-size: cover;
    background-position: center;
    display: inline-block;
  }
  span {
    @media screen and (max-width: 1700px) {
      font-size: 15px;
    }
    font-weight: 700;
    font-size: 18px;
    line-height: 20px;
  }
  :hover .allergyAmountIcon {
    display: block;
  }
  .allergyAmountIcon {
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(11.5px);
    display: none;
    position: absolute;
    top: 40px;
    right: -26px;
    text-align: center;
    width: 256px;
    padding: 12px;
    font-size: 14px;
    line-height: 22px;
    font-weight: 350;
    color: #ffffff;
    opacity: 1;
    z-index: 2;
    font-weight: 400;
    font-size: 14px;
    word-break: break-all;
    text-align: left;
  }
  .allergyAmountIcon::after {
    content: '';
    width: 0px;
    height: 0px;
    border-bottom: 10px solid rgba(0, 0, 0, 0.8);
    border-top: 10px solid transparent;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    position: absolute;
    right: 40px;
    top: -20px;
  }
`;

const WarningAllergyFalse = styled.div`
  @media screen and (max-width: 1700px) {
    width: 120px;
    height: 30px;
    margin-left: 6px;
  }
  width: 140px;
  height: 34px;
  background-color: #ddf3eb;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 700;
  line-height: 20px;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  color: #03935b;
  .allergyFalseIcon {
    @media screen and (max-width: 1700px) {
      width: 18px;
      height: 18px;
      margin-top: 1px;
      margin-left: 4px;
    }
    margin-left: 6px;
    width: 20px;
    height: 20px;
    background-image: url('/assets/image/알러지성분안내아이콘_green.png');
    background-size: cover;
    background-position: center;
    display: inline-block;
  }
  span {
    @media screen and (max-width: 1700px) {
      font-size: 15px;
    }
    font-weight: 700;
    font-size: 18px;
    line-height: 20px;
  }
  :hover .allergyAmountIcon {
    display: block;
  }
  .allergyAmountIcon {
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(11.5px);
    display: none;
    position: absolute;
    top: 40px;
    right: -26px;
    text-align: center;
    width: 256px;
    padding: 12px;
    font-size: 14px;
    line-height: 22px;
    font-weight: 350;
    color: #ffffff;
    opacity: 1;
    z-index: 2;
    font-weight: 400;
    font-size: 14px;
    word-break: break-all;
    text-align: left;
  }
  .allergyAmountIcon::after {
    content: '';
    width: 0px;
    height: 0px;
    border-bottom: 10px solid rgba(0, 0, 0, 0.8);
    border-top: 10px solid transparent;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    position: absolute;
    right: 41px;
    top: -20px;
  }
`;

const Legenddiv = styled.div`
  width: 100%;
  height: ${({ height }) => (height ? height : '100%')};
`;

export default LaptopCompare;
