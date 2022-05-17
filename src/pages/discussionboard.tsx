import { Layout } from '../components/Layout'
import { Miro } from '../components/Miro'
import { Button, Grid } from '@material-ui/core'
import * as CommonStyled from '../styles/styled'

const DiscussionPage: React.FC = () => {
  return (
    <Layout title="DiscussionBoard - CNDT 2021">
      <CommonStyled.OuterContainer
        container
        spacing={1}
        justifyContent="center"
        alignItems="flex-start"
      >
        <Grid item xs={12} md={12}>
          <CommonStyled.Container>
            <CommonStyled.Header2 centerized={true}>
              DiscussionBoard
            </CommonStyled.Header2>
            <CommonStyled.CenterizedContainer>
              <Button
                variant="contained"
                color="secondary"
                href="https://miro.com/app/board/o9J_l58Mqh0=/"
              >
                参加する
              </Button>
            </CommonStyled.CenterizedContainer>
            <Miro
              miroId="o9J_l58Mqh0="
              liveEmbed={false}
              viewport="moveToViewport=347,-121,3506,3506"
            />
          </CommonStyled.Container>
        </Grid>
      </CommonStyled.OuterContainer>
    </Layout>
  )
}

export default DiscussionPage
