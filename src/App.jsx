import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';

//page
import ComparePage from './pages/Compare';
import Login from './pages/Login';
import Search from './pages/Search';
import Detail from './pages/Detail';
import User from './pages/User';
import Signup from './pages/Signup';
import SocialLogin from './pages/SocialLogin';
import Main from './pages/main/Main';

// 컴포넌트
import Layout from './components/layout/Layout';
import Header from './components/layout/Header';
import CompareBox from './components/common/CompareBox';
import FindAccount from './pages/FindAccount';
import ChatBox from './components/layout/ChatBox';
import { useRecoilState } from 'recoil';
import { nowRoute } from './recoil/recoilStore';
// import Spinner from './components/common/Spinner';

function App() {
  const [isToken, setIsToken] = useState('');
  const [userImage, setUserImage] = useState('');

  const location = useLocation();

  const [nowPage, setNowPage] = useRecoilState(nowRoute);

  useEffect(() => {
    setNowPage(location.pathname);
  }, []);

  return (
    <>
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
            <SocialLogin setistoken={setIsToken} setuserimage={setUserImage} />
          }
        />
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
        <Route exact path='/compare' element={<ComparePage />} />
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
            <Layout>
              <Detail />
              <CompareBox />
            </Layout>
          }
        />
        <Route
          path='/mypage'
          element={
            <>
              <User
                setuserimage={setUserImage}
                setistoken={setIsToken}
                istoken={isToken}
              />
              <CompareBox />
            </>
          }
        />
        {/* <Route path='/spinner' element={<Spinner />} /> */}
      </Routes>
      <ChatBox />
    </>
  );
}

export default App;
