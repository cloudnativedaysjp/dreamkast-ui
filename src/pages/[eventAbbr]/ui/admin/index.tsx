import { NextPage } from 'next'
import { Typography } from '@material-ui/core'
import { Camera } from '../../../../components/Camera'

const IndexPage: NextPage = () => {
  return <IndexMain />
}

const IndexMain: NextPage = () => {
  return (
    <>
      <Typography variant="h5">Admin!!!!!!!!!!!!!!1</Typography>
      <Camera height={100} width={100} />
    </>
  )
}

export default IndexPage
