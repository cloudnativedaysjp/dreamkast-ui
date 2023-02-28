import React from 'react'
import * as Styled from './styled'
import { Talk, Track } from '../../generated/dreamkast-api.generated'
import { PLiveTalkList } from './PLiveTalkList'
import { useDispatch, useSelector } from 'react-redux'
import {
  settingsSelector,
  setViewTrackId,
  tracksSelector,
} from '../../store/settings'
import { PTrackSelectorButtonGroup } from './PTrackSelectorButtonGroup'
import { LiveTalkModalButton } from './LiveTalkModalButton'
import { ContainerComponent } from '../../util/types'

export const TrackSelector: React.FC = () => {
  return (
    <CTrackSelector
      content={(props) => <PTrackSelector {...props} />}
    ></CTrackSelector>
  )
}

export const CTrackSelector: ContainerComponent<PProps> = ({ content }) => {
  const { viewTrackId } = useSelector(settingsSelector)
  const { tracksWithLiveTalk } = useSelector(tracksSelector)

  const dispatch = useDispatch()
  const handleChange = (selectItem: number | null) => {
    dispatch(setViewTrackId(selectItem))
  }

  return content({ viewTrackId, tracksWithLiveTalk, handleChange })
}

type PProps = {
  viewTrackId: number
  tracksWithLiveTalk: { track: Track; talk?: Talk }[]

  handleChange: (selectedItem: number | null) => void
}

const PTrackSelector: React.FC<PProps> = ({
  viewTrackId,
  tracksWithLiveTalk,
  handleChange,
}) => {
  return (
    <>
      <Styled.TrackMenuContainer>
        <PTrackSelectorButtonGroup
          data={tracksWithLiveTalk}
          selectedTrack={viewTrackId}
          onChange={handleChange}
        ></PTrackSelectorButtonGroup>
        <LiveTalkModalButton
          content={(closeModal) => (
            <PLiveTalkList
              data={tracksWithLiveTalk}
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
