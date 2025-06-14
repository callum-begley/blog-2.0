import Matter, { Mouse, MouseConstraint, World } from "matter-js"
import { useEffect, useRef, useState } from "react";

function AboutMe(){
  const canvasRef = useRef<HTMLDivElement | null>(null)
  const emojis = ['😊','😢','😠','😨','😂','😀','😊','😎','😟']

   useEffect(() => {
      // module aliases
      const Engine = Matter.Engine,
            Render = Matter.Render,
            Runner = Matter.Runner,
            Bodies = Matter.Bodies,
            Composite = Matter.Composite;

      // create an engine
      const engine = Engine.create();

      // create a renderer
      const render = Render.create({
          element: canvasRef.current,
          engine: engine,
          options: {
            wireframes: false,
            background: '#4dacfa'
          
          },
      });

      // create two boxes and a ground
      const ballA = Bodies.circle(400, 200, 40, {
        restitution: 0.8,
        frictionAir: 0.0,
        friction: 0.1,
        // render: { fillStyle: '#33db1d' },
        render: {
            sprite: {
              texture: '/bball.webp',
              xScale: 0.33,
              yScale: 0.33
            }
          }
      });
      const boxB = Bodies.rectangle(650, 50, 80, 80);

      const ground = Bodies.rectangle(400, 630, 800, 60, { isStatic: true });
      const leftWall = Bodies.rectangle(-30, -240, 60, 1800, { isStatic: true });
      const rightWall = Bodies.rectangle(830, -240, 60, 1800, { isStatic: true });

      const platform1 = Bodies.rectangle(200, 210, 200, 10, { isStatic: true });
      const platform2 = Bodies.rectangle(600, 410, 200, 10, { isStatic: true });
      const platform3 = Bodies.rectangle(200, -210, 200, 10, { isStatic: true });
      const platform4 = Bodies.rectangle(600, 10, 200, 10, { isStatic: true });
      const platforms = [platform1, platform2, platform3, platform4]

      document.addEventListener("keydown", function (event) {
        const keyCode = event.key
        const position = ballA.position
        const speed = 10; // set the speed of movement
        const currentV = Matter.Body.getVelocity(ballA)
        const currentS = Matter.Body.getSpeed(ballA)

        // move the body based on the key pressed
        if (keyCode === 'a') {
          // move left
          Matter.Body.setVelocity(ballA, { x: -4, y: currentV.y })
        } else if (keyCode === 'w') {
          // move up
          Matter.Body.setVelocity(ballA, { x: currentV.x , y: -10 })
        } else if (keyCode === 'd') {
          // move right
          Matter.Body.setVelocity(ballA, { x: 4, y: currentV.y })
        } else if (keyCode === 's') {
          // move down
          Matter.Body.translate(ballA, { x: currentV.x, y: speed });
        }
      });
      
      Render.setPixelRatio(render, 10)

     
      const mouse = Mouse.create(canvasRef?.current);
      const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });
    render.mouse = mouse; 
    
    document.body.addEventListener("mousedown", () => {
        const { x, y } = mouse.position
        const randX = Math.floor(Math.random()* 800)
        const randE = Math.floor(Math.random()* emojis.length)

        const newBody = Bodies.circle(x, y, 20, {
          restitution: 0.8,
          render: {
            sprite: {
              texture: '/cry.png',
              xScale: 1,
              yScale: 1
            }
          },})

        Composite.add(engine.world, newBody)
      })

      

  function track(){
    Render.lookAt(render, ballA, {
      x: 200,
      y: 200
    });
  }

  function repeatOften() {
    track()
    requestAnimationFrame(repeatOften);
  }
  requestAnimationFrame(repeatOften);   

      // add all of the bodies to the world
      Composite.add(engine.world, [ballA, boxB, ground, ...platforms.map((p) => p), leftWall, rightWall, mouseConstraint]);

      // run the renderer
      Render.run(render);

      // create runner
      const runner = Runner.create();

      // run the engine
      Runner.run(runner, engine);
      
      return () => {
        console.log("Effect cleanup");
        Render.stop(render);
        Runner.stop(runner);
        if (canvasRef.current) {
          // eslint-disable-next-line react-hooks/exhaustive-deps
          canvasRef.current.removeChild(render.canvas);
        }
      World.clear(engine.world, false);
      Engine.clear(engine);
      };

    }, []);
  

  
   return (
    <div className="place-self-center pt-40">
      <div ref={canvasRef} className="place-self-center "/>
      <script src="matter.js"></script>
    </div>
  )
}

export default AboutMe