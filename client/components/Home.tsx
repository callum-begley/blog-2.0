import ContactForm from "./ContactForm";
import GameCards from "./GameCards";
import GeminiQuiz from "./Gemini"
import BlurText from "./bits/BlurText";



const Home = () => {
   return (
    <div className="w-screen max-w-screen-xl min-h-screen justify-self-center p-10 drop-shadow-xl/50 scroll-smooth transition-transform duration-1000">
      <BlurText
        text="Callum Begley"
        delay={100}
        animateBy="letters"
        direction="top"
        className="lg:text-8xl md:text-6xl sm:text-5xl text-5xl font-bold mt-56 mb-10"
      />
      <BlurText
        text="Software Developer"
        delay={0}
        stepDuration={1}
        animateBy="letters"
        direction="bottom"
        className="lg:text-8xl md:text-6xl sm:text-5xl text-5xl font-bold mb-56"
      />
      <p className="text-4xl font-medium mb-48">Welcome to my new webpage. <em className="animate-ping ease-in-out dark:text-lime-400">Scroll ↓</em></p>
      <BlurText
        text="Powered by ⚛️React and styled with ༄Tailwind"
        delay={100}
        animateBy="words"
        direction="top"
        className="text-4xl font-medium "
      />
      <div id="About-Me" className="mb-72"></div>
      <BlurText
        text="About Me:"
        delay={100}
        animateBy="words"
        direction="top"
        className="text-4xl font-medium mb-24 mt-48"
      />
      <div  className="grid grid-cols-[2fr_1fr] grid-rows-2 content-center mb-48 min-h-96 place-items-center">
      <BlurText
        text="I am a Software Developer with a background in Engineering sales and
              management. I have an interest in problem solving and creating, which lately has
              been making games in JavaScript and Unity, as well as music in Ableton Live."
        delay={0}
        animateBy="words"
        direction="top"
        className="text-xl font-medium mb-10"
      />
      <img src="/images/slippery-snake.jpg" alt="Callum Begley" className="rounded-full row-span-2 w-72 h-72 object-cover ml-10 shadow-lg hover:scale-150 transition-transform duration-300" />
         <BlurText
        text="In 2024, I ventured overseas to explore more of the world. I returned to New
              Zealand with a goal of finding a new career path in the technology industry. I
              have taken the first steps and I’m excited about continuing this journey."
        delay={0}
        animateBy="words"
        direction="top"
        className="text-xl font-medium mb-10"
      />
      </div>
      <BlurText
        text="Try out my AI Quiz Generator below"
        delay={100}
        animateBy="words"
        direction="top"
        className="text-4xl font-medium mb-24"
      />
      <BlurText
        text="It generates a 5 question quiz on any topic you choose, at different difficulty levels"
        delay={50}
        animateBy="words"
        direction="top"
        className="text-4xl font-medium mb-24"
      />
      <BlurText
        text="Powered by Google Gemini API"
        delay={100}
        animateBy="words"
        direction="top"
        className="text-4xl font-medium mb-48"
      />

      <div className= 'justify-items-center m-10 mb-48'>
        <GeminiQuiz/>
      </div>
      <BlurText
        text="More projects:"
        delay={100}
        animateBy="words"
        direction="top"
        className="text-5xl font-medium mb-10"
      />
      <GameCards />
      <div id='contact'>
        <BlurText
        text="Contact:"
        delay={100}
        animateBy="words"
        direction="top"
        className="text-5xl font-medium mt-48 "
      />
      <ContactForm />
      </div>
    </div>
  )
}

export default Home
