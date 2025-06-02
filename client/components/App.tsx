import { Outlet } from 'react-router'
import '../styles/main.css'
import Footer from './Footer'
import Header from './Header'
import { useState } from 'react'

function App() {
  const [darkMode, setDarkMode] = useState(true)

  function switchMode(){
    setDarkMode((x) => !x)
  }

  return (
    <main className={`${darkMode ? 'dark' : 'light'}`}>
      <Header onClick={switchMode} currentMode={darkMode}/>
      <div  className='dark:bg-zinc-950 dark:text-white bg-zinc-200 text-black min-h-screen' >
        <Outlet />
      </div>
      <Footer />
    </main>
  )
}

export default App