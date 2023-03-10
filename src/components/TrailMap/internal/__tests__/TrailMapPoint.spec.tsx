import React from 'react'
import { render } from '@testing-library/react'
import { TrailMapPoint } from '../TrailMapPoint'

describe('TrailMapPoint', () => {
  it('should render loading skeleton', () => {
    const data = {
      total: 20,
      points: [],
    }
    const screen = render(<TrailMapPoint pointData={data}></TrailMapPoint>)
    expect(screen.asFragment()).toMatchSnapshot()
  })

  it('should render loading skeleton when loading pointData', () => {
    const data = {
      total: 0,
      points: [],
    }
    const screen = render(
      <TrailMapPoint isLoading={true} pointData={data}></TrailMapPoint>,
    )
    expect(screen.asFragment()).toMatchSnapshot()
  })

  it('should render loading skeleton', () => {
    const data = {
      total: 0,
      points: [],
    }
    const screen = render(
      <TrailMapPoint isLoading={true} pointData={data}></TrailMapPoint>,
    )
    expect(screen.asFragment()).toMatchSnapshot()
  })
})
