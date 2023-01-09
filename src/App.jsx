import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Header from './components/layout/Header';
import Signup from './pages/Signup';
import KakaoRedirect from './components/socialLogin/KakaoRedirect';
import NaverRedirect from './components/socialLogin/NaverRedirect';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          exact
          path='/login'
          element={
            <>
              <Header />
              <Login />
            </>
          }
        />
        <Route
          exact
          path='/signup'
          element={
            <>
              <Header />
              <Signup />
            </>
          }
        />
        <Route exact path='/kakaologin' element={<KakaoRedirect />} />
        <Route exact path='/naverlogin' element={<NaverRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
