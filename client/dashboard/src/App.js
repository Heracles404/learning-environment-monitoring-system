import './App.css'
import MainDash from './components/MainDash/MainDash.jsx';
import RightSide from './components/RightSide/RightSide.jsx';
import Sidebar from './components/Sidebar/Sidebar.jsx'

function App() {
  return (
    <div className="App">
      <div class="AppGlass">
        <Sidebar/>
        <MainDash/>
        <RightSide/>
      </div> 
    </div>
  );
}

export default App;
