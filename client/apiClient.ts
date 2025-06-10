import request from 'superagent'
import { Data } from './models/interface'

const rootURL = new URL('/api/v1', document.baseURI)

export async function getQuiz(topic: string, diff: string): Promise<Data> {
  const res = await request.get(`${rootURL}/quiz`).query('topic=' + topic + 'difficulty=' + diff)
  return res.body.quiz as Data
}
