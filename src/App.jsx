import { BrowserRouter, Route, Routes } from 'react-router-dom';

//page
import ComparePage from './pages/Compare';

// 컴포넌트
import Layout from './components/layout/Layout';

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
