import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Numblock from './component/table';
import Registration from './pages/Registration/registration';

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Registration />}></Route>
          <Route path="/Num-Block" element={<Numblock />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
