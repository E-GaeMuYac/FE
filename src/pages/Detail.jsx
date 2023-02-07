import React, { useLayoutEffect, useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router';
import qs from 'qs';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { compareBoxData, alertModalState } from '../recoil/recoilStore';
import { userApi } from '../apis/apiInstance';
import { useGetDetailQuery } from '../query/detailQuery';

// 그래프 라이브러리
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

// 컴포넌트
import TabBar from '../components/common/Tabbar';
import LikeItBtn from '../components/common/LikeItBtn';
import Reviews from '../contents/Reviews';
import AlertModal from '../components/common/AlertModal';

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
      case '유효기간':
        setContentDesc(medicineInfo.validTerm);
        break;
      case '주의사항':
        setContentDesc(medicineInfo.nbDocData);
        break;
      default: //기본값 생략
    }
  }, [query, medicineInfo]);
  return (
    <div style={{ width: '100%' }}>
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
  const [aboutAlert, setAboutAlert] = useRecoilState(alertModalState);
  const param = useParams();
  let graphData = [];
  let allergyDataArray = [];
  const [objGraph, setObjGraph] = useState({});
  const [grapDataArr, setGrapDataArr] = useState([]);
  const [materialExplainActive, setMaterialExplainActive] = useState(false);
  const [materialExplainY, setMaterialExplainY] = useState(0);
  const [materialExplainName, setMaterialExplainName] = useState('');
  const [materialExplainDesc, setMaterialExplainDesc] = useState('');
  const [allergy, setAllergy] = useState(false);
  const location = useLocation().pathname;
  const query = qs.parse(window.location.search, {
    ignoreQueryPrefix: true,
  }).tab;

  const medicineItem = objGraph;

  useLayoutEffect(() => {
    if (objGraph) {
      //그래프 초기화
      allergyDataArray = [];

      // 등록한 알러지 성분 정보 받아오기
      for (let i = 0; i < objGraph?.materialName?.length; i++) {
        const allergyData = {
          material: objGraph?.materialName[i]?.material,
          allergy: objGraph?.materialName[i]?.allergy,
        };
        allergyDataArray.push(allergyData);
        if (objGraph?.materialName[i]?.allergy === true) {
          setAllergy(true);
        }
      }
    }
  }, [objGraph, query]);

  //그래프에 들어갈 배열 생성
  useLayoutEffect(() => {
    if (objGraph) {
      //그래프 초기화
      graphData = [];

      // 첫 번째 약의 정보를 우선 받아오기
      for (let i = 0; i < objGraph?.materialName?.length; i++) {
        const newMedicineData = {
          material: objGraph?.materialName[i]?.material,
          explain: objGraph?.materialName[i]?.설명,
          분량: objGraph?.materialName[i]?.분량,
          allergy: objGraph?.materialName[i]?.allergy,
        };
        // console.log(objGraph?.materialName[i]);
        if (objGraph.materialName[i].allergy) {
          newMedicineData['columnSettings'] = {
            fill: am5.color(0xff392b),
            strokeOpacity: 0,
          };
        }
        // console.log(graphData);
        graphData.push(newMedicineData);
      }
      setGrapDataArr(graphData);
    }
  }, [objGraph, query]);

  // 그래프
  // const medicine = [];

  // useLayoutEffect(() => {
  //   if (objGraph) {
  //     // medicine에 속성 추가
  //     for (let i = 0; i < medicineItem.materialName?.length; i++) {
  //       medicine.push(medicineItem.materialName[i]);
  //     }
  //   }
  // }, [objGraph]);

  useLayoutEffect(() => {
    if (objGraph) {
      for (let i = 0; i < objGraph?.materialName?.length; i++) {
        // if (objGraph) {
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

            centerX: am5.percent(-18.5),
            y: am5.percent(-7),
            legendValueText: '{category}',
            legendLabelText: `{value.formatNumber('#.##')}mg`,
          })
        );

        //labels
        series.labels.template.setAll({
          maxWidth: 0,
          oversizedBehavior: 'wrap',
          textAlign: 'left',
        });

        series.slices.template.setAll({ templateField: 'columnSettings' });

        series.ticks.template.setAll({
          stroke: am5.color(0xffffff),
          strokeWidth: 2,
          strokeOpacity: 0,
        });

        series
          .get('colors')
          .set('colors', [
            am5.color(0x091a7a),
            am5.color(0x1939b7),
            am5.color(0x3366ff),
            am5.color(0x6690ff),
            am5.color(0x84a9ff),
            am5.color(0xadc8ff),
            am5.color(0x13097a),
            am5.color(0x2b19b7),
            am5.color(0x5033ff),
            am5.color(0x7e66ff),
            am5.color(0x9984ff),
            am5.color(0xbcadff),
            am5.color(0x0b2d78),
            am5.color(0x1d5cb5),
            am5.color(0x2a7bd8),
            am5.color(0x3a9efc),
            am5.color(0x6bbdfd),
            am5.color(0x88d1fe),
            am5.color(0xb0e4fe),
          ]);

        // 그래프 마우스 오버 시 툴팁
        series.slices.template.set(
          'tooltipText',
          `{category} : {valuePercentTotal.formatNumber('#.###')}%`
        );

        const tooltip = am5.Tooltip.new(root, {});
        tooltip.label.setAll({
          oversizedBehavior: 'wrap',
          maxWidth: 20,
          zIndex: 999,
        });

        series.data.setAll(graphData);

        const legend = chart.children.push(
          am5.Legend.new(root, {
            position: 'absolute',
            oversizedBehavior: 'wrap',
            width: 380,
            height: 350,
            x: am5.percent(1),
            y: am5.percent(0),
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
          width: 29,
          height: 29,
        });

        legend.markers.template.setAll({
          // maxWidth: 70,
          // minWidth: 30,
          width: 29,
          marginRight: 10,
        });

        legend.labels.template.setAll({
          // maxWidth: 100,
          // minWidth: 80,
          marginRight: 10,
          fontSize: 18,
          fontFamily: 'Noto Sans KR',
          fontWeight: 500,
          fill: '#242424',
          templateField: 'columnSettings',
          lineHeight: 2,
          minWidth: 65,
          oversizedBehavior: 'wrap',
          textAlign: 'right',
        });

        legend.valueLabels.template.setAll({
          maxWidth: 200,
          minWidth: 200,
          fontSize: 18,
          fontFamily: 'Noto Sans KR',
          fontWeight: 500,
          fill: '#242424',
          templateField: 'columnSettings',
          lineHeight: 2,
          oversizedBehavior: 'truncate',
        });

        legend.itemContainers.template.events.on('pointerover', (e) => {
          setMaterialExplainActive(true);
          setMaterialExplainName(
            e.target.dataItem.dataContext.dataContext.material
          );
          setMaterialExplainY(e.target._privateSettings.y);
          //e.target.dataItem.dataContext.dataContext.material = 성분 이름 추출
          //e.target._privateSettings.y 축 좌표
        });
        legend.itemContainers.template.events.on('pointerout', (e) => {
          setMaterialExplainActive(false);
        });

        legend.data.setAll(series.dataItems);
        // Play initial series animation
        series.appear(1000, 100);

        return () => {
          root.dispose();
        };
      }
    }
  }, [objGraph]);

  const [totalCount, setTotalCount] = useState(0);
  const medicineId = param.id;
  const data = useGetDetailQuery(medicineId);

  useEffect(() => {
    getReviewCount();
  }, []);

  const getReviewCount = async () => {
    try {
      const res = await userApi.get(`/api/reviews?medicineId=${medicineId}`);
      setTotalCount(res.data.totalReview);
    } catch (error) {
      console.log(error);
    }
  };

  // console.log(data);

  useEffect(() => {
    if (data) {
      setObjGraph(data.data.product);
      // console.log(data.data.product);
    }
    // console.log(objGraph);
  }, [data]);

  const [compareData, setCompareData] = useRecoilState(compareBoxData);

  const putInToCompareBox = (list) => {
    let count = 0;

    for (let i = 0; i < compareData.arr.length; i++) {
      if (compareData.arr[i].itemName === 'null') {
        let newArr = [...compareData.arr];
        newArr[i] = list;
        // setCompareData({ ...compareData, arr: newArr });
        // break;
        if (compareData.length === 1) {
          setCompareData({ ...compareData, arr: newArr, isOpen: 'open' });
        } else {
          setCompareData({ ...compareData, arr: newArr, isOpen: 'close' });
        }

        break;
      } else {
        count++;
      }
      if (count === 2) {
        setCompareData({ ...compareData, isOpen: 'open' });
        setAboutAlert({
          msg: '비교함이 가득 찼습니다.',
          btn: '확인하기',
          isOpen: true,
        });
      }
    }
  };

  const putOutToCompareBox = (id) => {
    let deletedArr = compareData.arr.map((list) =>
      list.medicineId === id
        ? { medicineId: compareData.arr.indexOf(list) + 1, itemName: 'null' }
        : list
    );
    setCompareData({ ...compareData, arr: deletedArr });
  };

  //주요 성분 총량
  const medicineTotalAmount = (arr) => {
    let amount = 0;
    for (let i = 0; i < arr.materialName.length; i++) {
      amount += Number(arr.materialName[i].분량);
    }

    return amount;
  };

  //성분 설명 작업
  useEffect(() => {
    for (let i = 0; i < grapDataArr.length; i++) {
      if (materialExplainName === grapDataArr[i].material) {
        if (grapDataArr[i].explain) {
          setMaterialExplainDesc(grapDataArr[i].explain);
        } else {
          setMaterialExplainDesc('정보가 없습니다.');
        }
      }
    }
  }, [materialExplainName, objGraph]);

  return (
    <>
      {aboutAlert.isOpen && <AlertModal />}
      <TopSection>
        <CardBox>
          <WrapContents>
            <Image imgUrl={medicineItem?.itemImage} />
            <div style={{ marginRight: '20px' }}>
              <Name>{medicineItem?.itemName}</Name>
              <Categorize>
                {medicineItem?.productType?.map((list) => {
                  return <div key={list}>{list}</div>;
                })}
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
                      있습니다.
                    </span>
                  ) : (
                    <span className='tooltipText'>
                      처방전 없이 약국에서 구입할 수 있는 의약품으로, 포장
                      용기에 기재된 설명대로 올바르게 복용한다면 비교적 안전하게
                      사용할 수 있습니다.
                    </span>
                  )}
                </div>
              </BottomLabel>
            </div>
            <div className='boxWrap'>
              <Picked>
                <LikeItBtn
                  id={medicineItem?.medicineId}
                  dibs={medicineItem?.dibs}
                />
              </Picked>
              {medicineItem?.medicineId === compareData.arr[0].medicineId ||
              medicineItem?.medicineId === compareData.arr[1].medicineId ? (
                <div
                  className='compareBox'
                  onClick={() => {
                    putOutToCompareBox(medicineItem?.medicineId);
                  }}>
                  비교함 담기 취소
                </div>
              ) : (
                <button
                  className='compareBox active'
                  onClick={() => {
                    putInToCompareBox(medicineItem);
                  }}>
                  비교함 담기
                </button>
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
            <div style={{ display: 'flex' }}>
              <GraphLabel style={{ width: '700px', marginLeft: '100px' }}>
                유효성분 함량
              </GraphLabel>
              <GraphLabel style={{ width: '1100px', marginLeft: '280px' }}>
                성분 그래프
                {allergy ? (
                  <WarningAllergyTrue>
                    <span>알레르기 주의</span>
                    <div className='allergyTrueIcon'>
                      <span className='allergyTrueAmountIcon'>
                        내가 등록한 알레르기를 유발하는 성분이 포함되어
                        있습니다. 복용에 주의하세요!
                      </span>
                    </div>
                  </WarningAllergyTrue>
                ) : (
                  <WarningAllergyFalse>
                    <span>주의성분 없음</span>
                    <div className='allergyFalseIcon'>
                      <span className='allergyFalseAmountIcon'>
                        내가 등록한 알레르기를 유발하는 성분이 포함되어 있지
                        않습니다. 알레르기 등록은 마이페이지에서 가능해요!
                      </span>
                    </div>
                  </WarningAllergyFalse>
                )}
              </GraphLabel>
              <TotalAmountWrap>
                총 용량
                <TotalAmount>더보기</TotalAmount>
                <Box>
                  <span className='totalAmountIcon'>
                    {medicineItem?.totalAmount}
                  </span>
                </Box>
              </TotalAmountWrap>
            </div>
            <div
              className='legendBox'
              style={{
                display: 'flex',
                position: 'relative',
              }}>
              <MatrialExplainWrap
                BoxY={materialExplainY}
                Active={materialExplainActive}>
                <div className='title'>
                  성분명 <span>{materialExplainName}</span>
                </div>
                <div className='desc'>{materialExplainDesc}</div>
              </MatrialExplainWrap>
            </div>
            <div id='chartdiv'></div>
          </MiddleCardBox>
          <RightCardBox>
            <GraphLabel>
              주요 유효성분
              <div className='mainMaterialIcon'>
                <span className='mainMaterialAmountIcon'>
                  해당 의약품에서 가장 중요한 성분 3가지를 뽑아 사용자에게
                  제공합니다. 제공되는 성분 3가지는 용량에 상관없이{' '}
                  <span className='mainMaterialDesc'>
                    오직 중요순서로 기재됩니다.
                  </span>
                </span>
              </div>
            </GraphLabel>
            <GraphTop3>
              {medicineItem?.materialName?.map((list) =>
                medicineItem?.materialName?.indexOf(list) < 3 ? (
                  medicineItem?.materialName?.indexOf(list) === 0 ? (
                    <div className='graphTop3List' key={list.material}>
                      <div
                        className={
                          list.allergy ? 'top3AllergyTrue' : 'top3AllergyFalse'
                        }>
                        1
                      </div>
                      <div
                        className={
                          list.allergy
                            ? 'ContentMaterialNameAllergyTrue'
                            : 'ContentMaterialNameAllergyFalse'
                        }>
                        {list.material}
                        <span>
                          {' '}
                          (
                          {Math.round(
                            (Number(list.분량) /
                              medicineTotalAmount(medicineItem)) *
                              100
                          )}
                          %)
                        </span>
                      </div>
                    </div>
                  ) : medicineItem?.materialName?.indexOf(list) === 1 ? (
                    <div className='graphTop3List' key={list.material}>
                      <div>
                        <div
                          className={
                            list.allergy
                              ? 'top3AllergyTrue'
                              : 'top3AllergyFalse'
                          }>
                          2
                        </div>
                      </div>
                      <div
                        className={
                          list.allergy
                            ? 'ContentMaterialNameAllergyTrue'
                            : 'ContentMaterialNameAllergyFalse'
                        }>
                        {list.material}
                        <span>
                          {' '}
                          (
                          {Math.round(
                            (Number(list.분량) /
                              medicineTotalAmount(medicineItem)) *
                              100
                          )}
                          %)
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className='graphTop3List' key={list.material}>
                      <div>
                        <div
                          className={
                            list.allergy
                              ? 'top3AllergyTrue'
                              : 'top3AllergyFalse'
                          }>
                          3
                        </div>
                      </div>
                      <div
                        className={
                          list.allergy
                            ? 'ContentMaterialNameAllergyTrue'
                            : 'ContentMaterialNameAllergyFalse'
                        }>
                        {list.material}
                        <span>
                          {' '}
                          (
                          {Math.round(
                            (Number(list.분량) /
                              medicineTotalAmount(medicineItem)) *
                              100
                          )}
                          %)
                        </span>
                      </div>
                    </div>
                  )
                ) : null
              )}
            </GraphTop3>
          </RightCardBox>
        </div>
      </TopSection>
      <div style={{ marginBottom: '80px' }}>
        <TabBar location={location} query={query} totalCount={totalCount} />
        {query !== '리뷰' ? (
          <BottomSection>
            <BottomContents medicineInfo={medicineItem} query={query} />
          </BottomSection>
        ) : (
          <Reviews />
        )}
      </div>
    </>
  );
};

