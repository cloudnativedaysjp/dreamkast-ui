import React, { useEffect, useRef} from 'react'
import videojs from 'video.js';
import "video.js/dist/video-js.css";

import * as Styled from './styled'
import * as CommonStyled from '../../styles/styled'

type Props = {
  playBackUrl?: string
  autoplay: boolean
}

export const IvsPlayer: React.FC<Props> = ({ playBackUrl, autoplay }) => {
  const playerRef = useRef();
 
  useEffect(() => {
    console.log("URL")
    console.log(playBackUrl)
    const script = document.createElement("script");
    script.src =
      "https://player.live-video.net/1.4.1/amazon-ivs-videojs-tech.min.js";
    document.body.appendChild(script);

    script.addEventListener("load", () => {
      registerIVSTech(videojs);
      const player = videojs(
        "amazon-ivs-videojs",
        {
          techOrder: ["AmazonIVS"],
          autoplay: autoplay,
        },
        () => {
          console.log("Player is ready to use!");
          player.src(playBackUrl);
        }
      );
 
      playerRef.current = player;
    });
 
    return () => {
      playerRef.current.dispose();
      document.body.removeChild(script);
    };
  }, [playBackUrl]);

  return (
    <CommonStyled.Container>
      <Styled.IvsPlayerContainer>
        {playBackUrl && (
          <Styled.IvsPlayerVideo
            id="amazon-ivs-videojs"
            className="video-js vjs-16-9 vjs-big-play-centered"
            controls
            autoPlay
            playsInline
          />
        )}
      <div>
      </div>
      </Styled.IvsPlayerContainer>
    </CommonStyled.Container>
  )
}
