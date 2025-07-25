import request from 'superagent'
import { Data, MapsData } from './models/types'

const rootURL = new URL('/api/v1', document.baseURI)

export async function getQuiz(topic: string, diff: string): Promise<Data> {
  const res = await request.get(`${rootURL}/quiz`).query('topic=' + topic + 'difficulty=' + diff)
  return res.body.quiz as Data
}

export async function getLocations(location: string, theme: string, totalRounds: number): Promise<MapsData> {
  const res = await request.get(`${rootURL}/maps`).query({
    location: location,
    theme: theme,
    totalRounds: totalRounds
  })
  return res.body.locations as MapsData
}

