import * as React from 'react'

type Props = {
  id: Number
  title: String
  description: String
  speakers: String[]
}

const Sponsors = ({ title, description, speakers }: Props) => (
  <section className="talk-info">
      <h3>{title}</h3>
      <h4>
          {speakers.join(" / ")}
      </h4>
      <div>{description}</div>
  </section>
)

export default Sponsors
