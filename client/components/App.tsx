import { Outlet, useLocation } from 'react-router'
import '../styles/main.css'
import Footer from './Footer'
import Header from './Header'
import { useState } from 'react'
import Particles from './bits/Particles';

function App() {
  const [darkMode, setDarkMode] = useState(true)

  function switchMode(){
    setDarkMode((x) => !x)
  }

  const location = useLocation();
  const isGeoPage = location.pathname === '/Geo';

  return (
    <main className={`${darkMode ? ' dark ' : ' light '} overflow-hidden `}>
       <div className='z-0'>
          <Particles
            particleColors={darkMode ? ['#ffffff', '#ffffff', '#ffffff', '#ffffff'] : ['#1d4ed8', '#fcf00d', '#1d4ed8', '#fcf00d']} 
            particleCount={600}
            particleSpread={10}
            speed={0.03}
            particleBaseSize={50}
            moveParticlesOnHover={true}
            alphaParticles={false}
            disableRotation={false}
          />
        </div>
      <Header onClick={switchMode} currentMode={darkMode}/>
      <div className='dark:bg-black dark:text-white bg-sky-300 text-gray-700 min-h-screen font-[Kanit] -z-20' >
        <div className='relative z-10'>
        <Outlet />
        </div>
      </div>
      {/* Only render Footer if not on Geo page */}
      {!isGeoPage && <Footer />}
    </main>
  )
}

export default App