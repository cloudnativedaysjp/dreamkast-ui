import React from 'react'
import * as Styled from './styled'
import { Talk, Track } from '../../generated/dreamkast-api.generated'
import dayjs from 'dayjs'
import { setupDayjs } from '../../util/setupDayjs'
import HtmlTooltip from './HtmlTooltip'

setupDayjs()

type Props = {
  data: { track: Track; talk?: Talk }[]
  selectedTrack: number
  onChange: (selectedItem: number | null) => void
}

export const PTrackSelectorButtonGroup: React.FC<Props> = ({
  data,
  selectedTrack,
  onChange,
}) => {
  return (
    <Styled.TrackSelectorButtonGroup
      value={selectedTrack}
      color="primary"
      onChange={(_, i) => onChange(i)}
      exclusive
    >
      {data.map(({ track, talk }) => (
        <HtmlTooltip
          key={track.id}
          title={
            <React.Fragment>
              <div>
                {!talk ? (
                  'ライブセッションはありません'
                ) : (
                  <>
                    {talk.onAir && <Styled.Live>LIVE</Styled.Live>}{' '}
                    {dayjs(talk.startTime).tz().format('HH:mm')}-
                    {dayjs(talk.endTime).tz().format('HH:mm')}
                    <br />
                    {talk.title}
                    <br />
                    {talk.speakers?.map((s) => s.name).join(', ')}
                  </>
                )}
              </div>
            </React.Fragment>
          }
        >
          <Styled.MenuItem
            key={track.id}
            value={track.id}
            selected={selectedTrack === track.id}
          >
            {track.name}
          </Styled.MenuItem>
        </HtmlTooltip>
      ))}
    </Styled.TrackSelectorButtonGroup>
  )
}
