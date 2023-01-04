import { BrowserRouter, Route, Routes } from 'react-router-dom';

//page
import ComparePage from './pages/Compare';
import Login from './pages/Login';

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
