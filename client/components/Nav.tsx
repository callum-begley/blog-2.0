import { Link } from "react-router"
import Hamburger from "hamburger-react"
import { useState } from "react"

function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <div className= 'text-white fixed top-10 p-4'>
      <div className="text-xl bg-zinc-600 rounded-full hover:bg-zinc-400 h-12 w-12 transition duration-500 ease-in-out hover:scale-110 z-50">
      <Hamburger size={24} toggled={open} toggle={setOpen} />
      </div>
      {open && 
      <nav id="banner-link-spacer" className= 'text-white text-center relative top-14 place-items-center h-fit w-72 bg-zinc-800 flex flex-col flex-nowrap text-3xl text-nowrap -translate-x-4 rounded-lg z-50'>
        <Link to='/' className= 'p-10 hover:text-lime-400 hover:bg-zinc-600 rounded-lg z-50 w-full' onClick={() => setOpen(false)}>Home</Link>
        <Link to='/Blog' className= 'p-10 hover:text-lime-400 hover:bg-zinc-700 rounded-lg z-50 w-full' onClick={() => setOpen(false)}>Blog</Link>
        <Link to='/Games' className= 'p-10 hover:text-lime-400 hover:bg-zinc-700 rounded-lg z-50 w-full' onClick={() => setOpen(false)}>Games</Link>
        <Link to='/About-Me' className= 'p-10 hover:text-lime-400 hover:bg-zinc-700 rounded-lg z-50 w-full' onClick={() => setOpen(false)}>About Me</Link>
      </nav>}
    </div>
  )
}

export default Nav