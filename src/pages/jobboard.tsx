import { Layout } from '../components/Layout'
import { Miro } from '../components/Miro'
import { Button, Grid } from '@material-ui/core'
import * as CommonStyled from '../styles/styled'

const JobPage: React.FC = () => {
  return (
    <Layout title="JobBoard - CNDT 2021">
      <CommonStyled.OuterContainer
        container
        spacing={1}
        justify="center"
        alignItems="flex-start"
      >
        <Grid item xs={12} md={12}>
          <CommonStyled.Container>
            <CommonStyled.Header2 centerized={true}>
              JobBoard
            </CommonStyled.Header2>
            <CommonStyled.CenterizedContainer>
              <Button
                variant="contained"
                color="secondary"
                href="https://miro.com/app/board/o9J_lrLaU1A=/"
              >
                参加する
              </Button>
            </CommonStyled.CenterizedContainer>
            <Miro
              miroId="o9J_lrLaU1A="
              liveEmbed={false}
              viewport="moveToViewport=-24938,-12732,39382,23860"
            />
          </CommonStyled.Container>
        </Grid>
      </CommonStyled.OuterContainer>
    </Layout>
  )
}

export default JobPage
