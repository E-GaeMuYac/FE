import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

//page
import ComparePage from './pages/Compare';
import Login from './pages/Login';
import Search from './pages/Search';
import Detail from './pages/Detail';
import User from './pages/User';
import Signup from './pages/Signup';

// 컴포넌트
import Layout from './components/layout/Layout';
import Header from './components/layout/Header';
import CompareBox from './components/common/CompareBox';
// import Spinner from './components/common/Spinner';
import KakaoRedirect from './components/socialLogin/KakaoRedirect';
import NaverRedirect from './components/socialLogin/NaverRedirect';
import GoogleRedirect from './components/socialLogin/GoogleRedirect';

function App() {
  const [isToken, setIsToken] = useState('');
  const [userImage, setUserImage] = useState('');

  return (
    <BrowserRouter>
      <Header
        istoken={isToken}
        setistoken={setIsToken}
        userimage={userImage}
        setuserimage={setUserImage}
      />
      <Routes>
        <Route
          exact
          path='/search'
          element={
            <Layout>
              <Search />
              <CompareBox />
            </Layout>
          }
        />
        <Route
          exact
          path='/compare'
          element={
            <Layout>
              <ComparePage />
              <CompareBox />
            </Layout>
          }
        />
        <Route
          exact
          path='/login'
          element={<Login setistoken={setIsToken} />}
        />
        <Route exact path='/signup' element={<Signup />} />
        <Route
          exact
          path='/compare'
          element={
            <Layout>
              <ComparePage />
              <CompareBox />
            </Layout>
          }
        />
        <Route
          path='/detail/:id'
          element={
            <Layout>
              <Detail />
              <CompareBox />
            </Layout>
          }
        />
        <Route
          path='/mypage'
          element={
            <Layout>
              <User setuserimage={setUserImage} istoken={isToken} />
              <CompareBox />
            </Layout>
          }
        />
        {/* <Route path='/spinner' element={<Spinner />} /> */}
        <Route exact path='/kakaologin' element={<KakaoRedirect />} />
        <Route exact path='/naverlogin' element={<NaverRedirect />} />
        <Route exact path='/googlelogin' element={<GoogleRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
