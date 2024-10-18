import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainDash from './pages/MainDash/MainDash.jsx';
import RightSide from './global/RightSide/RightSide.jsx';
import Sidebar from './global/Sidebar/Sidebar.jsx';
import Reports from './pages/Reports/Reports.jsx';

function App() {
  return (
      <div className="App">
        <div className="AppGlass">
          <Sidebar />
          <Routes>
            <Route path="/" element={<MainDash />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
          <RightSide />
        </div>
      </div>
  );
}

export default App;
