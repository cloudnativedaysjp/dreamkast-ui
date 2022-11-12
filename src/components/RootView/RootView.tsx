import { Layout } from '../../components/Layout'
import { TrackSelector } from '../../components/TrackSelector'
import { TrackView } from '../../components/Track'
import { Event, Track } from '../../generated/dreamkast-api.generated'

type Props = {
  event: Event
  tracks: Track[]
  selectedTrack: Track | null
  selectTrack: (track: Track) => void
}

export const RootView: React.FC<Props> = ({
  event,
  tracks,
  selectedTrack,
  selectTrack,
}) => {
  if (event) {
    return (
      <Layout title={event.name} event={event}>
        <TrackSelector
          tracks={tracks}
          selectedTrack={selectedTrack}
          selectTrack={selectTrack}
        />
        <TrackView event={event} selectedTrack={selectedTrack} />
      </Layout>
    )
  } else {
    return <div></div>
  }
}
