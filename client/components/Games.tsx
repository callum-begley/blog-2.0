import Matter, { Mouse, MouseConstraint, World } from "matter-js"
import { useEffect, useRef, useState } from "react";

function Games(){
  const canvasRef = useRef<HTMLDivElement | undefined>(undefined)
    const [gameOver, setGameOver] = useState(false)
    const [endGame, setEndGame] = useState(false)
    let killControls = false
    let jump = false
  
     useEffect(() => {
      // module aliases
      const Engine = Matter.Engine,
            Render = Matter.Render,
            Runner = Matter.Runner,
            Bodies = Matter.Bodies,
            Composite = Matter.Composite; 
  
      // create an engine
      const engine = Engine.create();

      const renderWidth = 800;
      const renderHeight = 600;
  
      // create a renderer
      const render = Render.create({
          element: canvasRef.current,
          engine: engine,
          options: {
            // width: renderWidth,
            // height: renderHeight,
            wireframes: false, 
            background: '#ffa54f',
            hasBounds: true
          },
      });
  
      // create two boxes and a ground
      const ballA = Bodies.circle(400, 200, 40, {
        restitution: 0.8,
        frictionAir: 0.0,
        friction: 0.1,
        label: 'player', 
        // render: { fillStyle: '#33db1d' },
        render: {
            sprite: {
              texture: '/bball.webp',
              xScale: 0.33,
              yScale: 0.33
            }
          }
      });
      const boxB = Bodies.rectangle(600, 50, 80, 80, {friction: 0.01, render: { fillStyle: '#09419c' }});
  
      const ground = Bodies.rectangle(400, 630, 800, 60, { isStatic: true,});
      const leftWall = Bodies.rectangle(-30, -240, 60, 1800, { isStatic: true });
      const rightWall = Bodies.rectangle(830, -240, 60, 1800, { isStatic: true });
      
      const hoop = Bodies.rectangle(600, -610, 200, 10, { isStatic: true, render: { fillStyle: "#ffffff"},});
      const endGoal = Bodies.rectangle(600, -620, 100, 10, { isStatic: true, label: 'endGoal', render: { fillStyle: "transparent"}});
  
      const platform1 = Bodies.rectangle(200, 210, 200, 10, { isStatic: true });
      const platform2 = Bodies.rectangle(600, 410, 200, 10, { isStatic: true });
      const platform3 = Bodies.rectangle(200, -210, 200, 10, { isStatic: true });
      const platform4 = Bodies.rectangle(600, 10, 200, 10, { isStatic: true });
      const platform5 = Bodies.rectangle(600, -400, 200, 10, { isStatic: true,  collisionFilter:{category: 0} });
      const platforms = [platform1, platform2, platform3, platform4, platform5]
  
      document.addEventListener("keydown", function (event) {
        console.log('killControls', killControls)
        if (killControls === true) return
        const keyCode = event.key
        //const position = ballA.position
        //const speed = 10;
        const currentV = Matter.Body.getVelocity(ballA)
  
        // move the body based on the key pressed
        if (keyCode === 'a') {
          // move left

          Matter.Body.setVelocity(ballA, { x: -4, y: currentV.y })
        } else if (keyCode === 'w') {
          // move up
          if (jump === true){
            Matter.Body.setVelocity(ballA, { x: currentV.x , y: -10 })
            jump = false
          } 
        } else if (keyCode === 'd') {
          // move right
          Matter.Body.setVelocity(ballA, { x: 4, y: currentV.y })
        } else if (keyCode === 's') {
          // move down
          Matter.Body.translate(ballA, { x: currentV.x, y: 10 });
        }
      });
  
      
      // const mouse = Mouse.create(canvasRef?.current);
      // const mouseConstraint = MouseConstraint.create(engine, {
      // mouse,
      // constraint: {
      //   stiffness: 0.2,
      //   render: { visible: false },
      // },
      // });
      // render.mouse = mouse; //composite.add below
      
      // document.body.addEventListener("mousedown", () => {
      //     const { x, y } = mouse.position
      //     // const randX = Math.floor(Math.random()* 800)
  
      //     const newBody = Bodies.circle(x, y, 20, {
      //       restitution: 0.8,
      //       render: {
      //         sprite: {
      //           texture: '/cry.png',
      //           xScale: 1,
      //           yScale: 1
      //         }
      //       },})
  
      //     Composite.add(engine.world, newBody)
      //   })
  
        
      // follow player
      // function track(){
      //   Render.lookAt(render, ballA, {
      //     x: 400,
      //     y: 400
      //   }, true);
      // }

      // function repeatOften() {
      //   track()
      //   requestAnimationFrame(repeatOften);
      // }
      // requestAnimationFrame(repeatOften);  

      // add all of the bodies to the world
      Composite.add(engine.world, [ballA, boxB, ground, ...platforms.map((p) => p), leftWall, rightWall, hoop, endGoal]);


      function track() {
          // Get the current Y position of ballA
          let targetY = ballA.position.y;

          // Define the Y limits for the *camera's center*
          const maxAllowedCenterY = 300

          // Clamp the targetY (which is effectively the camera's desired center Y)
          targetY = Math.min(targetY, maxAllowedCenterY); // Ensure it doesn't go above max


          // Calculate the new minimum and maximum Y bounds for the camera based on the clamped targetY.
          render.bounds.min.y = targetY - (renderHeight / 2);
          render.bounds.max.y = targetY + (renderHeight / 2);

          // Keep the horizontal bounds fixed, centered on the initial world width.
          render.bounds.min.x = 0; 
          render.bounds.max.x = renderWidth; 
        }

      Matter.Events.on(engine, 'afterUpdate', track);

      
      Matter.Events.on(engine, 'collisionEnd', (event) => {
        const pairs = event.pairs
        for (const pair of pairs) {
          const isPlayer = pair.bodyA.label === 'player' || pair.bodyB.label === 'Rectangle Body';
          const isGround = pair.bodyA.label === 'player' || pair.bodyB.label === 'Rectangle Body';

          if (isPlayer && isGround) {
              jump = true // Set jump to true when player collides with ground
          }
        }})

      Matter.Events.on(engine, 'collisionStart', (event) => {
        const pairs = event.pairs;
  
        for (const pair of pairs) {
          if ((pair.bodyA.label === 'player' && pair.bodyB.label === 'endGoal') ||
              (pair.bodyA.label === 'endGoal' && pair.bodyB.label === 'player')) {
            // End game logic here
            setEndGame(true)
            killControls = true
            //Render.stop(render)
          }
        }
      });

        // run the renderer
        Render.run(render);
  
        // create runner
        const runner = Runner.create();
  
        // run the engine
        Runner.run(runner, engine);
        
        return () => {
          setEndGame(false)
          setGameOver(false)
          Render.stop(render);
          Runner.stop(runner);
          if (canvasRef.current) {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            canvasRef.current.removeChild(render.canvas);
          }
          World.clear(engine.world, false);
          Engine.clear(engine);
        };
  
      }, [gameOver]);
    
  
    
     return (
      <div className="place-self-center pt-40 w-full">
        {endGame ? <div className="w-52 h-40 bg-gradient-to-tr from-blue-950 to-blue-700 absolute top-1/2 left-1/2 -translate-x-1/2 place-content-center ring-2 ring-slate-200 rounded-3xl">
          <h1 className="font-bold text-2xl text-center p-4">You Won!</h1>
          <button className="place-self-center block ring-2 ring-slate-200 p-2 rounded-xl " onClick={() => {setGameOver(true)}}>Try again?</button>
          </div>: ''}
        <div ref={canvasRef} className="place-self-center "/>
      
      </div>
    )
  
  //  return (
  //   <div className="w-screen max-w-screen-xl dark:bg-zinc-900 bg-zinc-300 h-full justify-self-center font-sans p-10 drop-shadow-xl/50">
  //          <div className="p-4 mb-4">
  //         <h2 className="text-xl font-bold">Games: <em>Click on the images to try them out</em></h2>
          
  //       </div>
  //       <h2 className="text-xl font-bold">Personal Projects:</h2>
  //       <div className="dark:bg-zinc-800 rounded-md p-4 flex justify-around align-middle">
  //         <div>
          
  //         <h2 className="text-xl font-bold">Pundle</h2>
  //         <p>
  //           Guess the pun by typing in 5 letter words<br />Green means
  //           correct, yellow means wrong position.
  //         </p>
  //         <a href="./pundle/pun.html">
  //           <img src="./images/pun-game.jpg" alt="gameImg" className="max-w-96"/>
  //         </a>
  //       </div>
  //       <div>
  //         <h2 className="text-xl font-bold">Survival Game</h2>
  //         <p>
  //           Try to survive<br />Use the items to keep stickman going as long
  //           as possible
  //         </p>
  //         <a href="https://survivalgame-j619.onrender.com/">
  //           <img src="./images/survival.png" alt="gameImg" className="max-w-96 place-self-center align-middle"/>
  //         </a>
  //       </div>
  //       </div>
  //   </div>
  //)

  
}

export default Games