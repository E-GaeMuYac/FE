import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { BrowserView, MobileView } from 'react-device-detect';

//page
import ComparePage from './pages/Compare';
import Login from './pages/Login';
import Search from './pages/Search';
import Detail from './pages/Detail';
import User from './pages/User';
import Signup from './pages/Signup';
import SocialLogin from './pages/SocialLogin';
import Main from './pages/main/Main';
import Event from './pages/Event';
import LaptopDetail from './pages/Laptop/LaptopDetail';
import LaptopCompare from './pages/Laptop/LaptopCompare';
import AllergySearch from './pages/AllergySearch';
import AddReviews from './pages/AddReviews';
import ModifyReviews from './pages/ModifyReviews';
import FindAccount from './pages/FindAccount';

// 컴포넌트
import Layout from './components/layout/Layout';
import Header from './components/layout/Header';
import CompareBox from './components/common/CompareBox';
import Reviews from './contents/Reviews';
import MiniNav from './components/common/MiniNav';
import ChatBox from './components/layout/ChatBox';
import Mobile from './contents/Mobile';
import Footer from './components/layout/Footer';
import { useRecoilState } from 'recoil';
import { nowRoute, searchWord } from './recoil/recoilStore';
// import Spinner from './components/common/Spinner';
import { Laptop, PC } from './query/useMediaQuery';

function App() {
  const [isToken, setIsToken] = useState('');
  const [userImage, setUserImage] = useState('');
  const location = useLocation();
  const [nowPage, setNowPage] = useRecoilState(nowRoute);

  useEffect(() => {
    setNowPage(location.pathname);
  }, [location]);

  const [searchedWord, setSearchedWord] = useRecoilState(searchWord);
  useEffect(() => {
    if (!nowPage.includes('detail') && !nowPage.includes('search')) {
      setSearchedWord('');
    }
  }, [nowPage]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [nowPage]);

  return (
    <>
      <BrowserView>
        <Header
          istoken={isToken}
          setistoken={setIsToken}
          userimage={userImage}
          setuserimage={setUserImage}
        />
        <Routes>
          <Route
            exact
            path='/login/loading'
            element={
              <SocialLogin
                setistoken={setIsToken}
                setuserimage={setUserImage}
              />
            }
          />
          <Route
            exact
            path='/search'
            element={
              <>
                <Layout>
                  <Search />
                  <CompareBox />
                </Layout>
              </>
            }
          />
          <Route
            exact
            path='/compare'
            element={
              <>
                <PC>
                  <ComparePage />
                </PC>
                <Laptop>
                  <LaptopCompare />
                </Laptop>
              </>
            }
          />
          <Route
            exact
            path='/login'
            element={
              <Login setistoken={setIsToken} setuserimage={setUserImage} />
            }
          />
          <Route exact path='/signup' element={<Signup />} />
          <Route exact path='/findaccount' element={<FindAccount />} />
          <Route exact path='/' element={<Main />} />
          <Route
            path='/detail/:id'
            element={
              <>
                <PC>
                  <MiniNav />
                  <Layout>
                    <Detail />
                    <CompareBox />
                  </Layout>
                </PC>
                <Laptop>
                  <MiniNav />
                  <Layout>
                    <LaptopDetail />
                    <CompareBox />
                  </Layout>
                </Laptop>
              </>
            }
          />
          <Route
            path='/mypage'
            element={
              <Layout>
                <User
                  setuserimage={setUserImage}
                  setistoken={setIsToken}
                  istoken={isToken}
                />
                <CompareBox />
              </Layout>
            }
          />
          {/* <Route path='/spinner' element={<Spinner />} /> */}
          <Route
            path='/allergy'
            element={
              <>
                <MiniNav />
                <Layout>
                  <AllergySearch />
                </Layout>
              </>
            }
          />
          <Route
            path='/detail/:id/reviewform'
            element={
              <>
                <MiniNav />
                <Layout>
                  <AddReviews setistoken={setIsToken} />
                </Layout>
              </>
            }
          />
          <Route
            path='/detail/:medicineId/editform/:reviewId'
            element={
              <>
                {/* <MiniNav /> */}
                <Layout>
                  <ModifyReviews setistoken={setIsToken} />
                </Layout>
              </>
            }
          />
          <Route
            path='/detail/:id?tab=리뷰'
            element={<Reviews setistoken={setIsToken} />}
          />
          <Route path='/event' element={<Event />} />
        </Routes>
        <Footer />
        <ChatBox />
      </BrowserView>
      <MobileView>
        <Mobile />
      </MobileView>
    </>
  );
}
export default App;
