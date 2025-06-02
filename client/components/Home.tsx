import Quiz from "./Gemini"

const Home = () => {
   return (
    <div className="w-screen max-w-screen-xl  dark:bg-zinc-900 bg-zinc-300 min-h-screen justify-self-center font-sans p-10 drop-shadow-xl/50">
      <h2 className="pb-7 text-2xl font-bold">Welcome</h2>
      <p>Welcome to my new homepage. Now powered by ⚛️React and styled with ༄Tailwind</p>
      <br/>
      <p>
        Check out my latest blog:
        <a className= 'p-4 hover:text-green-500 underline' href="/blog/foundations-reflection.html"
          >Blog 9: Foundations Reflection</a>
      </p>
      <br/>
      <div className= 'justify-items-center m-10'>
        <Quiz/>
      </div>
    </div>
  )
}

export default Home
