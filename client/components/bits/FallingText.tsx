import { useRef, useState, useEffect } from "react";
import Matter from "matter-js";

interface FallingTextProps {
  text?: string;
  highlightWords?: string[];
  trigger?: "auto" | "scroll" | "click" | "hover";
  backgroundColor?: string;
  wireframes?: boolean;
  gravity?: number;
  mouseConstraintStiffness?: number;
  fontSize?: string;
  highlightClass?: string
}

const FallingText: React.FC<FallingTextProps> = ({
  text = "",
  highlightWords = [],
  trigger = "auto",
  backgroundColor = "transparent",
  wireframes = false,
  gravity = 0.1,
  mouseConstraintStiffness = 0.2,
  // fontSize = "1rem",
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const [effectStarted, setEffectStarted] = useState(false);
  const [reset, setReset] = useState(0)

  useEffect(() => {
    if (!textRef.current) return;
    const words = text.split("");

    const newHTML = words
      .map((word) => {
        const isHighlighted = highlightWords.some((hw) => word.startsWith(hw));
        return `<span
          class="inline-block m-0 p-0 select-none ${
            isHighlighted ? "text-lime-400 font-bold m-0 p-0" : ""
          }"
        >
          ${word}
        </span>`;
      })
      .join("");

    textRef.current.innerHTML = newHTML;
  }, [text, highlightWords, reset]);

   const handleRefresh = () => {
    setReset(reset + 1);
    setEffectStarted(false)
  }

  useEffect(() => {
    if (trigger === "auto") {
      setEffectStarted(true);
      return;
    }
    if (trigger === "scroll" && containerRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setEffectStarted(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, [trigger]);

  useEffect(() => {
    if (!effectStarted) return;

    const { Engine, Render, World, Bodies, Runner, Mouse, MouseConstraint } =
      Matter;

    if (!containerRef.current || !canvasContainerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const width = containerRect.width *0.8;
    const height = containerRect.height * 0.65;

    if (width <= 0 || height <= 0) return;

    const engine = Engine.create();
    engine.world.gravity.y = gravity;

    const render = Render.create({
      element: canvasContainerRef.current,
      engine,
      options: {
        width,
        height,
        background: backgroundColor,
        wireframes,
      },
    });

    const boundaryOptions = {
      isStatic: true,
      render: { fillStyle: "transparent" },
    };
    const floor = Bodies.rectangle(
      width / 2,
      height + 25,
      width,
      50,
      boundaryOptions
    );
    const leftWall = Bodies.rectangle(
      -25,
      height / 2,
      50,
      height,
      boundaryOptions
    );
    const rightWall = Bodies.rectangle(
      width + 25,
      height / 2,
      50,
      height,
      boundaryOptions
    );
    const ceiling = Bodies.rectangle(
      width / 2,
      -25,
      width,
      50,
      boundaryOptions
    );

    if (!textRef.current) return;
    const wordSpans = textRef.current.querySelectorAll("span");
    const wordBodies = [...wordSpans].map((elem) => {
      const rect = elem.getBoundingClientRect();

      const x = rect.left - containerRect.left + rect.width / 2;
      const y = rect.top - containerRect.top + rect.height / 2;

      const body = Bodies.rectangle(x, y, rect.width, rect.height, {
        render: { fillStyle: "transparent" },
        restitution: 0.8,
        frictionAir: 0.01,
        friction: 0.2,
      });
      Matter.Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 5,
        y: 0,
      });
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.05);

      return { elem, body };
    });

    wordBodies.forEach(({ elem, body }) => {
      elem.style.position = "absolute";
      elem.style.left = `${
        body.position.x - body.bounds.max.x + body.bounds.min.x / 2
      }px`;
      elem.style.top = `${
        body.position.y - body.bounds.max.y + body.bounds.min.y / 2
      }px`;
      elem.style.transform = "none";
    });

    const mouse = Mouse.create(containerRef.current);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: mouseConstraintStiffness,
        render: { visible: false },
      },
    });
    render.mouse = mouse;

    World.add(engine.world, [
      floor,
      leftWall,
      rightWall,
      ceiling,
      mouseConstraint,
      ...wordBodies.map((wb) => wb.body),
    ]);

    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    const updateLoop = () => {
      wordBodies.forEach(({ body, elem }) => {
        const { x, y } = body.position;
        elem.style.left = `${x}px`;
        elem.style.top = `${y}px`;
        elem.style.transform = `translate(-50%, -50%) rotate(${body.angle}rad)`;
      });
      Matter.Engine.update(engine);
      requestAnimationFrame(updateLoop);
    };
    updateLoop();

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      if (render.canvas && canvasContainerRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        canvasContainerRef.current.removeChild(render.canvas);
      }
      World.clear(engine.world, false);
      Engine.clear(engine);
    };
  }, [
    effectStarted,
    gravity,
    wireframes,
    backgroundColor,
    mouseConstraintStiffness,
  ]);

  const handleTrigger = () => {
    if (!effectStarted && (trigger === "click" || trigger === "hover")) {
      setEffectStarted(true);
    }
  };

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div
      ref={containerRef}
      className="relative z-40 w-full h-full justify-content-center cursor-pointer text-center pt-8 overflow-hidden"
      onClick={trigger === "click" ? handleTrigger : undefined}
      onMouseEnter={trigger === "hover" ? handleTrigger : undefined}
    >
      <div
        ref={textRef}
        className="inline-block"
        style={{
          // fontSize,
          lineHeight:'0.8em',
        }}
      />
      {effectStarted ? <button className='absolute top-1/4 right-10 text-sm ring-1 ring-white p-1 font-medium' onClick={() => handleRefresh()}>Reset</button> : <p className='absolute top-1/4 right-24 text-xs p-1 font-medium' >← click my name</p>}

      <div className="absolute top-0 left-0 z-40 justify-self-center" ref={canvasContainerRef} />
        
    </div>
    
  );
};

export default FallingText;