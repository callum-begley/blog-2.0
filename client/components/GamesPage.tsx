import { Link } from "react-router"

const GamesPage = () => {
   return (
    <div className="w-screen max-w-screen-xl min-h-screen justify-self-center p-10">
      <p className="text-4xl font-medium">Games:</p>
      <div className="grid grid-cols-1">
        <a href="https://callum-begley.itch.io/insanity" target="_blank" rel="noopener noreferrer" className="bg-zinc-700 bg-opacity-40 backdrop-blur-sm rounded-2xl place-content-center p-10 ring-2 dark:ring-white 
        ring-zinc-800 my-10 hover:bg-opacity-60 w-full grid grid-cols-2 gap-10 place-items-center">
          <img src="https://img.itch.zone/aW1hZ2UvMzc3NzQwNi8yMjQ4MDIxOS5wbmc=/original/%2FHvZj8.png" alt="Insanity Game" className="rounded-lg h-56 w-auto row-span-2"/>
          <h2 className=" pb-1 text-4xl text-center">Insanity</h2>
          <p className="text-lg">A chaotic 2d platform puzzle game. Use your clones to help solve the puzzle and escape the levels. Made with unity in 4 days for GMTK 2025 Game Jam with the theme of Loops.</p>
        </a>
        <Link to="/Geo">
        <div className="bg-zinc-700 bg-opacity-40 backdrop-blur-sm rounded-2xl place-content-center p-10 ring-2 dark:ring-white 
        ring-zinc-800 my-10 hover:bg-opacity-60 w-full grid grid-cols-2 gap-10 place-items-center">
          <img src="/images/whereOnEarth.png" alt="Where On Earth?" className="rounded-lg h-56 w-auto row-span-2"/>
          <h2 className=" pb-1 text-4xl text-center">Where On Earth?</h2>
          <p className="text-lg">A geography guessing game using Google Streetview and Gemini AI API to generate custom locations. Made with React and TypeScript.</p>
        </div>
        </Link>
         <a href="https://callum-begley.itch.io/flappy-kiwi" target="_blank" rel="noopener noreferrer" className="bg-zinc-700 bg-opacity-40 backdrop-blur-sm rounded-2xl place-content-center p-10 ring-2 dark:ring-white 
        ring-zinc-800 my-10 hover:bg-opacity-60 w-full grid grid-cols-2 gap-10 place-items-center">
          <img src="https://img.itch.zone/aW1nLzIyMDQ3NDg3LnBuZw==/315x250%23c/nDkEdw.png" alt="Flappy Kiwi Game" className="rounded-lg h-56 w-auto row-span-2"/>
          <h2 className=" pb-1 text-4xl text-center">Flappy Kiwi</h2>
          <p className="text-lg">A fun and addictive endless runner game with a kiwi twist. First game made in Unity.</p>
        </a>
        <a href="https://callum-begley.github.io/pundle/pun.html" target="_blank" rel="noopener noreferrer" className="bg-zinc-700 bg-opacity-40 backdrop-blur-sm rounded-2xl place-content-center p-10 ring-2 dark:ring-white 
        ring-zinc-800 my-10 hover:bg-opacity-60 w-full grid grid-cols-2 gap-10 place-items-center">
          <img src="/images/pundle2.png" alt="Pun Game" className="rounded-lg h-56 w-auto row-span-2 object-cover"/>
          <h2 className=" pb-1 text-4xl text-center">Pundle</h2>
          <p className="text-lg">Like wordle, but funnier. Personal project I made before Dev Academy boot camp. Made with HTML, CSS, and JavaScript.</p>
        </a>
        <Link to="/Dodgeball">
        <div className="bg-zinc-700 bg-opacity-40 backdrop-blur-sm rounded-2xl place-content-center p-10 ring-2 dark:ring-white 
        ring-zinc-800 my-10 hover:bg-opacity-60 w-full grid grid-cols-2 gap-10 place-items-center">
          <img src="/images/dodgeball.png" alt="Dodgeball" className="rounded-lg h-56 w-auto row-span-2"/>
          <h2 className=" pb-1 text-4xl text-center">Dodgeball</h2>
          <p className="text-lg">A fast-paced arcade game where you dodge falling emojis using physics-based movement. Test your reflexes and see how long you can survive! Built with Matter.js physics engine and React.</p>
        </div>
        </Link>
        <Link to="/bball">
        <div className="bg-zinc-700 bg-opacity-40 backdrop-blur-sm rounded-2xl place-content-center p-10 ring-2 dark:ring-white 
        ring-zinc-800 my-10 hover:bg-opacity-60 w-full grid grid-cols-2 gap-10 place-items-center">
          <img src="/bball.webp" alt="Hoop Dreams" className="rounded-lg h-56 w-auto row-span-2"/>
          <h2 className=" pb-1 text-4xl text-center">Hoop Dreams</h2>
          <p className="text-lg">A platformer basketball game. Bounce to the hoop to complete the levels. Built with Matter.js physics engine and React.</p>
        </div>
        </Link>
        <a href="https://survivalgame-j619.onrender.com/" target="_blank" rel="noopener noreferrer" className="bg-zinc-700 bg-opacity-40 backdrop-blur-sm rounded-2xl place-content-center p-10 ring-2 dark:ring-white 
        ring-zinc-800 my-10 hover:bg-opacity-60 w-full grid grid-cols-2 gap-10 place-items-center">
          <img src="/images/survival.png" alt="Pun Game" className="rounded-lg h-56 w-auto row-span-2 object-cover"/>
          <h2 className=" pb-1 text-4xl text-center">Survival Game</h2>
          <p className="text-lg">Survive as long as you can as me. Made with React.</p>
        </a>
      </div>
    </div>
  )
}

export default GamesPage
