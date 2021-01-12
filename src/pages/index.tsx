import Layout from '../components/layout'
import TrackSelector from '../components/track-selector'
import Track from '../components/track'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import { useState } from 'react'
import { Talks } from '../utils/talk-data'
import { Talk } from '../interfaces'

const useStyles = makeStyles({
  debug: {
    //backgroundColor: "#C00",
  },
})

const IndexPage: React.FC = () => {
  const classes = useStyles()

  // States
  const [selectedTrackId, setSelectedTrackId] = useState('1')
  const [talks] = useState(Talks)
  const [selectedTalk, setSelectedTalk] = useState(talks[0])

  // Handlers
  const selectTrack = (selectedId: string) => {
    setSelectedTrackId(selectedId)
    talks.forEach((talk) => {
      if (talk.trackId == selectedId) {
        if (talk.onAir) {
          setSelectedTalk(talk)
        }
      }
    })
  }

  const selectTalk = (talk: Talk) => {
    setSelectedTalk(talk)
  }

  return (
    <Layout title="Home | Next.js + TypeScript Example">
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
            selectedTrackId={selectedTrackId}
            selectTrack={selectTrack}
          />
        </Grid>
        <Grid item xs={12} md={12} className={classes.debug} justify="center">
          <Track
            selectedTalk={selectedTalk}
            selectedTrackId={selectedTrackId}
            talks={talks}
            selectTalk={selectTalk}
          />
        </Grid>
      </Grid>
    </Layout>
  )
}

export default IndexPage
