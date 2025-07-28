import * as Path from 'node:path'
import express from 'express'
import cors, { CorsOptions } from 'cors'
import { GenerateContentResponse, GoogleGenAI, Type } from '@google/genai'
import { Data } from '../client/models/types'

if (process.env.NODE_ENV !== 'production'){
  const dotenv = await  import('dotenv')
  dotenv.config()
  console.log('Environment loaded. GOOGLE_MAPS_API_KEY:', process.env.GOOGLE_MAPS_API_KEY ? 'SET' : 'NOT SET')
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
    const totalRounds = Number(req.query.totalRounds)


    const prompt = `Generate ${totalRounds ? totalRounds + 1 : 6} specific street addresses for a location guessing game with the following requirements:

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
9. Include a name of what is at the address at the start if relevant, eg. Mcdonalds, natural history museum, specific building, etc.

ADDRESS ACCURACY REQUIREMENTS:
- Use exact street addresses that can be found on Google Maps
- Include precise street numbers (avoid ranges like "100-200")
- Use official street names (not colloquial names)
- Include proper postal/zip codes for the country
- Verify address format matches local conventions (US: ZIP codes, UK: postcodes, etc.)
- Choose main entrances or primary access points for landmarks
- Avoid private driveways, gated communities, or restricted access areas
- Prefer addresses on major streets rather than side streets or alleys

GEOGRAPHICAL DISTRIBUTION:
- Spread locations across different continents when possible
- Avoid clustering multiple locations in the same city unless the location set is a city
- Balance between famous landmarks and lesser-known but theme-appropriate locations

STREET VIEW OPTIMIZATION:
- Select addresses where the theme element is visible from the street
- Avoid locations inside buildings, underground, or behind barriers
- Choose viewpoints where the theme is immediately apparent to a Street View user

QUALITY VALIDATION:
- Each address should be specific enough to locate on Google Maps
- The location should offer a clear, unobstructed view of the theme element
- Verify that the address format is correct for the country
- Ensure the location name matches the actual place name
- Double-check that postal codes are valid for the city/region

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
Before finalizing each address, ask yourself: "Is this location OBVIOUSLY and DIRECTLY related to ${theme}?" If the answer is not a clear YES, choose a different location.

EXAMPLES BY THEME:
Historical: "Westminster Abbey, 20 Deans Yd, Westminster, London SW1P 3PA, UK"
Nature: "Yosemite Valley Visitor Center, 9035 Village Dr, Yosemite Valley, CA 95389, USA"
Urban: "Times Square, Broadway & 7th Ave, New York, NY 10036, USA"
Cultural: "Louvre Museum, Rue de Rivoli, 75001 Paris, France"

ADDITIONAL ADDRESS FORMAT EXAMPLES:
- USA: "Statue of Liberty, Liberty Island, New York, NY 10004, USA"
- Canada: "CN Tower, 290 Bremner Blvd, Toronto, ON M5V 3L9, Canada"
- Australia: "Sydney Opera House, Bennelong Point, Sydney NSW 2000, Australia"
- Germany: "Brandenburg Gate, Pariser Platz, 10117 Berlin, Germany"
- Japan: "Tokyo Tower, 4 Chome-2-8 Shibakoen, Minato City, Tokyo 105-0011, Japan"

ADDRESS VERIFICATION CHECKLIST:
- Does the address include a specific building number or landmark name?
- Is the postal/zip code correctly formatted for the country?
- Would this address work if entered into Google Maps?
- Is the location accessible from a public street or pathway?
- Can the theme element be seen from the street address provided?

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
                description: `An array of ${totalRounds ? totalRounds + 1 : 6} specific street addresses that match the location and theme requirements.`,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    location: {
                      type: Type.STRING,
                      description: 'A complete street address including street number, street name, city, postal code, and country.',
                      minLength: 20,
                    },
                    explanation: {
                      type: Type.STRING,
                      description: 'reasoning behind the choice made, including how each location relates to the theme and why it was chosen.',
                    },
                    fact: {
                      type: Type.STRING,
                      description: 'a fun fact or interesting detail about the location.',
                    }
                  },
                  required: ['location', 'explanation', 'fact'],
                },
                minItems: totalRounds ? totalRounds + 1 : 6,
                maxItems: totalRounds ? totalRounds + 1 : 6,
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

    res.json(locations)
  }} catch (error) {
    res.status(500).json({ error: 'Failed to generate locations' })
  }
})

// Server-side geocoding endpoint to replace client-side Google Maps API calls
server.get('/api/v1/geocode', async (req, res) => {
  try {
    if (!process.env.GOOGLE_MAPS_API_KEY) {
      return res.status(500).json({ error: 'Google Maps API key not configured' })
    }

    const { address } = req.query
    if (!address) {
      return res.status(400).json({ error: 'Address parameter required' })
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address as string)}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    )

    if (!response.ok) {
      console.error('HTTP Error from Google API:', response.status, response.statusText)
      return res.status(500).json({ error: 'Geocoding service error' })
    }

    const data = await response.json()
    console.log('Google Geocoding API response:', data)
    
    if (data.status === 'OK' && data.results && data.results.length > 0) {
      const location = data.results[0].geometry.location
      res.json({
        success: true,
        coordinates: {
          lat: location.lat,
          lng: location.lng
        },
        formatted_address: data.results[0].formatted_address
      })
    } else {
      res.status(404).json({ 
        success: false, 
        error: 'Address not found',
        status: data.status 
      })
    }
  } catch (error) {
    console.error('Geocoding error:', error)
    res.status(500).json({ error: 'Failed to geocode address' })
  }
})

// Server-side Street View metadata endpoint
server.get('/api/v1/streetview/metadata', async (req, res) => {
  try {
    if (!process.env.GOOGLE_MAPS_API_KEY) {
      return res.status(500).json({ error: 'Google Maps API key not configured' })
    }

    const { lat, lng, radius = 50000 } = req.query
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude parameters required' })
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/streetview/metadata?location=${lat},${lng}&radius=${radius}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    )

    if (!response.ok) {
      return res.status(500).json({ error: 'Street View service error' })
    }

    const data = await response.json()
    res.json(data)
  } catch (error) {
    console.error('Street View metadata error:', error)
    res.status(500).json({ error: 'Failed to get Street View metadata' })
  }
})

// Endpoint to serve Google Maps API key to authenticated frontend
server.get('/api/v1/maps-key', async (req, res) => {
  try {
    if (!process.env.GOOGLE_MAPS_API_KEY) {
      return res.status(500).json({ error: 'Google Maps API key not configured' })
    }
    
    // Basic referrer check (add your domain in production)
    const referrer = req.get('Referer') || req.get('Origin')
    const allowedDomains = ['localhost', '127.0.0.1', 'yourdomain.com'] // Add your actual domain
    
    if (referrer) {
      const isAllowed = allowedDomains.some(domain => referrer.includes(domain))
      if (!isAllowed) {
        return res.status(403).json({ error: 'Unauthorized domain' })
      }
    }
    
    res.json({ apiKey: process.env.GOOGLE_MAPS_API_KEY })
  } catch (error) {
    console.error('Error serving Maps API key:', error)
    res.status(500).json({ error: 'Failed to get Maps API key' })
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

