import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainDash from './components/MainDash/MainDash.jsx';
import RightSide from './components/RightSide/RightSide.jsx';
import Sidebar from './components/Sidebar/Sidebar.jsx';
import Reports from './components/Reports/Reports.jsx';
import Monitor from './components/Monitor/Monitor.jsx';

function App() {
  return (
      <div className="App">
        <div className="AppGlass">
          <Sidebar />
          <Routes>
            <Route path="/" element={<MainDash />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/monitor" element={<Monitor />} />
          </Routes>
          <RightSide />
        </div>
      </div>
  );
}

export default App;