const TopSection = styled.div`
  width: 100%;
  margin-bottom: 58px;
`;

const BottomSection = styled.div`
  width: 100%;
  height: 325px;
  border-radius: 25px;
  background-color: #f6f7fa;
  display: flex;
  padding: 34px 30px;
  color: #242424;
  font-weight: 400;
  font-size: 24px;
  line-height: 40px;
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
  min-height: 130px;
  margin: auto;
  border-radius: 25px;
  box-shadow: 2px 2px 10px 2px rgba(10, 32, 98, 0.1);
`;

const MiddleCardBox = styled.div`
  width: 950px;
  height: 485px;
  border-radius: 25px;
  box-shadow: 2px 2px 10px 2px rgba(10, 32, 98, 0.1);
  position: relative;
  padding: 40px 32px;
  #chartdiv {
    display: flex;
    margin: auto;
    padding-top: 10px;
    width: 100%;
    height: 420px;
    font-size: 12px;
    position: absolute;
    top: 90px;
    background: none;
    /* z-index: 1; */
  }
  .legendBox {
    /* background-color: aliceblue; */
    position: absolute;
    /* top: 381px; */
    top: 5px;
    left: 15px;
    width: 365px;
    height: 300px;
    /* overflow-y: scroll;
    position: relative; */
  }
`;

