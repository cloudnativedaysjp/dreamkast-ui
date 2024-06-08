import React, { useEffect, useRef, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import { TalkInfoLT } from '../TalkInfo'
import { Sponsors } from '../Sponsors'
import 'dayjs/locale/ja'
import { Event } from '../../generated/dreamkast-api.generated'

type Props = {
  event: Event
  youtubeEmbedLink: string
  title: string
  content: string
}

export const TrackLTView: React.FC<Props> = ({
  event,
  youtubeEmbedLink,
  title,
  content,
}) => {
  const parentRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  const updateDimensions = () => {
    if (!parentRef.current) {
      return
    }
    const { offsetWidth } = parentRef.current
    setSize({ width: offsetWidth, height: (offsetWidth * 9) / 16 })
  }

  useEffect(() => {
    updateDimensions()
    let timer: NodeJS.Timeout | number = 0
    window.addEventListener('resize', () => {
      clearTimeout(timer)
      timer = setTimeout(updateDimensions, 200)
    })
  }, [])

  return (
    <Grid container spacing={1} justifyContent="center" alignItems="flex-start">
      <Grid item xs={12} md={8}>
        <div ref={parentRef} style={{ width: '100%' }}>
          <iframe
            width={`${size.width}`}
            height={`${size.height}`}
            src={youtubeEmbedLink}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
        {parentRef.current && (
          <>
            <Sponsors event={event} />
            <TalkInfoLT
              eventAbbr={event.abbr}
              title={title}
              content={content}
            />
          </>
        )}
      </Grid>
    </Grid>
  )
}
