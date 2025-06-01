import { Link } from "react-router"

function Footer() {
  return (
    <>
    <footer className= 'text-white w-screen h-40 place-content-center bg-zinc-800 pl-4'>
      <h4 className='text-white text-xl text-nowrap mb-4 pl-2'>&copy; Copyright Callum Begley 2025</h4>
      <div className='flex flex-nowrap text-xl text-nowrap'>
      <p className= 'p-2'>Links: </p>
        <Link to='/' className= 'p-2 hover:text-green-500'>Home</Link>
        <Link to='/Blog' className= 'p-2 hover:text-green-500'>Blog</Link>
        <Link to='/Games' className= 'p-2 hover:text-green-500'>Games</Link>
        <Link to='/About-Me' className= 'p-2 hover:text-green-500'>About Me</Link>
      </div>
    </footer>
    </>
  )
}

export default Footer
    
    