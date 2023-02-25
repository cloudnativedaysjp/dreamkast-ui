import React from 'react'
import * as Styled from './styled'
import { Talk, Track } from '../../generated/dreamkast-api.generated'
import { Theme, Tooltip } from '@material-ui/core'
import dayjs from 'dayjs'
import { withStyles } from '@material-ui/styles'

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
                    {dayjs(talk.startTime).format('HH:mm')}-
                    {dayjs(talk.endTime).format('HH:mm')}
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
          <Styled.MenuItem key={track.id} value={track.id}>
            {track.name}
          </Styled.MenuItem>
        </HtmlTooltip>
      ))}
    </Styled.TrackSelectorButtonGroup>
  )
}

const HtmlTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))(Tooltip)
