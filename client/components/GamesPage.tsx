const GamesPage = () => {
   return (
    <div className="w-screen max-w-screen-xl min-h-screen justify-self-center p-10">
      <p className="text-4xl font-medium">Games:</p>
      <div className="grid grid-cols-1">
        <a href="https://callum-begley.itch.io/insanity" className="bg-zinc-700 bg-opacity-40 backdrop-blur-sm rounded-2xl place-content-center p-10 ring-2 dark:ring-white 
        ring-zinc-800 my-10 hover:bg-opacity-60 w-full grid grid-cols-2 gap-10">
          <img src="https://img.itch.zone/aW1hZ2UvMzc3NzQwNi8yMjQ4MDIxOS5wbmc=/original/%2FHvZj8.png" alt="Insanity Game" className="rounded-lg h-56 w-auto row-span-2"/>
          <h2 className=" pb-1 text-4xl text-center">Insanity</h2>
          <p className="text-lg">A chaotic 2d platform puzzle game. Use your clones to help solve the puzzle and escape the levels. Made with unity in 4 days for GMTK 2025 Game Jam with the theme of Loops.</p>
        </a>
        <div className="bg-zinc-700 bg-opacity-40 backdrop-blur-sm rounded-2xl place-content-center p-4 ring-2 dark:ring-white 
        ring-zinc-800 my-10 hover:bg-opacity-60 w-full">Game 2</div>
        <div className="bg-zinc-700 bg-opacity-40 backdrop-blur-sm rounded-2xl place-content-center p-4 ring-2 dark:ring-white 
        ring-zinc-800 my-10 hover:bg-opacity-60 w-full">Game 3</div>
      </div>
    </div>
  )
}

export default GamesPage
