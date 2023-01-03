import { BrowserRouter, Route, Routes } from 'react-router-dom';

//page
import ComparePage from './pages/Compare';

//component
import Layout from './components/layout/Layout';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route exact path='/compare' element={<ComparePage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
