import { Layout } from '../components/Layout'
import { Miro } from '../components/Miro'
import { Grid } from '@material-ui/core'

const DiscussionPage: React.FC = () => {
  return (
    <Layout title="CloudNative Days 2021 - DiscussionBoard">
      <Grid container spacing={1} justify="center" alignItems="flex-start">
        <Grid item xs={12} md={8}>
          <h2>DiscussionBoard</h2>
          <Miro
            miroId="o9J_leFyDWo="
            liveEmbed={false}
            viewport="moveToViewport=-94,-1521,7088,5264"
          />
        </Grid>
      </Grid>
    </Layout>
  )
}

export default DiscussionPage
