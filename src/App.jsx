import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';

//page
import Compare from './pages/Compare';
import Login from './pages/Login';
import Search from './pages/Search';
import Detail from './pages/Detail';
import User from './pages/User';
import Signup from './pages/Signup';
import SocialLogin from './pages/SocialLogin';
import Main from './pages/main/Main';
import LaptopDetail from './pages/Laptop/LaptopDetail';
import LaptopCompare from './pages/Laptop/LaptopCompare';

// 컴포넌트
import Layout from './components/layout/Layout';
import Header from './components/layout/Header';
import CompareBox from './components/common/CompareBox';
import FindAccount from './pages/FindAccount';
// import Spinner from './components/common/Spinner';

import { Mobile, Laptop, PC } from './query/useMediaQuery';

function App() {
  const [isToken, setIsToken] = useState('');
  const [userImage, setUserImage] = useState('');

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
        <Route
          exact
          path='/compare'
          element={
            <>
              <PC>
                <Compare />
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
                <Layout>
                  <Detail />
                  <CompareBox />
                </Layout>
              </PC>
              <Laptop>
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
    </>
  );
}

export default App;
