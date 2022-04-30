import React from 'react'
import * as Styled from './styled'
import { Grid } from '@material-ui/core'
import { BoothPdf } from '../../BoothPage'

type Props = {
  pdfs?: Array<BoothPdf>
}

const AttachmentPdfs: React.FC<Props> = ({ pdfs }) => {
  return (
    <Grid container spacing={10} justifyContent="center" alignItems="center">
      {pdfs?.map((pdf) => {
        return (
          <Grid item>
            <Styled.PdfContainer>
              <Styled.PdfLink href={pdf.url}>
                <Styled.PdfIcon />
                <br />
                {pdf.title}
              </Styled.PdfLink>
            </Styled.PdfContainer>
          </Grid>
        )
      })}
    </Grid>
  )
}

export default AttachmentPdfs
