import React from 'react'
import { CTrackSelector } from '../TrackSelector'
import { renderWithProviders, setupStore } from '../../../testhelper/store'
import { MockTalks, MockTracks } from '../../../testhelper/fixture'
import { setTalks, setTracks, setViewTrackId } from '../../../store/settings'
import { fireEvent } from '@testing-library/react'

describe('CTrackSelector', () => {
  it('should render child component', async () => {
    const trackId = 32

    const store = setupStore()
    store.dispatch(setTalks(MockTalks()))
    store.dispatch(setTracks(MockTracks()))
    store.dispatch(setViewTrackId(trackId))

    const screen = renderWithProviders(
      <CTrackSelector
        content={({ viewTrackId, tracksWithLiveTalk }) => {
          if (viewTrackId !== 0) {
            expect(viewTrackId).toBe(trackId)
            expect(tracksWithLiveTalk).toHaveLength(3)
            return <div data-testid={'tgt'} />
          }
          return <div />
        }}
      ></CTrackSelector>,
      { store },
    )

    await screen.findByTestId('tgt')
  })

  it('should update trackId when track selected', async () => {
    const givenTrackId = 33

    const store = setupStore()
    store.dispatch(setTalks(MockTalks()))
    store.dispatch(setTracks(MockTracks()))

    const screen = renderWithProviders(
      <CTrackSelector
        content={({ handleChange }) => {
          return (
            <div
              data-testid={'tgt'}
              onClick={() => {
                handleChange(givenTrackId)
              }}
            />
          )
        }}
      ></CTrackSelector>,
      { store },
    )
    fireEvent.click(await screen.findByTestId('tgt'))

    const got = screen.store.getState().settings.viewTrackId
    expect(got).toBe(givenTrackId)
  })

  it('should update trackId when track selected', async () => {
    const givenTrackId = 33

    const store = setupStore()
    store.dispatch(setTalks(MockTalks()))
    store.dispatch(setTracks(MockTracks()))

    const screen = renderWithProviders(
      <CTrackSelector
        content={({ handleChange }) => {
          return (
            <div
              data-testid={'tgt'}
              onClick={() => {
                handleChange(givenTrackId)
              }}
            />
          )
        }}
      ></CTrackSelector>,
      { store },
    )
    fireEvent.click(await screen.findByTestId('tgt'))

    const got = screen.store.getState().settings.viewTrackId
    expect(got).toBe(givenTrackId)
  })
})
