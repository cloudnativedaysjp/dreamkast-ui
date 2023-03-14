import React from 'react'
import { render } from '@testing-library/react'
import { TrailMapPointHistory } from '../TrailMapPointHistory'

describe('TrailMapPointHistory', () => {
  it('should render without crash', () => {
    const data = {
      total: 70,
      points: [
        {
          conference: 'cicd2023',
          pointEventId: '34973274ccef6ab4dfaaf86599792fa9c3fe4689',
          point: 50,
          timestamp: 1678197315,
          desc: 'セッション視聴: 1日目 スロット1',
        },
        {
          conference: 'cicd2023',
          pointEventId: '23e182506f4b883d8aae3d29d08e044c55b04deb',
          point: 20,
          timestamp: 1678197330,
          desc: 'セッション視聴: 1日目 スロット2',
        },
      ],
    }
    const screen = render(
      <TrailMapPointHistory pointData={data}></TrailMapPointHistory>,
    )
    expect(screen.asFragment()).toMatchSnapshot()
  })
})
