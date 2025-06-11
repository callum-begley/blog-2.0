import * as Path from 'node:path'
import express from 'express'
import cors, { CorsOptions } from 'cors'
import { GenerateContentResponse, GoogleGenAI, Type } from '@google/genai'
import { Data } from '../client/models/types'

if (process.env.NODE_ENV !== 'production'){
  const dotenv = await  import('dotenv')
  dotenv.config()
}
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
const server = express()

server.get('/api/v1/quiz', async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'API key error' })
    }
    const topic = req.query.topic
    const difficulty = req.query.difficulty

    const prompt = `create a 5 question quiz about ${topic ? topic : 'anything'} with a difficulty of ${difficulty ? difficulty : 'any'},` //respond with no intro and no line breaks (/n), just a JSON (key questions) with 5 questions in an array (key question), 3 possible answers for each in another array (key answers), and the correct answers in an array (key correct_answer)`

    const result: GenerateContentResponse  = await genAI.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
            properties: {
              questions: {
                type: Type.ARRAY,
                description: 'An array of quiz questions.',
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: {
                      type: Type.STRING,
                      description: 'The text of the quiz question.',
                    },
                    answers: {
                      type: Type.ARRAY,
                      description: 'An array of possible answers for the question.',
                      items: { type: Type.STRING },
                      minItems: 3,
                      maxItems: 3,
                    },
                    correct_answer: {
                      type: Type.STRING,
                      description: 'The correct answer to the question, which must be one of the provided answers.',
                    },
                  },
                  required: ['question', 'answers', 'correct_answer'],
                },
                minItems: 5,
                maxItems: 5,
              },
            },
            required: ['questions'],
          },
      },
    })

    if(!result || !result.candidates || !result.candidates[0].content || !result.candidates[0].content.parts || !result.candidates[0].content.parts[0].text){
      return res.status(500).json({ error: 'Failed to generate quiz' })
    }else{

    const formatted = result.candidates[0].content.parts[0].text

    const quiz: Data = JSON.parse(formatted)

    res.json({ quiz: quiz })
  }} catch (error) {
    res.status(500).json({ error: 'Failed to generate quiz' })
  }
})

server.use(express.json())
server.use(cors('*' as CorsOptions))

if (process.env.NODE_ENV === 'production') {
  server.use(express.static(Path.resolve('public')))
  server.use('/assets', express.static(Path.resolve('./dist/assets')))
  server.get('*', (req, res) => {
    res.sendFile(Path.resolve('./dist/index.html'))
  })
}

export default server

