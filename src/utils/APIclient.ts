import fetch from 'node-fetch'
import { Event, Track, Talk } from '../interfaces'

/***
  Event API
***/
type GetEventParam = { eventId: number }
export async function getEvent(param: GetEventParam): Promise<Event> {
  const res = await fetch(`${process.env.API_URL}/events/${param.eventId}`)
  return (await res.json()) as Event
}

/***
  Track API
***/
type GetAllTracksParam = { eventId: number }
export async function getTracks(param: GetAllTracksParam): Promise<Track[]> {
  const res = await fetch(`${process.env.API_URL}/tracks/${param.eventId}`)
  return (await res.json()) as Track[]
}

type GetTrackParam = { trackId: number }
export async function getTrack(param: GetTrackParam): Promise<Track> {
  const res = await fetch(`${process.env.API_URL}/tracks/${param.trackId}`)
  return (await res.json()) as Track
}

/***
  Talk API
***/
type GetTalksParam = { eventId: number; trackId?: number }
export async function getTalks(param: GetTalksParam): Promise<Talk[]> {
  const URL = param.trackId
    ? `${process.env.API_URL}/talks/${param.eventId}?trackId=${param.trackId}`
    : `${process.env.API_URL}/talks/${param.eventId}`
  const res = await fetch(URL)
  return (await res.json()) as Talk[]
}

type GetTalkParam = { talkId: number }
export async function getTalk(param: GetTalkParam): Promise<Talk> {
  const res = await fetch(`${process.env.API_URL}/talks/${param.talkId}`)
  return (await res.json()) as Talk
}
