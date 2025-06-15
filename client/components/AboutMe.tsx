import Matter, { Mouse, MouseConstraint, World } from "matter-js"
import { useEffect, useRef, useState } from "react";

function AboutMe(){
  const canvasRef = useRef<HTMLDivElement | null>(null)
  const [timer, setTimer] = useState(0)

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
          width: 800,
          height: 600,
          options: {
            wireframes: false,
            background: '#4dacfa',
            hasBounds: true,
          },
      });

      // create two boxes and a ground
      const ballA = Bodies.circle(400, 200, 40, {
        restitution: 0.8,
        frictionAir: 0.0,
        friction: 0.1,
        label: 'player',
        collisionFilter:{category: 0x0011, mask: 0x0001 | 0x0010}, 
        render: { fillStyle: '#db0909' },
      });

      const ground = Bodies.rectangle(1000, 630, 2000, 60, { isStatic: true, render: { fillStyle: '#021a42' },collisionFilter:{category: 0x0010, mask: 0x0011}, });
      const leftWall = Bodies.rectangle(-30, 260, 60, 800, { isStatic: true, render: { fillStyle: '#021a42' },collisionFilter:{category: 0x0010, mask: 0x0011},  });
      const rightWall = Bodies.rectangle(2030, 260, 60, 800, { isStatic: true, render: { fillStyle: '#021a42' },collisionFilter:{category: 0x0010, mask: 0x0011},  });

      const obstacle = Bodies.rectangle(50, 50, 80, 80 );
      const obstacle1 = Bodies.rectangle(500, 50, 80, 80 );
      const obstacle2 = Bodies.rectangle(1050, 50, 80, 80 );
      const obstacle3 = Bodies.rectangle(1850, 50, 80, 80 );
      const obstacles = [obstacle, obstacle1, obstacle2, obstacle3]

      document.addEventListener("keydown", function (event) {
        const keyCode = event.key
        const position = ballA.position
        const speed = 10; // set the speed of movement
        const currentV = Matter.Body.getVelocity(ballA)
        const currentS = Matter.Body.getSpeed(ballA)

        // move the body based on the key pressed
        if (keyCode === 'a') {
          // move left
          Matter.Body.setVelocity(ballA, { x: -10, y: currentV.y })
        } else if (keyCode === 'w') {
          // move up
          Matter.Body.setVelocity(ballA, { x: currentV.x , y: -10 })
        } else if (keyCode === 'd') {
          // move right
          Matter.Body.setVelocity(ballA, { x: 10, y: currentV.y })
        } else if (keyCode === 's') {
          // move down
          Matter.Body.translate(ballA, { x: currentV.x, y: speed });
        }
      });

     
    //   const mouse = Mouse.create(canvasRef?.current);
    //   const mouseConstraint = MouseConstraint.create(engine, {
    //   mouse,
    //   constraint: {
    //     stiffness: 0.2,
    //     render: { visible: false },
    //   },
    // });
    // render.mouse = mouse; 
    
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

    // add all of the bodies to the world
    Composite.add(engine.world, [ballA, ground, leftWall, rightWall, ...obstacles.map((o) => o)]);

    const interval = setInterval(() => {
      const x = Math.floor(Math.random()* 2000)
      const newBody = Bodies.circle(x, -200, 20, {
          restitution: 0.8,
          label: 'enemy',
          collisionFilter:{category: 0x0001, mask: 0x0001}, 
          render: {
            sprite: {
              texture: '/cry.png',
              xScale: 1,
              yScale: 1
            }
          },})

        Composite.add(engine.world, newBody)
        setTimer((x) => x + 1)
    }, 1000)
         
    function track() {
      // Get the current X position of ballA
        const targetX = ballA.position.x;

        // Calculate the camera's view width
        const cameraViewWidth = 800;
        const halfCameraViewWidth = cameraViewWidth / 2;

        // Define the min/max allowed center X for the camera
        // The camera's left edge should not go below levelMinX (0)
        const minAllowedCameraCenterX = -10 + halfCameraViewWidth;
        // The camera's right edge should not go above levelMaxX (2000)
        const maxAllowedCameraCenterX = 2010 - halfCameraViewWidth;

        // Clamp the targetX (which is the desired center of the camera)
        let clampedCameraCenterX = Math.max(targetX, minAllowedCameraCenterX);
        clampedCameraCenterX = Math.min(clampedCameraCenterX, maxAllowedCameraCenterX);

        // Set the camera's X bounds based on the clamped center
        render.bounds.min.x = clampedCameraCenterX - halfCameraViewWidth;
        render.bounds.max.x = clampedCameraCenterX + halfCameraViewWidth;

        // Keep the vertical bounds fixed, showing the full renderHeight.
        render.bounds.min.y = 10; 
        render.bounds.max.y = 610; 
    }

    Matter.Events.on(engine, 'afterUpdate', track);

    Matter.Events.on(engine, 'collisionStart', (event) => {
            const pairs = event.pairs;
      
            for (const pair of pairs) {
              if ((pair.bodyA.label === 'player' && pair.bodyB.label === 'enemy') ||
                  (pair.bodyA.label === 'enemy' && pair.bodyB.label === 'player')) {
                // End game logic here
                console.log('hit')
                setTimer(0)
              }
            }
          });

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

    // Matter.Events.on(engine, 'collisionStart', (event) => {
    //   const pairs = event.pairs;

    //   for (const pair of pairs) {
    //     if ((pair.bodyA.label === 'player' && pair.bodyB.label === 'endGoal') ||
    //         (pair.bodyA.label === 'endGoal' && pair.bodyB.label === 'player')) {
    //       // End game logic here
    //       alert("Game Over!");
    //       // window.location.reload(true); // Example: Reload the page to restart
    //     }
    //   }
    // });



      

      // run the renderer
      Render.run(render);

      // create runner
      const runner = Runner.create();

      // run the engine
      Runner.run(runner, engine);
      
      return () => {
        Render.stop(render);
        Runner.stop(runner);
        if (canvasRef.current) {
          // eslint-disable-next-line react-hooks/exhaustive-deps
          canvasRef.current.removeChild(render.canvas);
        }
      World.clear(engine.world, false);
      Engine.clear(engine);
      clearInterval(interval)
      };

    }, []);
  

  
   return (
    <div className="place-self-center pt-40">
      <p className="absolute bottom-100 bg-zinc-600 translate-x-1 translate-y-1 p-2 rounded-md ring-2 ring-white min-w-24 text-center">Time: {timer}</p>
      <div ref={canvasRef} className="place-self-center "/>
    </div>
  )
}

export default AboutMe