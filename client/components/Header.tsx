import Nav from "./Nav"

interface HeaderProps {
  onClick: () => void;
  currentMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ onClick, currentMode }) => {
  return (
    <header className= 'text-blue-700 bg-slate-200 dark:text-white w-screen h-40 place-content-center drop-shadow-xl/50 dark:bg-[url(/images/matrix-banner.avif)] dark:bg-black dark:bg-opacity-60 dark:bg-blend-darken'>
        <h1 className= 'text-center md:text-6xl sm:text-4xl text-2xl md:text-nowrap'>Callum Begley&apos;s Dev Blog</h1>
        <div className= 'w-screen h-auto place-content-center'>
        <Nav/>
        <button onClick={onClick} className="absolute right-0 top-20 p-1 text-3xl bg-zinc-600 hover:bg-zinc-400 transition duration-500 ease-in-out hover:scale-110 rounded-full m-4 h-12 w-12">{currentMode ? '☀️' : '🌙'}</button>
        </div>
    </header>
  )
}

export default Header
    
    