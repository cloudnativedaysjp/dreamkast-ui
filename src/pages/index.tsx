import Layout from '../components/layout'
import TrackSelector from '../components/track-selector'
import Track from '../components/track'

const IndexPage = () => (
  <Layout title="Home | Next.js + TypeScript Example">
    <p>
      <TrackSelector tracks={["Track1", "Track2", "Track3"]} />
      <Track />
    </p>
  </Layout>
)

export default IndexPage
