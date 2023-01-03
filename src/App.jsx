import { BrowserRouter, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes></Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
