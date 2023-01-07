import { BrowserRouter, Route, Routes } from 'react-router-dom';

//page
import ComparePage from './pages/Compare';
import Login from './pages/Login';
import Search from './pages/Search';
import Detail from './pages/Detail';

// 컴포넌트
import Layout from './components/layout/Layout';
import Header from './components/layout/Header';
import Signup from './pages/Signup';
import CompareBox from './components/common/CompareBox';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          exact
          path='/search'
          element={
            <Layout>
              <Search />
            </Layout>
          }
        />
        <Route
          exact
          path='/compare'
          element={
            <Layout>
              <ComparePage />
            </Layout>
          }
        />
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
        <Route
          exact
          path='/compare'
          element={
            <Layout>
              <ComparePage />
            </Layout>
          }
        />
        <Route
          path='/detail/:id'
          element={
            <Layout>
              <Detail />
            </Layout>
          }
        />
      </Routes>
      <CompareBox />
    </BrowserRouter>
  );
}

export default App;
