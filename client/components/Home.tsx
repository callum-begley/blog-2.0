import GameCards from "./GameCards";
import GeminiQuiz from "./Gemini"
import BlurText from "./bits/BlurText";



const Home = () => {
   return (
    <div className="w-screen max-w-screen-xl min-h-screen justify-self-center p-10 drop-shadow-xl/50 scroll-smooth transition-transform duration-1000">
      <BlurText
        text="Callum Begley Web Design"
        delay={100}
        animateBy="letters"
        direction="bottom"
        className="lg:text-8xl md:text-6xl sm:text-5xl text-4xl font-bold mt-72 mb-72"
      />

      <p className="text-4xl font-medium mb-48">Welcome to my new webpage. <em className="animate-ping ease-in-out dark:text-lime-400">Scroll ↓</em></p>
      <BlurText
        text="Powered by ⚛️React and styled with ༄Tailwind"
        delay={100}
        animateBy="words"
        direction="top"
        className="text-4xl font-medium mb-48"
      />
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
        text="More personal projects:"
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
        className="text-5xl font-medium mb-48 mt-48 "
      />
      </div>
    </div>
  )
}

export default Home
