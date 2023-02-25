import React from 'react'
import * as Styled from './styled'
import { Track } from '../../generated/dreamkast-api.generated'
import { PLiveTalkList } from './PLiveTalkList'
import { useTracksWithLiveTalk } from './hooks'
import { useDispatch, useSelector } from 'react-redux'
import { settingsSelector, setViewTrackId } from '../../store/settings'
import { PTrackSelectorButtonGroup } from './PTrackSelectorButtonGroup'
import { LiveTalkModalButton } from './LiveTalkModalButton'

type Props = {
  selectedTrack: Track | null
  selectTrack: (track: Track) => void
}

export const TrackSelector: React.FC<Props> = () => {
  const { viewTrackId } = useSelector(settingsSelector)
  // TODO move to selector
  const data = useTracksWithLiveTalk()

  const dispatch = useDispatch()
  const handleChange = (selectItem: number | null) => {
    dispatch(setViewTrackId(selectItem))
  }

  return (
    <>
      <Styled.TrackMenuContainer>
        <PTrackSelectorButtonGroup
          data={data}
          selectedTrack={viewTrackId}
          onChange={handleChange}
        ></PTrackSelectorButtonGroup>
        <LiveTalkModalButton
          content={(closeModal) => (
            <PLiveTalkList
              data={data}
              selectedTrack={viewTrackId}
              onChange={(i) => {
                closeModal()
                handleChange(i)
              }}
            />
          )}
        ></LiveTalkModalButton>
      </Styled.TrackMenuContainer>
    </>
  )
}
