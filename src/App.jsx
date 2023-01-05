import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Detail from './pages/Detail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Detail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
