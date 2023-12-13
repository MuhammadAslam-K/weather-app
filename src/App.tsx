import './App.css';
import Navbar from './components/Navbar';
import WeatherApp from './pages/WeatherPage'

function App() {


  return (
    <>
      <div className="grid min-h-screen App grid-rows-[auto,1fr,auto]">
        <WeatherApp />

      </div>
    </>
  )
}

export default App