const TotalAmountWrap = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  top: 271px;
  right: 219px;
  /* z-index: 999; */
  color: #868686;
`;

const TotalAmount = styled.div`
  width: 44px;
  height: 20px;
  font-size: 13px;
  line-height: 20px;
  background-color: #d0d0d0;
  border-radius: 4px;
  color: white;
  /* background-image: url('/assets/image/돋보기아이콘.png');
  background-size: cover;
  background-position: center; */
  margin-left: 5px;
  text-align: center;
  /* display: inline-block; */
`;

const Box = styled.div`
  width: 44px;
  height: 20px;
  /* background-color: aqua; */
  position: absolute;
  top: 2px;
  right: 0;
  z-index: 999;
  :hover .totalAmountIcon {
    display: block;
  }
  .totalAmountIcon {
    border-radius: 8px;
    background-color: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(11.5px);
    display: none;
    position: absolute;
    top: 32px;
    right: -15px;
    text-align: center;
    min-width: 120px;
    max-width: 177px;
    padding: 10px;
    font-size: 13px;
    line-height: 22px;
    font-weight: 350;
    color: #f0f0f0;
    opacity: 1;
    word-break: break-all;
    text-align: left;
  }
  .totalAmountIcon::after {
    content: '';
    width: 0px;
    height: 0px;
    border-bottom: 10px solid rgba(0, 0, 0, 0.8);
    border-top: 10px solid transparent;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    position: absolute;
    right: 33px;
    top: -20px;
  }
