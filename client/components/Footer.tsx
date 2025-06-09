import { Link } from "react-router"

function Footer() {
  return (
    <>
    <footer className= 'text-white relative bottom-0 w-full h-40 place-content-center bg-zinc-700 dark:bg-zinc-900 '>
      <h4 className='md:text-xl mb-4 pl-2'>&copy; Copyright Callum Begley 2025</h4>
      <div className='flex md:text-xl flex-wrap text-nowrap'>
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
    
    