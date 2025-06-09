import { Outlet } from 'react-router'
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

  return (
    <main className={`${darkMode ? 'dark' : 'light'}`}>
       <div className='z-0'>
          <Particles
            particleColors={['#ffffff', '#ffffff']}
            particleCount={600}
            particleSpread={10}
            speed={0.05}
            particleBaseSize={50}
            moveParticlesOnHover={true}
            alphaParticles={false}
            disableRotation={false}
          />
        </div>
      <Header onClick={switchMode} currentMode={darkMode}/>
      <div className='dark:bg-black dark:text-white bg-zinc-200 text-black min-h-screen font-[Kanit] z-20' >
       
        <div className='z-20 relative'>
        <Outlet />
        </div>
      </div>
      <Footer />
    </main>
  )
}

export default App