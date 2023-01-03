import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ComparePage from './pages/Compare';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/compare' element={<ComparePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
