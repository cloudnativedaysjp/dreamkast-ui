import React, { useEffect, useState } from 'react'
import {
  Booth as BoothInterface,
  BoothPdfUrls as BoothPdfUrlsInterface,
  BoothApi,
  Configuration,
} from '../../client-axios'
import * as Styled from './styled'
import { Grid } from '@material-ui/core'
import AttachmentPdfs from './internal/AttachmentPdfs'
import { AttachmentImages } from './internal/AttachmentImages/AttachmentImages'

type Props = {
  boothId?: string
}

export class BoothPdf implements BoothPdfUrlsInterface {
  url?: string
  title?: string
}
export class Booth implements BoothInterface {
  id: number
  sponsorId: number
  sponsorName: string
  published: boolean
  description: string
  url?: string
  abbr: string
  text: string
  logoUrl: string
  vimeoUrl: string
  miroUrl: string
  pdfUrls: Array<BoothPdf>
  keyImageUrls: Array<string>

  constructor(
    id: number,
    sponsorId: number,
    sponsorName: string,
    published: boolean,
    description: string,
    abbr: string,
    text: string,
    logoUrl: string,
    vimeoUrl: string,
    miroUrl: string,
    pdfUrls: Array<BoothPdf>,
    keyImageUrls: Array<string>,
    url?: string,
  ) {
    this.id = id
    this.sponsorId = sponsorId
    this.sponsorName = sponsorName
    this.published = published
    this.description = description
    this.url = url
    this.abbr = abbr
    this.text = text
    this.logoUrl = logoUrl
    this.vimeoUrl = vimeoUrl
    this.miroUrl = miroUrl
    this.pdfUrls = pdfUrls
    this.keyImageUrls = keyImageUrls
  }
}

export const BoothPage: React.FC<Props> = ({ boothId }) => {
  const [booth, setBooth] = useState<Booth>()
  const getBooth = async () => {
    if (!boothId) return
    const api = new BoothApi(
      new Configuration({ basePath: window.location.origin }),
    )
    const { data } = await api.apiV1BoothsBoothIdGet(boothId)
    setBooth(data)
  }

  useEffect(() => {
    getBooth()
  }, [boothId])

  const miroEmbedUrl = (id?: string) => {
    if (!id) return
    return 'https://miro.com/app/embed/' + id + '/?autoplay=yep'
  }

  const leftPane = () => {
    return (
      <Styled.Container>
        <Grid item xs={12} md={12}>
          <Styled.CenterContainer>
            <Styled.LogoImg src={booth?.logoUrl} />
          </Styled.CenterContainer>
          <Styled.CenterContainer>
            <h3>{booth?.sponsorName}</h3>
          </Styled.CenterContainer>
          <p>{booth?.description}</p>
        </Grid>

      </Styled.Container>
    )
  }

  const rightPane = () => {
    return (
      <Styled.Container>
        <AttachmentImages images={booth?.keyImageUrls} />
        <Grid item xs={12}>
          <Styled.CenterContainer>
            <p>{booth?.text}</p>
          </Styled.CenterContainer>
        </Grid>

        { booth?.miroUrl &&
        <Grid item xs={12}>
          <Styled.HeaderContainer>
            <h2>
              オンラインホワイトボード (編集するには、左下のリンクをクリック)
            </h2>
          </Styled.HeaderContainer>
          <Styled.CenterContainer>
            <Styled.MiroIframe
              src={miroEmbedUrl(booth?.miroUrl)}
              frameBorder="0"
              scrolling="no"
              allowFullScreen
            ></Styled.MiroIframe>
          </Styled.CenterContainer>
        </Grid>
        }
        { booth?.vimeoUrl &&
        <Grid item xs={12}>
          <Styled.VimeoContainer>
          <Styled.VimeoIframe
              src={booth?.vimeoUrl}
              width="100%"
              height="360"
              frameBorder="0"
              allow="autoplay; fullscreen"
              allowFullScreen>
          </Styled.VimeoIframe>
          </Styled.VimeoContainer>
        </Grid>
        }
        { booth?.pdfUrls &&
        <Grid item xs={12}>
          <Styled.HeaderContainer>
            <h2>PDF資料ダウンロード</h2>
          </Styled.HeaderContainer>
          <AttachmentPdfs pdfs={booth?.pdfUrls} />
        </Grid>
        }
      </Styled.Container>
    )
  }

  return (
    <Styled.BoothPageContainer>
      <Grid container spacing={1}>
        <Grid item xs={12} md={4}>
          {leftPane()}
        </Grid>

        <Grid item xs={12} md={8}>
          {rightPane()}
        </Grid>
      </Grid>
    </Styled.BoothPageContainer>
  )
}
