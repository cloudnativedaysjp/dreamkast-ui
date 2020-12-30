import * as React from 'react'

type Props = {
  vimeo_id
  autoplay: Boolean
}

const Player = ({ vimeo_id, autoplay }: Props) => (
  <iframe src={"https://player.vimeo.com/video/" + vimeo_id + "?autoplay=" + Number(autoplay) }
          width="640"
          height="360"
          frameBorder="0"
          allow="autoplay; fullscreen"
          allowFullScreen>
  </iframe>
)

export default Player
