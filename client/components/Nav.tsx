import { Link } from "react-router"
import Hamburger from "hamburger-react"
import { useState } from "react"

function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <div className= 'text-white absolute border-red top-24 p-4'>
      <div className=" text-xl bg-zinc-600 rounded-full hover:bg-zinc-400 h-12 w-12">
      <Hamburger
      size={24}
      toggled={open}
      toggle={setOpen}
      
      />
      </div>
      {open && 
      <nav id="banner-link-spacer" className= 'text-white relative w-auto p-8 bg-zinc-800 flex flex-col flex-nowrap text-xl text-nowrap'>
        <Link to='/' className= 'p-8 hover:text-green-500'>Home</Link>
        <Link to='/Blog' className= 'p-8 hover:text-green-500'>Blog</Link>
        <Link to='/Games' className= 'p-8 hover:text-green-500'>Games</Link>
        <Link to='/About-Me' className= 'p-8 hover:text-green-500'>About Me</Link>
      </nav>}
    </div>
  )
}

export default Nav