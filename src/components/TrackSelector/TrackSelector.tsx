import React from 'react'
import * as Styled from './styled'
import { Talk, Track } from '../../generated/dreamkast-api.generated'
import { PLiveTalkList } from './PLiveTalkList'
import { useDispatch, useSelector } from 'react-redux'
import {
  setInitialViewTalk,
  hideLT,
  setViewTrackId,
  useTracks,
  viewTrackIdSelector,
} from '../../store/settings'
import { PTrackSelectorButtonGroup } from './PTrackSelectorButtonGroup'
import { LiveTalkModalButton } from './LiveTalkModalButton'
import { ContainerComponent } from '../../util/types'
import { ShowLTButton } from './ShowLTButton'

export const TrackSelector: React.FC = () => {
  return (
    <CTrackSelector
      content={(props) => <PTrackSelector {...props} />}
    ></CTrackSelector>
  )
}

export const CTrackSelector: ContainerComponent<PProps> = ({ content }) => {
  const viewTrackId = useSelector(viewTrackIdSelector)
  const { tracksWithLiveTalk } = useTracks()

  const dispatch = useDispatch()
  const handleChange = (selectItem: number | null) => {
    dispatch(setViewTrackId(selectItem))
    dispatch(setInitialViewTalk())
    dispatch(hideLT())
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
        <Styled.OptionButtonGroup>
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
          <ShowLTButton />
        </Styled.OptionButtonGroup>
      </Styled.TrackMenuContainer>
    </>
  )
}
