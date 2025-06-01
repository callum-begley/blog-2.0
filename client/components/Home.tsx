const Home = () => {
   return (
    <div className="w-screen max-w-screen-xl dark:bg-zinc-900 bg-zinc-300 h-full justify-self-center font-sans p-10 drop-shadow-xl/50">
      <h2 className="pb-7 text-2xl font-bold">Welcome</h2>
      <p>Welcome to my new homepage. Now powered by ⚛️React and styled with ༄Tailwind</p>
      <br/>
      <p>
        Check out my latest blog:
        <a className= 'p-4 hover:text-green-500 underline' href="/blog/foundations-reflection.html"
          >Blog 9: Foundations Reflection</a>
      </p>
      <br/>
        <div className="p-4 mb-4">
          <h2 className="text-xl font-bold">Games: <em>Click on the images to try them out</em></h2>
          
        </div>
        <div className="dark:bg-zinc-800 rounded-md p-4">
          <h2 className="text-xl font-bold">Personal Projects:</h2>
          <h2 className="text-xl font-bold">Pundle</h2>
          <p>
            Guess the pun by typing in 5 letter words<br />Green means
            correct, yellow means wrong position.
          </p>
          <a href="./pundle/pun.html">
            <img src="./images/pun-game.jpg" alt="gameImg"/>
          </a>
        </div>
        <div>
          <h2 className="text-xl font-bold">Survival Game</h2>
          <p>
            Try to survive<br />Use the items to keep stickman going as long
            as possible
          </p>
          <a href="https://survivalgame-j619.onrender.com/">
            <img src="./images/survival.png" alt="gameImg"/>
          </a>
        </div>
    </div>
  )
}

export default Home
