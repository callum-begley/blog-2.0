import { SetStateAction, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getQuiz } from '../apiClient'
import { Data, Question } from './interface'

const Quiz = () => {
  const [text, setText] = useState('Enter topic')
  const [diff, setDiff] = useState('Medium')
  const [qnum, setQnum] = useState(0)
  const [score, setScore] = useState(0)
  const [scoreAlert, setScoreAlert] = useState('')
  const [start, setStart] = useState(false)
  const [correct, setCorrect] = useState('')
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

  const handleChange = (event: {
    target: { value: SetStateAction<string> }
  }) => {
    setText(event.target.value)
  }

  const handleSubmit = () => {
    if (text != '' && text != 'Enter topic') {
      refetch(text, diff)
      // setText('Enter topic')
    }
  }

  const handleSelect = (event: {
    target: { value: SetStateAction<string> }
  }) => {
    setDiff(event.target.value)
  }

  const getQuizQuestion = () => {
    setStart(true)
    const current: Question = data.questions[qnum]
    setQnum((x) => x + 1)
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
    if (isFetching) return 'Generating...'
    if (isFetched&& !start) return 'Quiz Ready Below'
    if (isFetched&& start) return 'Quiz in Progress'
    if (isFetched && !start) return 'Generate New Quiz'
    else return 'Generate Quiz!'
  }

  const endGame = () => {
    if (qnum === 6) {
      console.log('end')
      return(
        <>
        <p className='absolute -translate-x-8 -translate-y-12 p-4 text-xl font-bold'>Final Score: {score}/5</p>
        <h2 className='md:text-2xl text-center font-bold mb-4 mt-4'>Answers:</h2>
        {data.questions.map((x,i) => {
          return (<> 
                <p key={i}>{i + 1} - {x.correct_answer}</p>
          </>)
        })}
        <button className='block text-2xl justify-self-center text-center font-bold p-4 hover:bg-blue-300 ring-1 ring-white rounded-md p-2 m-4 shadow-lg shadow-blue-400' onClick={() => {setStart(false); setQnum(0); setScore(0); client.removeQueries({ queryKey: ['quiz'] })}}>End Quiz</button>
      </>
      )
    }
  }

   const checkAnswer = (event: {target: { value: SetStateAction<string> } }) => {
    if (event.target.value === correct){
      setScoreAlert('Correct! +1')
      setScore((x) => x + 1)
    }else {setScoreAlert('Incorrect :(')}
    
    setTimeout(() => {
      setScoreAlert('')
    }, 1000);

    if (qnum === 5){
      setQnum((x) => x + 1)
    }else{
    getQuizQuestion()
    }
  }

  return (
    <div className="bg-transparent dark:text-white text-black rounded-2xl md:max-w-2xl md:p-10 p-4 ring-white ring-2 justify-items-center">
      <h2 className='text-4xl text-center font-bold mb-8'>AI Quiz Generator</h2>
      <div className='justify-items-center content-center '>
        <div id="input" className='justify-center items-center flex'>
          <label className='p-2'>Topic: 
          <input
            onChange={handleChange}
            value={text}
            type="text"
            onFocus={() => setText('')}
            className='text-black ring-blue-400 ring-2 rounded-md p-2 m-2 shadow-lg shadow-blue-400'
            disabled={start}
          /></label>
          <label>Difficulty:
            <select name="difficulty" className='text-black ring-blue-400 ring-2 rounded-md p-2 m-2 shadow-lg shadow-blue-400' onChange={handleSelect} value={diff} disabled={start}>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </label>
        </div>

        <div className="m-4 place-items-center">
          <button className="bg-gradient-to-bl from-purple-500 to-blue-400 font-bold dark:text-white text-black rounded-full p-4 ring-white ring-2 shadow-2xl shadow-blue-400 flex"
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
          
          {!data && !start?  <p className='text-2xl text-center font-bold mb-4'>Generate a Quiz above</p> : !start ? <button className='block text-2xl justify-self-center text-center font-bold p-4 hover:bg-blue-300 ring-1 ring-white rounded-md p-2 m-4 shadow-lg shadow-blue-400 capitalize' onClick={getQuizQuestion}>Start {text} quiz</button> : ''}
          {start && qnum < 6? <>
          <p className='absolute -translate-x-8 -translate-y-12 p-4 text-xl font-bold'>Score: {score} <span className='text-red-600 duration-300 animate-pulse ease-in-out'>{scoreAlert}</span></p>
          <h2 className='text-3xl text-center font-extrabold mb-4 text-shadow-lg text-shadow-sky-300 capitalize'>{text} Quiz</h2>
          
          <div className='justify-items-center self-center w-full h-full'>
            <h2 className='md:text-2xl text-center font-bold mb-4 mt-4'>{currentQ.question}</h2>
            <button className='block ring-1 ring-white rounded-md p-2 m-4 shadow-lg shadow-blue-400 hover:bg-blue-300' value={currentQ.answer1} onClick={checkAnswer}>{currentQ.answer1}</button>
            <button className='block ring-1 ring-white rounded-md p-2 m-4 shadow-lg shadow-blue-400 hover:bg-blue-300' value={currentQ.answer2} onClick={checkAnswer}>{currentQ.answer2}</button>
            <button className='block ring-1 ring-white rounded-md p-2 m-4 shadow-lg shadow-blue-400 hover:bg-blue-300' value={currentQ.answer3} onClick={checkAnswer}>{currentQ.answer3}</button>
          </div></> : endGame() }
        </div>
      </div>
    </div>
  )
}

export default Quiz