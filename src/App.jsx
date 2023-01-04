import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
