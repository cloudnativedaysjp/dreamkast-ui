import * as React from 'react'
import Player from '../components/player'
import TalkInfo from '../components/talk-info'

type Props = {
  tracks: String[]
}

const Track = ({ tracks }: Props) => (
  <section className="track">
  <Player vimeo_id="450845161" autoplay={false}></Player>
  <TalkInfo id={1} title="ここにセッションのタイトル" description="これがセッションの概要" speakers={["jacopen", "r_takaishi"]} />
  </section>
)

export default Track
