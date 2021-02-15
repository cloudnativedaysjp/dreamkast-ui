import { GetStaticProps } from 'next'
import { useState } from 'react'
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

const IndexPage: React.FC<{ tracks: Track[] }> = ({
  tracks,
}: {
  tracks: Track[]
}) => {
  const classes = useStyles()

  // States
  const [selectedTrackId, setSelectedTrackId] = useState<number>(tracks[0].id)

  // Handlers
  const selectTrack = (selectedId: number) => {
    setSelectedTrackId(selectedId)
  }

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
          justify="center"
          alignItems="center"
          alignContent="center"
        >
          <TrackSelector
            tracks={tracks}
            selectedTrackId={selectedTrackId}
            selectTrack={selectTrack}
          />
        </Grid>
        <Grid item xs={12} md={12} className={classes.debug} justify="center">
          <TrackView selectedTrackId={selectedTrackId} />
        </Grid>
      </Grid>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const api = new TrackApi()
  const { data } = await api.apiV1TracksGet('cndo2021')
  const tracks = data

  return {
    props: { tracks },
  }
}

export default IndexPage
