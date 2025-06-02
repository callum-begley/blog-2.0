function Games(){

  
   return (
    <div className="w-screen max-w-screen-xl dark:bg-zinc-900 bg-zinc-300 h-full justify-self-center font-sans p-10 drop-shadow-xl/50">
           <div className="p-4 mb-4">
          <h2 className="text-xl font-bold">Games: <em>Click on the images to try them out</em></h2>
          
        </div>
        <h2 className="text-xl font-bold">Personal Projects:</h2>
        <div className="dark:bg-zinc-800 rounded-md p-4 flex justify-around align-middle">
          <div>
          
          <h2 className="text-xl font-bold">Pundle</h2>
          <p>
            Guess the pun by typing in 5 letter words<br />Green means
            correct, yellow means wrong position.
          </p>
          <a href="./pundle/pun.html">
            <img src="./images/pun-game.jpg" alt="gameImg" className="max-w-96"/>
          </a>
        </div>
        <div>
          <h2 className="text-xl font-bold">Survival Game</h2>
          <p>
            Try to survive<br />Use the items to keep stickman going as long
            as possible
          </p>
          <a href="https://survivalgame-j619.onrender.com/">
            <img src="./images/survival.png" alt="gameImg" className="max-w-96 place-self-center align-middle"/>
          </a>
        </div>
        </div>
    </div>

  )
}

export default Games