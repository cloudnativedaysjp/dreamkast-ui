import React, { useEffect, useState } from 'react'
import * as Styled from './styled'
import { Talk } from '../../client-axios'
import { Checkbox } from '@material-ui/core'
import dayjs from 'dayjs'

type Props = {
  selectedTrackId?: number
  selectedTalk?: Talk
  talks: Talk[]
  isLiveMode?: boolean
  selectTalk: (talk: Talk) => void
  changeLiveMode?: (
    event: React.ChangeEvent<HTMLInputElement>,
    mode: boolean,
  ) => void
}

interface TalkWithAvailable extends Talk {
  available: boolean
}

const isAvailable = (
  now: number,
  startTime: string,
  conferanceDayDate?: string | null,
) => {
  if (!conferanceDayDate) return true
  const startDate = `${conferanceDayDate} ${dayjs(startTime).format('HH:mm')}`
  return now - dayjs(startDate).unix() >= 0
}

export const TalkSelector: React.FC<Props> = ({
  selectedTrackId,
  selectedTalk,
  talks,
  isLiveMode,
  selectTalk,
  changeLiveMode,
}) => {
  const [talksWithAvailableState, setTalksWithAvailableState] = useState<
    TalkWithAvailable[]
  >([])
  const [now, setNow] = useState<number>(dayjs().unix())
  const [id, setId] = useState<number>()

  useEffect(() => {
    if (!process.browser) return
    setId(
      window.setInterval(() => {
        setNow(dayjs().unix())
      }, 1000),
    )
    return window.clearInterval(id)
  }, [])

  useEffect(() => {
    const filteredTalks = sortTalks(talks).filter((talk) => {
      return talk.showOnTimetable
    })
    setTalksWithAvailableState(
      filteredTalks.map((talk) => {
        return {
          ...talk,
          available: isAvailable(now, talk.startTime, talk.conferenceDayDate),
        }
      }),
    )
  }, [talks, now])

  const sortTalks = (talks: Talk[]): Talk[] => {
    return talks.sort((n1, n2) => {
      if (n1.startTime > n2.startTime) {
        return 1
      }

      if (n1.startTime < n2.startTime) {
        return -1
      }

      return 0
    })
  }

  return (
    <Styled.Container>
      <Styled.Title>このトラックのセッション</Styled.Title>
      <Styled.List>
        {talksWithAvailableState.map((talk) => {
          if (talk.trackId == selectedTrackId) {
            return (
              <Styled.Item
                button
                key={talk.id}
                disabled={!talk.available}
                selected={talk.id === selectedTalk?.id}
                onClick={() => selectTalk(talk)}
              >
                <Styled.Text>
                  {talk.onAir && <Styled.Live>LIVE</Styled.Live>}{' '}
                  {dayjs(talk.startTime).format('HH:mm')}-
                  {dayjs(talk.endTime).format('HH:mm')}
                  <br />
                  {talk.title}
                </Styled.Text>
              </Styled.Item>
            )
          }
        })}
      </Styled.List>
      <Styled.Footer>
        <Checkbox size="small" checked={isLiveMode} onChange={changeLiveMode} />
        <Styled.label>ライブ中のセッションに自動遷移する</Styled.label>
      </Styled.Footer>
    </Styled.Container>
  )
}
