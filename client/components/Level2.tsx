import Matter, { World } from "matter-js"
import { useEffect, useRef, useState } from "react";


function Level2(){
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
      const boxB = Bodies.rectangle(200, 0, 80, 80, {friction: 0.1, slop: 10, render: { fillStyle: '#33db1d' }});
      const boxC = Bodies.rectangle(600, 200, 80, 80, {friction: 0.1, slop: 10, render: { fillStyle: '#33db1d' }});
      const boxD = Bodies.rectangle(200, -450, 80, 80, {friction: 0.1, slop: 10, render: { fillStyle: '#33db1d' }});
      const boxes = [boxB, boxC, boxD]
  
      const ground = Bodies.rectangle(400, 630, 800, 60, { isStatic: true,});
      const leftWall = Bodies.rectangle(-30, -240, 60, 1800, { isStatic: true });
      const rightWall = Bodies.rectangle(830, -240, 60, 1800, { isStatic: true });
      
      const hoop = Bodies.rectangle(600, -1010, 200, 10, { isStatic: true, render: { fillStyle: "#ffffff"},});
      const endGoal = Bodies.rectangle(600, -1020, 100, 10, { isStatic: true, label: 'endGoal', render: { fillStyle: "transparent"}});
  
      const platform1 = Bodies.rectangle(200, 210, 200, 10, { isStatic: true });
      const platform2 = Bodies.rectangle(600, 410, 200, 10, { isStatic: true });
      const platform3 = Bodies.rectangle(200, -210, 200, 10, { isStatic: true });
      const platform4 = Bodies.rectangle(600, 10, 200, 10, { isStatic: true });
      const platform5 = Bodies.rectangle(200, -610, 200, 10, { isStatic: true});
      const platform6 = Bodies.rectangle(600, -610, 200, 10, { isStatic: true, render: { fillStyle: "#ffffff"}, collisionFilter:{category: 0} });
      const platforms = [platform1, platform2, platform3, platform4, platform5, platform6]
  
      document.addEventListener("keydown", function (event) {
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
  
      Composite.add(engine.world, [ballA, ground,...boxes.map((b) => b), ...platforms.map((p) => p), leftWall, rightWall, hoop, endGoal]);

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
      <>
        {endGame ? <div className="w-52 min-h-40 bg-gradient-to-tr from-blue-950 to-blue-700 absolute top-1/2 left-1/2 -translate-x-1/2 place-content-center ring-2 ring-slate-200 rounded-3xl">
          <h1 className="font-bold text-2xl text-center p-4">You Won!</h1>
          <button className="place-self-center block ring-2 ring-slate-200 p-2 rounded-xl m-2 " onClick={() => setGameOver(true)}>Try again?</button>
          </div>: ''}
        <div ref={canvasRef} className="place-self-center "/>
      
      </>
    )
  
}

export default Level2