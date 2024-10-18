import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RightSide from './global/RightSide/RightSide.jsx';
import Sidebar from './global/Sidebar/Sidebar.jsx';

import MainDash from './pages/MainDash/MainDash.jsx';
import Accounts from './pages/Accounts/Accounts.jsx';
import Records from './pages/Records/Records.jsx';
import Monitor from './pages/Monitor/Monitor.jsx';


function App() {
  return (
      <div className="App">
        <div className="AppGlass">
          <Sidebar />
          <Routes>
            <Route path="/" element={<MainDash />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/records" element={<Records />} />
            <Route path="/monitor" element={<Monitor />} />
          </Routes>
          <RightSide />
        </div>
      </div>
  );
}

export default App;
