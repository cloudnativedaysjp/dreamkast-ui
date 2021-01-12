import React from 'react'

type Props = {
  id: number
  title: string
  description: string
  speakers: string[]
}

const Sponsors: React.FC<Props> = ({ title, description, speakers }) => (
  <section className="talk-info">
    <h3>{title}</h3>
    <h4>{speakers.join(' / ')}</h4>
    <div>{description}</div>
  </section>
)

export default Sponsors
