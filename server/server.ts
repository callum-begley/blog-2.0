import 'dotenv/config'
import * as Path from 'node:path'
import express from 'express'
import cors, { CorsOptions } from 'cors'
import { GoogleGenAI } from '@google/genai'
import { Data, Quiz } from '../client/models/interface'

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
const server = express()

server.get('/api/v1/quiz', async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'API key error' })
    }
    const topic = req.query.topic
    const difficulty = req.query.difficulty

    const prompt = `create a 5 question quiz about ${topic ? topic : 'anything'} with a difficulty of ${difficulty ? difficulty : 'any'}, respond with no intro and no line breaks (/n), just a JSON (key questions) with 5 questions in an array (key question), 3 possible answers for each in another array (key answers), and the correct answers in an array (key correct_answer)`

    const result: Quiz  = await genAI.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: prompt,
    })

    const formatted = result.candidates[0].content.parts[0].text?.replaceAll('```json', '').replaceAll('```', '').replaceAll('\n', '')

    const quiz = JSON.parse(formatted)

    res.json({ quiz: quiz })
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate joke' })
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

