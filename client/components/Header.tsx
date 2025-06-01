import Nav from "./Nav"

interface HeaderProps {
  onClick: () => void;
  currentMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ onClick, currentMode }) => {
  console.log(currentMode)
  return (
    <header id="banner" className= 'text-white w-screen h-40 place-content-center drop-shadow-xl/50'>
        <h1 className= 'text-white text-center text-6xl text-nowrap'>Callum Begley's Dev Blog</h1>
        <Nav/>
        <button onClick={onClick} className=" absolute right-0 p-1 text-3xl bg-zinc-600 hover:bg-zinc-400 rounded-full mr-4 h-12 w-12"><p>{currentMode ? '☀️' : '🌙'}</p></button>
    </header>
  )
}

export default Header
    
    