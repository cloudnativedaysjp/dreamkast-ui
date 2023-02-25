import React from 'react'
import * as Styled from './styled'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@material-ui/core'
import dayjs from 'dayjs'
import { Talk, Track } from '../../generated/dreamkast-api.generated'

type Props = {
  data: { track: Track; talk?: Talk }[]

  selectedTrack: number

  onChange: (selectedItem: number | null) => void
}

export const PLiveTrackList: React.FC<Props> = ({
  data,
  selectedTrack,
  onChange,
}) => {
  return (
    <Styled.Container>
      <Styled.InnerContainer>
        <Styled.Title>ライブセッション</Styled.Title>
        <Styled.List>
          <TableContainer>
            <Table aria-label="live-talks">
              <TableBody>
                {data.map(({ talk, track }) => (
                  <TableRow key={track.id}>
                    <TableCell style={{ borderBottom: 'none', width: '150px' }}>
                      <Styled.TrackSelectorButton
                        className={track.id === selectedTrack ? 'selected' : ''}
                        onClick={() => onChange(track.id)}
                      >
                        {track.name}
                      </Styled.TrackSelectorButton>
                    </TableCell>
                    <TableCell align={'left'} style={{ borderBottom: 'none' }}>
                      {talk && (
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Styled.List>
      </Styled.InnerContainer>
    </Styled.Container>
  )
}
