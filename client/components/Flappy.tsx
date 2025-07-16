import Matter, { World } from "matter-js"
import { useEffect, useRef, useState } from "react";
import Level2 from "./Level2";

function Flappy(){
  const canvasRef = useRef<HTMLDivElement | undefined>(undefined)
    const [gameOver, setGameOver] = useState(false)
    const [endGame, setEndGame] = useState(false)
    const [level, setLevel] = useState(1)
    
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
            background: '#4ac4ed',
            hasBounds: true
          },
      });
  
      // create two boxes and a ground
      const ballA = Bodies.circle(400, 200, 40, {
        frictionAir: 0.0,
        friction: 0.1,
        label: 'player', 
        render: { fillStyle: '#e31010' },
      });
  
      const ground = Bodies.rectangle(400, 630, 800, 60, { isStatic: true,});
      const leftWall = Bodies.rectangle(-30, -240, 60, 1800, { isStatic: true });
      const rightWall = Bodies.rectangle(830, -240, 60, 1800, { isStatic: true });
      
      const hoop = Bodies.rectangle(600, -610, 200, 10, { isStatic: true, render: { fillStyle: "#ffffff"},});
      const endGoal = Bodies.rectangle(600, -620, 100, 10, { isStatic: true, label: 'endGoal', render: { fillStyle: "transparent"}});
  
      const platform1 = Bodies.rectangle(600, 310, 30, 200, { velocity: {x: 0, y: 0}, speed: -10, render: { fillStyle: "#33e310"} });
      const platforms = [platform1]

      console.log(platform1)
  
      document.addEventListener("keydown", function (event) {
        if (killControls === true) return 
  
        if (event.key === ' ') {
          event.preventDefault()
          Matter.Body.setVelocity(ballA, { x: 0 , y: 10 })
        }
      });
      
      Matter.Body.setSpeed(platform1, -10)
      
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
      Composite.add(engine.world, [ballA, ground, ...platforms.map((p) => p), leftWall, rightWall, hoop, endGoal]);

      
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
       <div ref={canvasRef} className="place-self-center "/>

      </div>
    )
}

export default Flappy