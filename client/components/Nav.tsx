import { Link } from "react-router"
import Hamburger from "hamburger-react"
import { useState } from "react"

function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <div className= 'text-white fixed sm:top-10 p-4 w-12 h-12'>
      <div className="text-xl bg-zinc-600 rounded-full hover:bg-zinc-400 h-12 w-12 z-50 transition duration-500 ease-in-out hover:scale-110 opacity-40 hover:opacity-100 ring-2 ring-white ">
      <Hamburger size={24} toggled={open} toggle={setOpen} />
      </div>
      
      <nav onMouseLeave={() => setOpen(false)} className={`
            text-white text-center relative top-14 place-items-center h-fit w-80 bg-zinc-800 flex flex-col flex-nowrap text-3xl text-nowrap -translate-x-6 rounded-lg z-50
            transition-all duration-500 ease-in-out transform origin-left overflow-hidden
            ${open ? 'scale-x-100 text-opacity-100' : 'scale-x-0 text-opacity-0 pointer-events-none'}
          `}>
        <Link to='/' className= 'p-10 hover:text-lime-400 hover:bg-zinc-600 rounded-lg z-50 w-full transition-colors duration-300 ease-in grid grid-cols-[50px_1fr]' 
        onClick={() => setOpen(false)}><div className="material-symbols-outlined mr-10 h-12 w-8 text-3xl font-light">home</div><div>Home</div></Link>
        <Link to='/Blog' className= 'p-10 hover:text-lime-400 hover:bg-zinc-700 rounded-lg z-50 w-full transition-colors duration-300 ease-in grid grid-cols-[50px_1fr]' 
        onClick={() => setOpen(false)}><div className="material-symbols-outlined mr-10 h-12 w-8 text-3xl font-light">news</div><div>Blog</div></Link>
        <Link to='/Games' className= 'p-10 hover:text-lime-400 hover:bg-zinc-700 rounded-lg z-50 w-full transition-colors duration-300 ease-in grid grid-cols-[50px_1fr]' 
        onClick={() => setOpen(false)}><div className="material-symbols-outlined mr-10 h-12 w-8 text-3xl font-light">stadia_controller</div><div>Games</div></Link>
        <Link to='/About-Me' className= 'p-10 hover:text-lime-400 hover:bg-zinc-700 rounded-lg z-50 w-full transition-colors duration-300 ease-in grid grid-cols-[50px_1fr]' 
        onClick={() => setOpen(false)}><div className="material-symbols-outlined mr-10 h-12 w-8 text-3xl font-light">emoji_people</div><div>About Me</div></Link>
        <a href='#contact' className= 'p-10 hover:text-lime-400 hover:bg-zinc-700 rounded-lg z-50 w-full transition-colors duration-300 ease-in grid grid-cols-[50px_1fr]' 
        onClick={() => setOpen(false)}><div className="material-symbols-outlined mr-10 h-12 w-8 text-3xl font-light">mail</div><div>Contact</div></a>
      </nav>
    </div>
  )
}

export default Nav