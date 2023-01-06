import { BrowserRouter, Route, Routes } from 'react-router-dom';

//page
import ComparePage from './pages/Compare';
import Login from './pages/Login';
import Detail from './pages/Detail';

// 컴포넌트
import Layout from './components/layout/Layout';
import Header from './components/layout/Header';
import Signup from './pages/Signup';

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
    </BrowserRouter>
  );
}

export default App;
