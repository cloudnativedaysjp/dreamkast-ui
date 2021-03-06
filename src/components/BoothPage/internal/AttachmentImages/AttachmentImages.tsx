import React from 'react'

import * as Styled from './styled'
import { Grid } from '@material-ui/core'

type Props = {
  images?: Array<string>
}

export const AttachmentImages: React.FC<Props> = ({ images }) => {
  return (
    <Grid container spacing={5} justify="center" alignItems="center">
      {images?.map((url) => {
        return (
          <Grid item md={12}>
            <Styled.KeyImage src={url} />
          </Grid>
        )
      })}
    </Grid>
  )
}
