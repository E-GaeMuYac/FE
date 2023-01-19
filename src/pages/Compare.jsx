import styled from 'styled-components';

import qs from 'qs';

import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useLayoutEffect, useState } from 'react';

//component
import TabBar from '../components/common/Tabbar';

// 그래프 라이브러리
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

import { useRecoilValue } from 'recoil';
import { compareBoxData } from '../recoil/recoilStore';

import { useGetVersusQuery } from '../query/versusQuery';
import LikeItBtn from '../components/common/LikeItBtn';
import Layout from '../components/layout/Layout';

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

const VersusCard = ({ info }) => {
  const navigate = useNavigate();
  const gotoDetail = (id) => {
    navigate(`/detail/${id}?tab=효능 효과`);
  };
  return (
    <VersusCardWrap image={info.itemImage}>
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
    </VersusCardWrap>
  );
};

const ComparePage = () => {
  const location = useLocation().pathname;
  const query = qs.parse(window.location.search, {
    ignoreQueryPrefix: true,
  }).tab;
  const navigate = useNavigate();

  const [versusList, setVersusList] = useState([]);

  const compareBoxArr = useRecoilValue(compareBoxData);

  const comparePillIdA = compareBoxArr[0].medicineId;
  const comparePillIdB = compareBoxArr[1].medicineId;

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

  let graphData = [];
  const [grapDataArr, setGrapDataArr] = useState([]);

  const [materialAExplainActive, setMaterialAExplainActive] = useState(false);
  const [materialBExplainActive, setMaterialBExplainActive] = useState(false);
  const [materialExplainY, setMaterialExplainY] = useState(0);
  const [materialExplainName, setMaterialExplainName] = useState('');
  const [materialExplainDesc, setMaterialExplainDesc] = useState('');

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
        };
        graphData.push(newMedicineData);
      }
      //두 번째 약
      for (let i = 0; i < versusList[1].materialName.length; i++) {
        const newMedicineData = {
          material: versusList[1].materialName[i].material,
          explain: versusList[1].materialName[i].설명,
        };
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
          startAngle: -90,
          endAngle: -270,

          tooltip: tootip,

          legendValueText: '{category}',
          legendLabelText: '[bold {fill}]{value}mg',
        })
      );
      //색상 지정
      series
        .get('colors')
        .set('colors', [
          am5.color(0x091a7a),
          am5.color(0x102693),
          am5.color(0x1939b7),
          am5.color(0x254edb),
          am5.color(0x3366ff),
          am5.color(0x6690ff),
          am5.color(0x84a9ff),
          am5.color(0xadc8ff),
          am5.color(0xd6e4ff),
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
          startAngle: -90,
          endAngle: 90,
          tooltip: tootip,

          legendValueText: '{category}',
          legendLabelText: '[bold {fill}]{value}mg',
        })
      );

      //색상 지정
      series2
        .get('colors')
        .set('colors', [
          am5.color(0x091a7a),
          am5.color(0x102693),
          am5.color(0x1939b7),
          am5.color(0x254edb),
          am5.color(0x3366ff),
          am5.color(0x6690ff),
          am5.color(0x84a9ff),
          am5.color(0xadc8ff),
          am5.color(0xd6e4ff),
        ]);
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
        fontSize: 18,
      });
      legend.valueLabels.template.setAll({
        minWidth: 130,
        maxWidth: 130,
        marginRight: 10,
        fontSize: 18,
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
        fontSize: 18,
      });
      legend2.valueLabels.template.setAll({
        minWidth: 130,
        maxWidth: 130,
        marginRight: 10,
        fontSize: 18,
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
      //마커 크기 변경
      legend.markers.template.setAll({
        width: 30,
        height: 30,
        marginRight: 17,
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
        width: 30,
        height: 30,
        marginRight: 17,
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
    <Wrap>
      {versusList.length === 2 ? (
        <Layout>
          <MainWrap>
            <div className='title'>선택한 약품 비교하기</div>
            <div className='versus'>
              <VersusCard info={versusList[0]} />
              <div className='versusImage'></div>
              <VersusCard info={versusList[1]} />
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
                      <div className='graphName'>{versusList[0].itemName}</div>
                      <div className='totalAmountWrap A'>
                        <div className='totalAmountTitle'>총 용량</div>
                        <div
                          className='totalAmountBtn'
                          onMouseOver={AtotalAmountMouseOver}
                          onMouseOut={AtotalAmountMouseOver}></div>
                        <div className='totalAmountDesc'>
                          {versusList[0].totalAmount}
                        </div>
                      </div>
                    </div>
                    <div className='graphNameBox'>
                      <div className='graphName'>{versusList[1].itemName}</div>
                      <div className='totalAmountWrap B'>
                        <div className='totalAmountTitle'>총 용량</div>
                        <div
                          className='totalAmountBtn'
                          onMouseOver={BtotalAmountMouseOver}
                          onMouseOut={BtotalAmountMouseOver}></div>
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
                        Active={materialAExplainActive}>
                        <div className='title'>
                          <span>성분명</span>
                          {materialExplainName}
                        </div>
                        <div className='desc'>{materialExplainDesc}</div>
                      </MatrialExplainWrap>
                      <div className='legendTitle'>유효성분 함량</div>
                      <div className='legendBox'>
                        <div id='legenddiv'></div>
                      </div>
                    </div>
                  </div>
                  <div className='versusContentMaterialWrap'>
                    <div className='legendTitle'>주요 유효성분</div>
                    <ul>
                      {versusList[0].materialName.map((list) =>
                        versusList[0].materialName.indexOf(list) < 3 ? (
                          <li key={list.material}>
                            <div className='versusContentMaterialPercent'>
                              {Math.round(
                                (Number(list.분량) /
                                  medicineTotalAmount(versusList[0])) *
                                  100
                              )}
                              %
                            </div>
                            <div className='versusContentMaterialName'>
                              {list.material}
                            </div>
                          </li>
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
                      <div className='legendTitle'>유효성분 함량</div>
                      <div className='legendBox'>
                        <div id='legenddiv2'></div>
                      </div>
                    </div>
                  </div>
                  <div
                    className='versusContentMaterialWrap'
                    style={{ float: 'right' }}>
                    <div className='legendTitle'>주요 유효성분</div>
                    <ul>
                      {versusList[1].materialName.map((list) =>
                        versusList[1].materialName.indexOf(list) < 3 ? (
                          <li key={list.material}>
                            <div className='versusContentMaterialPercent'>
                              {Math.round(
                                (Number(list.분량) /
                                  medicineTotalAmount(versusList[1])) *
                                  100
                              )}
                              %
                            </div>
                            <div className='versusContentMaterialName'>
                              {list.material}
                            </div>
                          </li>
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
      ) : (
        <NothingInBoxWrap>
          <Layout>
            <div className='title'>약국 비교함에 약을 담아 비교해보세요!</div>
            <div className='explainImage1'></div>
            <div className='explainImage2'></div>
          </Layout>
        </NothingInBoxWrap>
      )}
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
    text-align: center;
  }
  .versus {
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .versusImage {
    width: 238px;
    height: 161px;
    background-image: url('/assets/image/versusImg.png');
    background-size: cover;
    background-position: center;
  }
`;
const VersusCardWrap = styled.div`
  width: 324px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #d0d0d0;
  border-radius: 25px;
  .cardImg {
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
    font-size: 20px;
    font-weight: bold;
    line-height: 29px;
    color: #242424;
    margin: 0 34px 22px;
    word-break: break-all;
  }
  .cardContentDescWrap {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 14px;
  }
  .cardContentDesc {
    width: 120px;
    font-weight: bold;
    font-size: 15px;
    line-height: 22px;
    color: #868686;
  }
  .cardContentDescWrap hr {
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
    padding: 5px 7px;
    background-color: #ebf0ff;
    color: #3366ff;
    border-radius: 5px;
    font-weight: bold;
    margin-bottom: 18px;
  }
  .cardBtnWrap {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 30px;
  }
  .likeBtn {
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    border: none;
    box-shadow: 0 0 6px 1px rgba(0, 0, 0, 0.2);
    background-color: white;
    cursor: pointer;
  }
  .likeBtnImg {
    width: 26px;
    height: 26px;
    background-image: url('/assets/image/icon_heart1.png');
    background-size: cover;
    background-position: center;
  }
  .goToDetailBtn {
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
`;
const SubWrap = styled.div`
  width: 100%;
  margin-bottom: 200px;
  .content {
    width: 100%;
    display: flex;
    gap: 20px;
    margin-bottom: 50px;
    position: relative;
  }
  .versusContentWrap {
    width: 100%;
    background-color: #f6f7fa;
    border-radius: 25px;
    padding: 40px 70px;
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
    color: #242424;
    font-size: 30px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 30px;
  }
  .legendWrap {
    position: relative;
  }
  .legendBox {
    width: 338px;
    height: 405px;
    overflow-y: scroll;
  }
  .legendBox::-webkit-scrollbar {
    width: 18px;
  }
  .legendBox::-webkit-scrollbar-thumb {
    background-color: #b7b7b7;
    border-radius: 5px;
  }
  .legendBox::-webkit-scrollbar-track {
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
    width: 155px;
  }
  .graphName {
    padding: 6px 10px;
    white-space: normal;
    background-color: #c2d2ff;
    word-break: break-all;
    border-radius: 10px;
    color: #242424;
    font-size: 15px;
    line-height: 22px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 10px;
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
    font-size: 16px;
    color: #868686;
    margin-right: 5px;
  }
  .totalAmountBtn {
    width: 20px;
    height: 20px;
    border-radius: 10px;
    background-color: #d0d0d0;
    cursor: pointer;
  }
  .totalAmountDesc {
    position: absolute;
    top: 35px;
    max-width: 177px;
    padding: 12px 10px;
    color: white;
    border-radius: 8px;
    background-color: rgba(0, 0, 0, 0.65);
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
    top: -19px;
  }
  .totalAmountWrap.A .totalAmountDesc::after {
    right: 8px;
  }
  .totalAmountWrap.B .totalAmountDesc::after {
    left: 65px;
  }
  #chartdiv {
    width: 430px;
    height: 400px;
    margin-bottom: 30px;
  }
  #legenddiv {
    width: 100%;
    height: 1000px;
  }
  #legenddiv2 {
    width: 100%;
    height: 1000px;
  }
  .versusContentMaterialWrap {
    width: 400px;
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
    height: 68px;
    display: flex;
    align-items: center;
  }
  .versusContentMaterialPercent {
    width: 80px;
    font-size: 28px;
    line-height: 41px;
    font-weight: bold;
  }
  .versusContentMaterialName {
    width: 221px;
    line-height: 34px;
    white-space: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
`;
const NothingInBoxWrap = styled.div`
  width: 100%;
  height: 1000px;
  background-color: #f9faff;
  .title {
    font-size: 40px;
    line-height: 58px;
    font-weight: bold;
    color: #242424;
    text-align: center;
    margin-bottom: 58px;
  }
  .explainImage1 {
    width: 100%;
    height: 213px;
    background-image: url('/assets/image/explainCompare1.png');
    background-size: cover;
    background-position: center;
    margin-bottom: 55px;
  }
  .explainImage2 {
    width: 100%;
    height: 429.21px;
    background-image: url('/assets/image/explainCompare2.png');
    background-size: cover;
    background-position: center;
  }
`;
const MatrialExplainWrap = styled.div`
  display: ${({ Active }) => (Active ? 'block' : 'none')};
  width: 338px;
  background-color: rgba(0, 0, 0, 0.54);
  padding: 29px 24px 16px;
  border-radius: 24px;
  line-height: 34px;
  position: absolute;
  left: 0px;
  z-index: 1;
  color: white;
  /* top: ${({ BoxY }) => `${BoxY - 15}px`}; */
  top: 0px;

  backdrop-filter: blur(5px);
  .title {
    font-size: 24px;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    color: #87a5ff;
    font-weight: bold;
    min-height: 65px;
  }
  .title span {
    width: 90px;
    font-size: 18px;
    margin-right: 6px;
    line-height: 34px;
    color: white;
  }
  .desc {
    font-size: 16px;
    line-height: 34px;
  }
`;

export default ComparePage;