`;

const RightCardBox = styled.div`
  width: 380px;
  height: 485px;
  padding: 40px 24px;
  border-radius: 25px;
  box-shadow: 2px 2px 10px 2px rgba(10, 32, 98, 0.1);
  .graphTop3 {
    width: 330px;
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
  .graphTop3List {
    width: 100%;
    height: 18%;
    display: flex;
    align-items: center;
    margin-top: 57px;
  }
  .ContentMaterialPercent {
    /* width: 80px; */
    font-size: 28px;
    line-height: 41px;
    font-weight: bold;
    display: flex;
    /* justify-content: center; */
  }
  .ContentMaterialNameAllergyTrue {
    width: 242px;
    font-size: 20px;
    font-weight: 500;
    display: -webkit-box;
    white-space: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    color: #ff3c26;
    /* text-align: center; */
    /* margin-left: 9px; */
    span {
      font-weight: 400;
    }
  }
  .ContentMaterialNameAllergyFalse {
    width: 242px;
    font-size: 20px;
    font-weight: 500;
    display: -webkit-box;
    white-space: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    /* text-align: center; */
    /* margin-left: 9px; */
    span {
      font-weight: 400;
    }
  }
`;

const WrapContents = styled.div`
  padding: 23px 30px;
  margin: auto;
  align-items: center;
  margin-top: 40px;
  display: flex;
  position: relative;
  .labelWrap {
    justify-content: center;
    text-align: left;
  }
  .boxWrap {
    display: flex;
    position: absolute;
    right: 30px;
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
    font-size: 18px;
    font-weight: 700;
    line-height: 20px;
    cursor: pointer;
  }
  .compareBox.active {
    background-color: #3366ff;
    cursor: pointer;
    border: 0;
    :active {
      background-color: #1a50f3;
    }
  }
`;

const GraphTop3 = styled.div`
  width: 100%;
  height: 300px;
  margin-top: 70px;
  .top3AllergyFalse {
    width: 70px;
    height: 70px;
    color: rgb(51, 102, 255);
    border: 7px solid transparent;
    background: radial-gradient(rgb(235, 240, 255), rgb(235, 240, 255))
        padding-box padding-box,
      radial-gradient(rgb(80, 124, 255) 0%, rgb(201, 214, 255) 100%) border-box
        border-box;
    font-size: 34px;
    line-height: 70px;
    font-weight: 900;
    border-radius: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin-right: 20px;
  }
  .top3AllergyTrue {
    width: 70px;
    height: 70px;
    border: 7px solid transparent;
    background: radial-gradient(rgb(255, 236, 234), rgb(255, 236, 234))
        padding-box padding-box,
      radial-gradient(rgb(255, 80, 80) 0%, rgb(255, 201, 201) 100%) border-box
        border-box;
    color: rgb(255, 60, 38);
    font-size: 34px;
    line-height: 70px;
    font-weight: 900;
    border-radius: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin-right: 20px;
  }
  /* .top2AllergyFalse {
    width: 70px;
    height: 70px;
    color: rgb(51, 102, 255);
    border: 7px solid transparent;
    background: radial-gradient(rgb(235, 240, 255), rgb(235, 240, 255))
        padding-box padding-box,
      radial-gradient(rgb(80, 124, 255) 0%, rgb(201, 214, 255) 100%) border-box
        border-box;
    font-size: 34px;
    line-height: 49px;
    font-weight: 900;
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
  } */
`;

const Image = styled.div`
  width: 160px;
  height: 85px;
  border-radius: 8px;
  background-image: ${({ imgUrl }) =>
    imgUrl ? `url(${imgUrl})` : `url('/assets/image/default_img.png')`};
  background-size: cover;
  background-position: 50% -50%;
  margin-right: 30px;
`;

const Name = styled.div`
  min-width: 360px;
  max-width: 380px;
  margin: auto;
  font-size: 24px;
  font-weight: 700;
  line-height: 35px;
  justify-content: center;
  color: #242424;
`;

const TopLabel = styled.div`
  /* height: 24px; */
  font-size: 18px;
  font-weight: 500;
  line-height: 26px;
  color: #868686;
  margin-bottom: 23.5px;
  text-align: left;
`;

const BottomLabel = styled.div`
  /* height: 24px; */
  font-size: 18px;
  font-weight: 500;
  line-height: 26px;
  color: #868686;
  display: flex;
  align-items: center;
  /* justify-content: center; */
  /* margin-top: 10px; */
  text-align: left;
  .etcOtcCodeDesc {
    width: 20px;
    height: 20px;
    position: relative;
    background-image: url('/assets/image/의약품목설명아이콘.png');
    background-size: cover;
    background-position: center;
    margin-left: 5px;
    margin-top: 2px;
    display: inline-block;
    :hover .tooltipText {
      display: block;
    }
    .tooltipText {
      border-radius: 8px;
      background-color: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(11.5px);
      /* box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.2); */
      display: none;
      position: absolute;
      top: 30px;
      left: -30px;
      width: 310px;
      padding: 13px;
      font-size: 15px;
      line-height: 22px;
      /* color: #868686; */
      color: #ffffff;
      /* background-color: #ffffff; */
      opacity: 1;
      z-index: 2;
      font-weight: 350;
    }
    .tooltipText::after {
      content: '';
      width: 0px;
      height: 0px;
      border-bottom: 10px solid rgba(0, 0, 0, 0.8);
      border-top: 10px solid transparent;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      position: absolute;
      left: 36.5px;
      top: -20px;
    }
  }
`;

const Categorize = styled.div`
  div {
    padding: 0 5px;
    min-width: 69px;
    height: 35px;
    background: #ebf0ff;
    color: #3366ff;
    font-size: 16px;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    line-height: 20px;
    border-radius: 8px;
    display: flex;
  }
  display: flex;
  margin-top: 14px;
  gap: 8px;
`;

const Picked = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24px;
  div {
    width: 48px;
    height: 48px;
    .btnLikeImg {
      width: 28.5px;
      height: 25.33px;
    }
  }
`;

const GraphLabel = styled.div`
  /* width: 1000px; */
  /* background-color: aliceblue; */
  /* color: #868686; */
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  font-weight: 700;
  line-height: 43px;
  .mainMaterialIcon {
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
      /* box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.2); */
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(11.5px);
      display: none;
      position: absolute;
      top: 40px;
      right: -50px;
      text-align: center;
      width: 256px;
      height: 117px;
      padding: 12px;
      font-size: 15px;
      line-height: 24px;
      font-weight: 350;
      font-family: 'Noto Sans KR';
      color: #f0f0f0;
      /* background-color: #ffffff; */
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
      right: 60px;
      top: -20px;
    }
    .mainMaterialDesc {
      color: #82a1ff;
      font-weight: 700;
      font-size: 15px;
      line-height: 24px;
    }
  }
`;

const WarningAllergyTrue = styled.div`
  width: 150px;
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
    margin-left: 5px;
    margin-top: 2px;
    width: 20px;
    height: 20px;
    background-image: url('/assets/image/알러지성분안내아이콘_red.png');
    background-size: cover;
    background-position: center;
    display: inline-block;
  }
  span {
    font-weight: 700;
    font-size: 18px;
    line-height: 20px;
  }
  :hover .allergyTrueAmountIcon {
    display: block;
  }
  .allergyTrueAmountIcon {
    border-radius: 8px;
    /* box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.2); */
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(11.5px);
    display: none;
    position: absolute;
    top: 83px;
    right: 2px;
    text-align: center;
    width: 256px;
    height: 95px;
    padding: 12px 10px;
    font-size: 15px;
    line-height: 24px;
    font-weight: 350;
    color: #ffcfca;
    opacity: 1;
    z-index: 2;
    word-break: break-all;
    text-align: left;
  }
  .allergyTrueAmountIcon::after {
    content: '';
    width: 0px;
    height: 0px;
    border-bottom: 10px solid rgba(0, 0, 0, 0.8);
    border-top: 10px solid transparent;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    position: absolute;
    right: 49px;
    top: -20px;
  }
`;

const WarningAllergyFalse = styled.div`
  width: 150px;
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
    margin-left: 5px;
    margin-top: 2px;
    width: 20px;
    height: 20px;
    background-image: url('/assets/image/알러지성분안내아이콘_green.png');
    background-size: cover;
    background-position: center;
    display: inline-block;
  }
  span {
    font-weight: 700;
    font-size: 18px;
    line-height: 20px;
  }
  :hover .allergyFalseAmountIcon {
    display: block;
  }
  .allergyFalseAmountIcon {
    border-radius: 8px;
    /* box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.2); */
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(11.5px);
    display: none;
    position: absolute;
    top: 83px;
    right: 2px;
    text-align: center;
    width: 256px;
    height: 95px;
    padding: 12px 10px;
    font-size: 15px;
    line-height: 24px;
    font-weight: 350;
    color: #ffffff;
    opacity: 1;
    z-index: 2;
    word-break: break-all;
    text-align: left;
  }
  .allergyFalseAmountIcon::after {
    content: '';
    width: 0px;
    height: 0px;
    border-bottom: 10px solid rgba(0, 0, 0, 0.8);
    border-top: 10px solid transparent;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    position: absolute;
    right: 49px;
    top: -20px;
  }
`;

const ScrollBar = styled.div`
  width: 100%;
  white-space: pre-wrap;
  font-size: 20px;
  line-height: 33px;
  overflow-x: hidden;
  overflow-y: auto;
  height: 258px;
  .scroll-area {
    padding: 2px 12px 0 18px;
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
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
  }
`;

const MatrialExplainWrap = styled.div`
  display: ${({ Active }) => (Active ? 'block' : 'none')};
  width: 364px;
  min-height: 50px;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(11.5px);
  padding: 15px 30px 20px 30px;
  border-radius: 15px;
  line-height: 34px;
  position: absolute;
  top: -55px;
  left: -3px;
  z-index: 1;
  color: white;
  text-align: center;
  backdrop-filter: blur(5px);
  .title {
    margin-top: 15px;
    margin-bottom: 25px;
    text-align: left;
    font-weight: 500;
    font-size: 18px;
    line-height: 35px;
    color: #f0f0f0;
    span {
      margin-left: 6px;
      font-size: 24px;
      font-weight: 700;
      color: #82a1ff;
    }
  }
  .desc {
    font-size: 16px;
    line-height: 34px;
    font-weight: 400;
    text-align: left;
  }
`;

export default Detail;
