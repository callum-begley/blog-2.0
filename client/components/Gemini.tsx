import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getQuiz } from '../apiClient'
import { Data, Question } from './interface'

const GeminiQuiz = () => {
  const [text, setText] = useState('Enter topic')
  const [diff, setDiff] = useState('Medium')
  const [qi, setQi] = useState(0)
  const [score, setScore] = useState(0)
  const [scoreAlert, setScoreAlert] = useState({ name: '', color: '' })
  const [start, setStart] = useState(false)
  const [correct, setCorrect] = useState('')
  const [answers, setAnswers] = useState(new Array(5))
  const [currentQ, setCurrentQ] = useState({
        question: '',
        answer1: '',
        answer2: '',
        answer3: '',
    })
const client = useQueryClient()

  const { data, isError, isFetching, refetch, isFetched } = useQuery({
    queryKey: ['quiz'],
    queryFn: async () => {
      const data = await getQuiz(text, diff)
      return data as Data | unknown
    },
    enabled: false,
  })
  if (isError) console.log('error loading')

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setText(event.target.value)
  }

  const handleSubmit = () => {
    if (text != '' && text != 'Enter topic') {
      refetch()
    }
  }

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDiff(event.target.value)
  }

  const getQuizQuestion = () => {
    setStart(true)
    const current: Question = data.questions[qi]
    setQi((x) => x + 1)
    setCorrect(current.correct_answer)
    showQuiz(current)
  }

  const showQuiz = (current: Question) => {
    setCurrentQ({
        question: current.question,
        answer1: current.answers[0],
        answer2: current.answers[1],
        answer3: current.answers[2],
    })
  }
  const buttonText = () => {
    if (isFetching) return (<span><svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className='animate-spin inline text-white invert mr-2'><path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z" className="spinner_P7sC"/></svg>Generating</span>)
    if (isFetched&& !start) return (<p className='text-white'>Quiz Ready Below</p>)
    if (isFetched&& start) return (<p className='text-slate-700'>Quiz In Progress</p>)
    return (<p className='text-white'>Generate Quiz!</p>)
  }

  const endGame = () => {
    if (qi === 6) {
      return(
        <>
        <p className='absolute -translate-x-8 -translate-y-12 p-4 text-xl font-medium'>Final Score: {score}/5</p>
        <h2 className='md:text-2xl text-center font-medium mb-4 mt-4'>Answers:</h2>
        {data.questions.map((x,i) => {
          if (answers[i] == x.correct_answer){
          return(<p key={x.correct_answer} className='text-black font-medium stroke-black bg-white m-2 p-2 rounded-md'>✔️ {i + 1} - {x.correct_answer}</p>)
          } else{
            return(<p key={x.correct_answer} className='text-red-600 font-medium stroke-black bg-white m-2 p-2 rounded-md'>❌ {i + 1} - {x.correct_answer}</p>)
          }
        })}
        <button className='block justify-self-center text-center text-2xl font-medium p-2 hover:bg-blue-300 ring-1 ring-white rounded-md m-4 shadow-lg shadow-blue-400' onClick={() => {setStart(false); setQi(0); setScore(0); setAnswers(new Array(5)); client.removeQueries({ queryKey: ['quiz'] })}}>End Quiz</button>
        </>
      )
    }
  }

   const checkAnswer = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newAnswers = [...answers]
    newAnswers[(qi - 1)] = event.target.value
    setAnswers(newAnswers)
    if (event.target.value === correct){
      setScoreAlert({ name: 'Correct!', color: 'text-green-600' })
      setScore((x) => x + 1)
    }else {setScoreAlert({ name: 'Incorrect :(', color: 'text-red-600' })}
    
    setTimeout(() => {
      setScoreAlert({ name: '', color: '' })
    }, 1000);

    if (qi === 5){
      setQi((x) => x + 1)
    }else{
    getQuizQuestion()
    }
  }

  return (
    <div className="bg-zinc-700 bg-opacity-70 dark:text-white text-black rounded-2xl md:max-w-2xl md:p-10 p-4 ring-white md:ring-2 justify-items-center">
      <h2 className='text-5xl text-center font-medium mb-8'>AI Quiz Generator</h2>
      <div className='justify-items-center content-center '>
        <div id="input" className='justify-center items-center flex'>
          <label className='text-xl'>Topic: 
          <input
            onChange={handleChange}
            value={text}
            type="text"
            name='input'
            onFocus={() => setText('')}
            className='text-black ring-blue-400 ring-2 rounded-md p-2 m-2 shadow-lg shadow-blue-400 dark:bg-zinc-600 dark:text-white'
            disabled={start}
          /></label>
          <label className='text-xl'>Difficulty:
            <select name="difficulty" className='text-black ring-blue-400 ring-2 rounded-md p-2 m-2 shadow-lg shadow-blue-400 dark:bg-zinc-600 dark:text-white' onChange={handleSelect} value={diff} disabled={start}>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </label>
        </div>

        <div className="m-4 place-items-center">
          <button className="bg-gradient-to-bl from-purple-500 to-blue-400 font-medium text-2xl rounded-full p-4 ring-white ring-2 shadow-2xl shadow-blue-400 flex m-10"
            onClick={handleSubmit}
            disabled={
              isFetching ||
              text.trim() === '' ||
              text.startsWith('Enter a topic') || start
            }>
            {buttonText()}
          </button>
        </div>

        <div id='quizBox' className="bg-gradient-to-bl from-blue-400 to-purple-500 text-white rounded-lg p-10 ring-white ring-2 justify-self-center content-center shadow-lg shadow-blue-400">
          
          {!data && !start?  <p className='text-3xl text-center font-medium mb-4'>Generate A Quiz Above</p> : !start ? <button className='block text-2xl justify-self-center text-center font-medium p-4 hover:bg-blue-300 ring-1 ring-white rounded-md p-2 m-4 shadow-lg shadow-blue-400 capitalize' onClick={getQuizQuestion}>Start {text} quiz</button> : ''}
          {start && qi < 6? <>
          <p className='absolute -translate-x-8 -translate-y-12 p-4 text-xl font-medium'>Score: {score} <span className={`${scoreAlert.color} duration-300 font-medium ease-in-out`}>{scoreAlert.name}</span></p>
          <h2 className='text-3xl text-center font-bold underline mb-4 text-shadow-lg text-shadow-sky-300 capitalize'>{text} Quiz</h2>
          
          <div className='justify-items-center self-center w-full h-full'>
            <h2 className='md:text-2xl text-center font-medium mb-4 mt-4'>{currentQ.question}</h2>
            <button className='block ring-1 ring-white rounded-md p-2 m-4 shadow-lg shadow-blue-400 hover:bg-blue-300' value={currentQ.answer1} onClick={checkAnswer}>{currentQ.answer1}</button>
            <button className='block ring-1 ring-white rounded-md p-2 m-4 shadow-lg shadow-blue-400 hover:bg-blue-300' value={currentQ.answer2} onClick={checkAnswer}>{currentQ.answer2}</button>
            <button className='block ring-1 ring-white rounded-md p-2 m-4 shadow-lg shadow-blue-400 hover:bg-blue-300' value={currentQ.answer3} onClick={checkAnswer}>{currentQ.answer3}</button>
          </div></> : endGame() }
        </div>
      </div>
    </div>
  )
}

export default GeminiQuiz
