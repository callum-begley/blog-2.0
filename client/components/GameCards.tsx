function GameCards(){

  
   return (
    <>
    <div className="flex flex-wrap justify-around w-full">
      <a href="https://fitquest-wupo.onrender.com/" target="_blank" rel="noreferrer noopener">
      <div className="bg-zinc-700 bg-opacity-40 backdrop-blur-sm grid min-h-[40rem] max-w-[22rem] rounded-2xl place-content-center text-center p-4 ring-2 dark:ring-white ring-zinc-800 my-10 hover:bg-opacity-60 dark:hover:shadow-[0px_3px_30px_rgba(137,243,54,0.7)]">
        <h2 className="text-4xl pb-2">Fit Quest</h2>
        <p className="text-xl py-4 max-w-80">Final group project from Dev Academy, combines an RPG game with real world physical and mental challenges.</p>
        <img src="/images/fitquestmobile.png" alt="Pundle Game" className="w-auto max-w-64 h-96 object-cover justify-self-center rounded-lg"/>
      </div>
      </a>
      <a href="https://callum-begley.github.io/pundle/pun.html" target="_blank" rel="noreferrer noopener">
      <div className="bg-zinc-700 bg-opacity-40 backdrop-blur-sm grid min-h-[40rem] max-w-[22rem] rounded-2xl place-content-center text-center p-4 ring-2 dark:ring-white ring-zinc-800 my-10 hover:bg-opacity-60 dark:hover:shadow-[0px_3px_30px_rgba(137,243,54,0.7)]">
        <h2 className="text-4xl pb-2">Pundle</h2>
        <p className="text-xl py-4 max-w-80">Like wordle, but funnier. Personal project I made before Dev Academy boot camp.</p>
        <img src="/images/pun-game.jpg" alt="Pundle Game" className="w-auto h-96 max-w-64 object-cover justify-self-center rounded-lg"/>
      </div>
      </a>
      <a href="https://c-dfpy.onrender.com/" target="_blank" rel="noreferrer noopener">
      <div className="bg-zinc-700 bg-opacity-40 backdrop-blur-sm grid min-h-[40rem] max-w-[22rem] rounded-2xl place-content-center text-center p-4 ring-2 dark:ring-white ring-zinc-800 my-10 hover:bg-opacity-60 dark:hover:shadow-[0px_3px_30px_rgba(137,243,54,0.7)]">
        <h2 className="text-4xl pb-2 break-words">Conway&#39;s Game Of Life</h2>
        <p className="text-xl py-4 max-w-80">A simple game that emulates life&#39;s complexities. <br/><a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life" className="underline">Wikipedia</a></p>
        <img src="/images/conway.png" alt="Pundle Game" className="w-auto h-96 max-w-64 object-cover justify-self-center rounded-lg"/>
      </div>
      </a>
    </div>
    <div className="flex flex-wrap justify-around w-full">
      <a href="https://callum-begley.itch.io/insanity" target="_blank" rel="noreferrer noopener">
      <div className="bg-zinc-700 bg-opacity-40 backdrop-blur-sm grid min-h-[40rem] max-w-[22rem] rounded-2xl place-content-center text-center p-4 ring-2 dark:ring-white ring-zinc-800 my-10 hover:bg-opacity-60 dark:hover:shadow-[0px_3px_30px_rgba(137,243,54,0.7)]">
        <h2 className="text-4xl pb-2">Insanity</h2>
        <p className="text-xl py-4 max-w-80">Made for GMTK Game Jam 2025, the theme was loops. This is a 2d platformer puzzle game that loops around the screen.</p>
        <img src="https://img.itch.zone/aW1hZ2UvMzc3NzQwNi8yMjQ4MDIxOS5wbmc=/original/%2FHvZj8.png" alt="Insanity Game" className="w-auto max-w-64 h-96 object-cover justify-self-center rounded-lg"/>
      </div>
      </a>
      <a href="https://callum-begley.itch.io/flappy-kiwi" target="_blank" rel="noreferrer noopener">
      <div className="bg-zinc-700 bg-opacity-40 backdrop-blur-sm grid min-h-[40rem] max-w-[22rem] rounded-2xl place-content-center text-center p-4 ring-2 dark:ring-white ring-zinc-800 my-10 hover:bg-opacity-60 dark:hover:shadow-[0px_3px_30px_rgba(137,243,54,0.7)]">
        <h2 className="text-4xl pb-2">Flappy Kiwi</h2>
        <p className="text-xl py-4 max-w-80">A fun and addictive endless runner game with a kiwi twist. First game made in Unity.</p>
        <img src="/images/flappykiwi.png" alt="Flappy Kiwi Game" className="w-auto h-96 max-w-64 object-cover justify-self-center rounded-lg"/>
      </div>
      </a>
    </div>
    </>
  )
}

export default GameCards