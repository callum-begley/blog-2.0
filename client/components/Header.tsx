import Nav from "./Nav"
import FallingText from './bits/FallingText';
interface HeaderProps {
  onClick: () => void;
  currentMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ onClick, currentMode }) => {
  return (
    <header id='header' className= 'relative text-white dark:text-white max-w-full h-40 place-content-center bg-gradient-to-tr from-zinc-900 to-slate-800 z-40 headerGrid'>
        <div className= 'w-screen h-auto place-content-center fixed '>
          <Nav/>
        </div>
        <FallingText
          text={`Callum Begley .com`}
          highlightWords={[".", "C", "B"]}
          highlightClass="highlighted"
          trigger="click"
          backgroundColor="transparent"
          wireframes={false}
          gravity={0.56}
          mouseConstraintStiffness={0.9}
        />
        <button onClick={onClick} className="absolute right-0 sm:top-10 p-1 bg-zinc-600 hover:bg-zinc-400 place-content-center opacity-40 hover:opacity-100 ring-2 ring-white 
        transition duration-500 ease-in-out hover:scale-110 rounded-full m-4 h-12 w-12">{currentMode ? <div className="material-symbols-outlined text-4xl justify-self-center font-light">dark_mode</div> : <div className="material-symbols-outlined text-4xl justify-self-center font-light">light_mode</div>}</button>

        <button className="fixed right-0 sm:bottom-10 bottom-0 p-1 text-5xl bg-zinc-600 hover:bg-zinc-400 transition duration-500 opacity-30 hover:opacity-100 ring-2 ring-white
        ease-in-out hover:scale-110 rounded-full m-4 h-12 w-12"><a href="#header" className="line"><img src='/down-arrow.png' className="invert rotate-180 w-8 translate-x-1"  alt=''/></a></button>
    </header>
  )
}

export default Header
    
    