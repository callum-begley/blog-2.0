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

    const prompt = `create a 5 question quiz about ${topic ? topic : 'anything'} with a difficulty of ${difficulty ? difficulty : 'any'},`
    //respond with no intro and no line breaks (/n), just a JSON (key questions) with 5 questions in an array (key question), 3 possible answers for each in another array (key answers), and the correct answers in an array (key correct_answer)`

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

server.get('/api/v1/maps', async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'API key error' })
    }
    const location = req.query.location
    const theme = req.query.theme

    const prompt = `Generate 5 specific street addresses for a location guessing game with the following requirements:

LOCATION: ${location ? location : 'anywhere in the world'}
THEME: ${theme ? theme : 'interesting places'}

CRITICAL THEME ADHERENCE:
You must STRICTLY follow the theme. Every single location must be directly related to the theme. If the theme is "beaches", ALL 5 locations must be beach-related. If "historical", ALL must be historical sites.

STRICT REQUIREMENTS:
1. All addresses must be real, specific street addresses (not just city names or general areas)
2. All locations must have Google Street View coverage available
3. ALL 5 locations must be DIRECTLY and OBVIOUSLY related to the specified theme
4. Include full postal addresses with street numbers, street names, city, and country
5. Choose locations that are visually distinctive and immediately recognizable for the theme
6. Locations should be outside of buildings or private properties, ideally in public spaces
7. Ensure the addresses are diverse geographically but ALL match the theme
8. The address should provide a view that clearly shows the theme

ENHANCED THEME INTERPRETATION:
- "historical": ONLY addresses near castles, ancient ruins, historical monuments, war memorials, historic battlefields, museums with historic significance, old palaces, heritage sites
- "nature": ONLY addresses near national parks, beaches, mountains, forests, waterfalls, scenic viewpoints, nature reserves, botanical gardens, coastal areas
- "urban": ONLY addresses in major city centers, near skyscrapers, busy intersections, commercial districts, metropolitan areas, downtown cores
- "cultural": ONLY addresses near famous theaters, art galleries, opera houses, cultural centers, religious buildings, concert halls, libraries, universities
- "food": ONLY addresses in famous food markets, restaurant districts, food halls, culinary neighborhoods, wine regions, famous cafes
- "beaches": ONLY addresses directly on or immediately adjacent to beaches, coastal promenades, seaside areas
- "mountains": ONLY addresses in mountainous regions, near ski resorts, mountain viewpoints, alpine areas
- "sports": ONLY addresses near stadiums, sports complexes, famous sporting venues, Olympic sites
- "architecture": ONLY addresses near famous buildings, architectural landmarks, iconic structures
- "random": Choose 5 completely different themes (1 historical, 1 nature, 1 urban, 1 cultural, 1 food)

THEME VALIDATION:
Before finalizing each address, ask yourself: "Is this location OBVIOUSLY and DIRECTLY related to [THEME]?" If the answer is not a clear YES, choose a different location.

EXAMPLES BY THEME:
Historical: "Westminster Abbey, 20 Deans Yd, Westminster, London SW1P 3PA, UK"
Nature: "Yosemite Valley Visitor Center, 9035 Village Dr, Yosemite Valley, CA 95389, USA"
Urban: "Times Square, Broadway & 7th Ave, New York, NY 10036, USA"
Cultural: "Louvre Museum, Rue de Rivoli, 75001 Paris, France"

Return exactly 5 addresses in JSON format. Each address must be a perfect match for the theme.`

    const result: GenerateContentResponse  = await genAI.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
            properties: {
              locations: {
                type: Type.ARRAY,
                description: 'An array of 5 specific street addresses that match the location and theme requirements.',
                items: {
                  type: Type.OBJECT,
                  properties: {
                    location: {
                      type: Type.STRING,
                      description: 'A complete street address including street number, street name, city, postal code, and country.',
                      minLength: 20,
                    },
                  },
                  required: ['location'],
                },
                minItems: 5,
                maxItems: 5,
              },
            },
            required: ['locations'],
          },
      },
    })

    if(!result || !result.candidates || !result.candidates[0].content || !result.candidates[0].content.parts || !result.candidates[0].content.parts[0].text){
      return res.status(500).json({ error: 'Failed to generate locations' })
    }else{

    const formatted = result.candidates[0].content.parts[0].text

    const locations: Data = JSON.parse(formatted)

    res.json({ locations: locations })
  }} catch (error) {
    res.status(500).json({ error: 'Failed to generate locations' })
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

