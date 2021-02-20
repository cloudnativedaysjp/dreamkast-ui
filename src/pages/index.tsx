import { useState, useEffect, useCallback } from 'react'
import Layout from '../components/Layout'
import TrackSelector from '../components/TrackSelector'
import TrackView from '../components/Track'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import { Track, TrackApi } from '../client-axios'

const useStyles = makeStyles({
  debug: {
    //backgroundColor: "#C00",
  },
})

const IndexPage: React.FC = () => {
  const classes = useStyles()

  // States
  const [selectedTrackId, setSelectedTrackId] = useState<number>(0)
  const [tracks, setTracks] = useState<Track[]>([])

  // Handlers
  const selectTrack = (selectedId: number) => {
    setSelectedTrackId(selectedId)
  }

  const getTracks = useCallback(async () => {
    const api = new TrackApi()
    const { data } = await api.apiV1TracksGet('cndo2021')
    setTracks(data)
    setSelectedTrackId(data[0].id)
  }, [])

  useEffect(() => {
    getTracks()
  }, [])

  return (
    <Layout title="Dreamkast">
      <Grid
        container
        spacing={0}
        justify="center"
        alignItems="center"
        alignContent="center"
      >
        <Grid
          item
          xs={12}
          md={8}
          className={classes.debug}
        >
          <TrackSelector
            tracks={tracks}
            selectedTrackId={selectedTrackId}
            selectTrack={selectTrack}
          />
        </Grid>
        <Grid item xs={12} md={12} className={classes.debug}>
          <TrackView selectedTrackId={selectedTrackId} />
        </Grid>
      </Grid>
    </Layout>
  )
}

export default IndexPage
