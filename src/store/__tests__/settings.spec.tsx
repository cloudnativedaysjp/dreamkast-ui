import React from 'react'
import { renderWithProviders, setupStore } from '../../testhelper/store'
import {
  updateViewTalkWithLiveOne,
  setInitialViewTalk,
  setIsLiveMode,
  setTalks,
  setTracks,
  setViewTalkId,
  setViewTrackId,
  useSelectedTalk,
  useSelectedTrack,
  useTracks,
  videoCommandSelector,
  patchTalksOnAir,
  OnAirTalk,
  newVideoCommand,
} from '../settings'
import {
  MockTalkA1,
  MockTalkA2,
  MockTalkA3,
  MockTalkB1,
  MockTalkC1,
  MockTalks,
  MockTrackA,
  MockTrackB,
  MockTrackC,
  MockTracks,
} from '../../testhelper/fixture'
import { useSelector } from 'react-redux'
import { Talk } from '../../generated/dreamkast-api.generated'

const archive = (t: Talk) => {
  t.onAir = false
  return t
}

const onAir = (t: Talk) => {
  t.onAir = true
  return t
}

describe('useTracks', () => {
  it('should provide tracks along with corresponding live talk', () => {
    let got: any = null
    const want = [
      {
        track: MockTrackA(),
        talk: MockTalkA1(),
      },
      {
        track: MockTrackB(),
      },
      {
        track: MockTrackC(),
      },
    ]

    const Test = () => {
      const tracks = useTracks()
      got = tracks.tracksWithLiveTalk
      return <div />
    }

    const store = setupStore()
    store.dispatch(setTracks(MockTracks()))
    store.dispatch(setTalks(MockTalks()))
    renderWithProviders(<Test />, { store })

    expect(got).toStrictEqual(want)
  })

  it('should provide tracks only when no talk set', () => {
    let got: any = null
    const want = [
      {
        track: MockTrackA(),
      },
      {
        track: MockTrackB(),
      },
      {
        track: MockTrackC(),
      },
    ]

    const Test = () => {
      const tracks = useTracks()
      got = tracks.tracksWithLiveTalk
      return <div />
    }

    const store = setupStore()
    store.dispatch(setTracks(MockTracks()))
    renderWithProviders(<Test />, { store })

    expect(got).toStrictEqual(want)
  })

  it('should provide empty array when no track set', () => {
    let got: any = null

    const Test = () => {
      const tracks = useTracks()
      got = tracks.tracksWithLiveTalk
      return <div />
    }

    const store = setupStore()
    renderWithProviders(<Test />, { store })

    expect(got).toHaveLength(0)
  })
})

describe('useSelectedTrack', () => {
  it('should provide selected track along with onAirTalk', () => {
    let got: any = null
    const want = {
      track: MockTrackA(),
      talks: [MockTalkA1(), MockTalkA2(), MockTalkA3()],
      onAirTalk: MockTalkA1(),
    }

    const Test = () => {
      got = useSelectedTrack()
      return <div />
    }

    const store = setupStore()
    store.dispatch(setTracks(MockTracks()))
    store.dispatch(setTalks(MockTalks()))
    store.dispatch(setViewTrackId(MockTrackA().id))
    renderWithProviders(<Test />, { store })

    expect(got).toStrictEqual(want)
  })

  it('should provide selected track without onAirTalk when no live talk exists', () => {
    let got: any = null
    const want = {
      track: MockTrackB(),
      talks: [MockTalkB1()],
      onAirTalk: undefined,
    }

    const Test = () => {
      got = useSelectedTrack()
      return <div />
    }

    const store = setupStore()
    store.dispatch(setTracks(MockTracks()))
    store.dispatch(setTalks(MockTalks()))
    store.dispatch(setViewTrackId(MockTrackB().id))
    renderWithProviders(<Test />, { store })

    expect(got).toStrictEqual(want)
  })

  it('should provide undefined when not selected', () => {
    let got: any = null
    const want = {
      talks: [],
    }

    const Test = () => {
      got = useSelectedTrack()
      return <div />
    }

    const store = setupStore()
    store.dispatch(setTracks(MockTracks()))
    store.dispatch(setTalks(MockTalks()))
    renderWithProviders(<Test />, { store })

    expect(got).toStrictEqual(want)
  })

  it('should provide undefined when no track exist', () => {
    let got: any = null
    const want = {
      talks: [],
    }

    const Test = () => {
      got = useSelectedTrack()
      return <div />
    }

    const store = setupStore()
    store.dispatch(setTalks(MockTalks()))
    renderWithProviders(<Test />, { store })

    expect(got).toStrictEqual(want)
  })
})

describe('useSelectedTalk', () => {
  it('should provide selected talk on selected track', () => {
    let got: any = null
    const want = {
      talk: MockTalkA1(),
    }

    const Test = () => {
      got = useSelectedTalk()
      return <div />
    }

    const store = setupStore()
    store.dispatch(setTracks(MockTracks()))
    store.dispatch(setTalks(MockTalks()))
    store.dispatch(setViewTrackId(MockTrackA().id))
    store.dispatch(setViewTalkId(MockTalkA1().id))
    renderWithProviders(<Test />, { store })

    expect(got).toStrictEqual(want)
  })

  it('should provide no talk when no talk selected', () => {
    let got: any = null
    const want = {}

    const Test = () => {
      got = useSelectedTalk()
      return <div />
    }

    const store = setupStore()
    store.dispatch(setTracks(MockTracks()))
    store.dispatch(setTalks(MockTalks()))
    store.dispatch(setViewTrackId(MockTrackA().id))
    renderWithProviders(<Test />, { store })

    expect(got).toStrictEqual(want)
  })

  it('should provide no talk when no talk exist on the selected track', () => {
    let got: any = null
    const want = {}

    const Test = () => {
      got = useSelectedTalk()
      return <div />
    }

    const store = setupStore()
    store.dispatch(setTracks(MockTracks()))
    store.dispatch(setTalks([MockTalkB1(), MockTalkC1()]))
    store.dispatch(setViewTrackId(MockTrackA().id))
    renderWithProviders(<Test />, { store })

    expect(got).toStrictEqual(want)
  })

  it('should provide no talk when selected track not exist', () => {
    let got: any = null
    const want = {}

    const Test = () => {
      got = useSelectedTalk()
      return <div />
    }

    const store = setupStore()
    store.dispatch(setTracks(MockTracks()))
    store.dispatch(setTalks(MockTalks()))
    store.dispatch(setViewTrackId(0))
    renderWithProviders(<Test />, { store })

    expect(got).toStrictEqual(want)
  })
})

describe('selector:videoCommandSelector', () => {
  it('should provide the videoId of the track when selected talk is live', () => {
    let got = {} as unknown
    const want = newVideoCommand('onAir', MockTrackA().videoId!)

    const Test = () => {
      got = useSelector(videoCommandSelector)
      return <div />
    }

    const store = setupStore()
    store.dispatch(setTracks(MockTracks()))
    store.dispatch(setTalks(MockTalks()))
    store.dispatch(setViewTrackId(MockTrackA().id))
    store.dispatch(setViewTalkId(MockTalkA1().id))
    renderWithProviders(<Test />, { store })

    expect(got).toStrictEqual(want)
  })

  it('should provide the videoId of the talk when selected talk is not live', () => {
    let got = {} as unknown
    const want = newVideoCommand('archived', MockTalkA1().videoId)

    const Test = () => {
      got = useSelector(videoCommandSelector)
      return <div />
    }

    const store = setupStore()
    const mockTalks = [archive(MockTalkA1()), MockTalkA2(), onAir(MockTalkA3())]
    store.dispatch(setTracks(MockTracks()))
    store.dispatch(setTalks(mockTalks))
    store.dispatch(setViewTrackId(MockTrackA().id))
    store.dispatch(setViewTalkId(MockTalkA1().id))
    renderWithProviders(<Test />, { store })

    expect(got).toStrictEqual(want)
  })

  it('should provide archiving status when selected talk is placed before the onAir talk but no videoId provided', () => {
    let got = {} as unknown
    const want = newVideoCommand('archiving')

    const Test = () => {
      got = useSelector(videoCommandSelector)
      return <div />
    }

    const store = setupStore()
    const mockTalks = [archive(MockTalkA1()), MockTalkA2(), onAir(MockTalkA3())]
    store.dispatch(setTracks(MockTracks()))
    store.dispatch(setTalks(mockTalks))
    store.dispatch(setViewTrackId(MockTrackA().id))
    store.dispatch(setViewTalkId(MockTalkA2().id))
    renderWithProviders(<Test />, { store })

    expect(got).toStrictEqual(want)
  })

  it('should provide notStarted status when selected talk is placed after the onAir talk', () => {
    let got = {} as unknown
    const want = newVideoCommand('notStarted')

    const Test = () => {
      got = useSelector(videoCommandSelector)
      return <div />
    }

    const store = setupStore()
    store.dispatch(setTracks(MockTracks()))
    store.dispatch(setTalks(MockTalks()))
    store.dispatch(setViewTrackId(MockTrackA().id))
    store.dispatch(setViewTalkId(MockTalkA3().id))
    renderWithProviders(<Test />, { store })

    expect(got).toStrictEqual(want)
  })

  it('should provide empty string when no talks', () => {
    let got = {} as unknown
    const want = newVideoCommand('notSelected')

    const Test = () => {
      got = useSelector(videoCommandSelector)
      return <div />
    }

    const store = setupStore()
    store.dispatch(setTracks(MockTracks()))
    store.dispatch(setViewTrackId(MockTrackA().id))
    renderWithProviders(<Test />, { store })

    expect(got).toStrictEqual(want)
  })

  it('should provide empty string when no tracks', () => {
    let got = {} as unknown
    const want = newVideoCommand('notSelected')

    const Test = () => {
      got = useSelector(videoCommandSelector)
      return <div />
    }

    const store = setupStore()
    store.dispatch(setTalks(MockTalks()))
    store.dispatch(setViewTalkId(MockTalkA1().id))
    renderWithProviders(<Test />, { store })

    expect(got).toStrictEqual(want)
  })

  it('should provide empty string when no track selected', () => {
    let got = {} as unknown
    const want = newVideoCommand('notSelected')

    const Test = () => {
      got = useSelector(videoCommandSelector)
      return <div />
    }

    const store = setupStore()
    store.dispatch(setTracks(MockTracks()))
    store.dispatch(setTalks(MockTalks()))
    store.dispatch(setViewTalkId(MockTalkA1().id))
    renderWithProviders(<Test />, { store })

    expect(got).toStrictEqual(want)
  })

  it('should provide empty string when no talk selected', () => {
    let got = {} as unknown
    const want = newVideoCommand('notSelected')

    const Test = () => {
      got = useSelector(videoCommandSelector)
      return <div />
    }

    const store = setupStore()
    store.dispatch(setTracks(MockTracks()))
    store.dispatch(setTalks(MockTalks()))
    store.dispatch(setViewTrackId(MockTrackA().id))
    renderWithProviders(<Test />, { store })

    expect(got).toStrictEqual(want)
  })
})

describe('action:setInitialViewTalk', () => {
  it('should set the first track as viewing Track', () => {
    const store = setupStore()
    store.dispatch(setTracks(MockTracks()))

    store.dispatch(setInitialViewTalk())

    const got = {
      viewTrackId: store.getState().settings.viewTrackId,
    }
    const want = {
      viewTrackId: MockTrackA().id,
    }
    expect(got).toStrictEqual(want)
  })

  it('should set the live talk of the selected track as viewing Talk', () => {
    const store = setupStore()
    store.dispatch(setTracks(MockTracks()))
    store.dispatch(
      setTalks([
        archive(MockTalkA1()),
        onAir(MockTalkA2()),
        archive(MockTalkA3()),
      ]),
    )

    store.dispatch(setInitialViewTalk())

    const got = {
      viewTalkId: store.getState().settings.viewTalkId,
      isLiveMode: store.getState().settings.isLiveMode,
    }
    const want = {
      viewTalkId: MockTalkA2().id,
      isLiveMode: true,
    }
    expect(got).toStrictEqual(want)
  })

  it('should set the selected talk of the selected track as viewing Talk', () => {
    const store = setupStore()
    store.dispatch(setTracks(MockTracks()))
    store.dispatch(
      setTalks([
        archive(MockTalkA1()),
        archive(MockTalkA2()),
        archive(MockTalkA3()),
      ]),
    )

    store.dispatch(setInitialViewTalk())

    const got = {
      viewTalkId: store.getState().settings.viewTalkId,
      isLiveMode: store.getState().settings.isLiveMode,
    }
    const want = {
      viewTalkId: MockTalkA1().id,
      isLiveMode: false,
    }
    expect(got).toStrictEqual(want)
  })

  it('should skip talk setting when already selected', () => {
    const store = setupStore()
    store.dispatch(setTracks(MockTracks()))
    store.dispatch(
      setTalks([
        archive(MockTalkA1()),
        onAir(MockTalkA2()),
        archive(MockTalkA3()),
      ]),
    )
    store.dispatch(setViewTalkId(MockTalkA3().id))

    store.dispatch(setInitialViewTalk())

    const got = {
      viewTalkId: store.getState().settings.viewTalkId,
      isLiveMode: store.getState().settings.isLiveMode,
    }
    const want = {
      viewTalkId: MockTalkA3().id,
      isLiveMode: false,
    }
    expect(got).toStrictEqual(want)
  })
})

describe('action:updateViewTalkWithLiveOne', () => {
  it('should set next talkId', () => {
    const store = setupStore()
    store.dispatch(setTalks(MockTalks()))
    store.dispatch(setTracks(MockTracks()))
    store.dispatch(setIsLiveMode(true))
    store.dispatch(setViewTrackId(MockTrackA().id))
    store.dispatch(setViewTalkId(MockTalkA1().id))

    const nextTalks = {
      [MockTrackA().id]: MockTalkA2(),
    }
    store.dispatch(updateViewTalkWithLiveOne(nextTalks))

    const got = {
      viewTalkId: store.getState().settings.viewTalkId,
    }
    const want = {
      viewTalkId: MockTalkA2().id,
    }
    expect(got).toStrictEqual(want)
  })

  it('should skip setting next talk when not live mode', () => {
    const store = setupStore()
    store.dispatch(setTalks(MockTalks()))
    store.dispatch(setTracks(MockTracks()))
    store.dispatch(setIsLiveMode(false))
    store.dispatch(setViewTrackId(MockTrackA().id))
    store.dispatch(setViewTalkId(MockTalkA1().id))

    const nextTalks = {
      [MockTrackA().id]: MockTalkA2(),
    }
    store.dispatch(updateViewTalkWithLiveOne(nextTalks))

    const got = {
      viewTalkId: store.getState().settings.viewTalkId,
    }
    const want = {
      viewTalkId: MockTalkA1().id,
    }
    expect(got).toStrictEqual(want)
  })

  it('should skip setting next talk when viewTalkId is not set', () => {
    const store = setupStore()
    store.dispatch(setTalks(MockTalks()))
    store.dispatch(setTracks(MockTracks()))
    store.dispatch(setIsLiveMode(true))
    store.dispatch(setViewTrackId(MockTrackA().id))

    const nextTalks = {
      [MockTrackA().id]: MockTalkA2(),
    }
    store.dispatch(updateViewTalkWithLiveOne(nextTalks))

    const got = {
      viewTalkId: store.getState().settings.viewTalkId,
    }
    const want = {
      viewTalkId: 0,
    }
    expect(got).toStrictEqual(want)
  })
})

describe('action:patchTalksOnAir', () => {
  it('should update onAir status of talks and tracks', () => {
    const store = setupStore()
    store.dispatch(setTalks(MockTalks()))
    store.dispatch(setTracks(MockTracks()))

    const nextTalks = {
      [MockTrackA().id]: onAir(MockTalkA2()),
      [MockTrackB().id]: onAir(MockTalkB1()),
    }
    store.dispatch(patchTalksOnAir(nextTalks))

    const { settings } = store.getState()
    const got = {
      talkPrevOnAirA: settings.talks.find((t) => t.id === MockTalkA1().id),
      talkNowOnAirA: settings.talks.find((t) => t.id === MockTalkA2().id),
      talkNowOnAirB: settings.talks.find((t) => t.id === MockTalkB1().id),
      onAirTalkOnTrackA: settings.tracks.find((t) => t.id === MockTrackA().id)!
        .onAirTalk as OnAirTalk | null,
      onAirTalkOnTrackB: settings.tracks.find((t) => t.id === MockTrackB().id)!
        .onAirTalk as OnAirTalk | null,
      onAirTalkOnTrackC: settings.tracks.find((t) => t.id === MockTrackC().id)!
        .onAirTalk as OnAirTalk | null,
    }

    expect(got.talkPrevOnAirA!.onAir).toBeFalsy()
    expect(got.talkNowOnAirA!.onAir).toBeTruthy()
    expect(got.talkNowOnAirB!.onAir).toBeTruthy()
    expect(got.onAirTalkOnTrackA!.talk_id).toBe(MockTalkA2().id)
    expect(got.onAirTalkOnTrackB!.talk_id).toBe(MockTalkB1().id)
    expect(got.onAirTalkOnTrackC).toBeNull()
  })

  it('should update onAir all statuses of talks and tracks to false when no next talks given', () => {
    const store = setupStore()
    store.dispatch(setTalks(MockTalks()))
    store.dispatch(setTracks(MockTracks()))

    const nextTalks = {}
    store.dispatch(patchTalksOnAir(nextTalks))

    const { settings } = store.getState()
    const got = {
      talkPrevOnAirA: settings.talks.find((t) => t.id === MockTalkA1().id),
      onAirTalkOnTrackA: settings.tracks.find((t) => t.id === MockTrackA().id)!
        .onAirTalk as OnAirTalk | null,
      onAirTalkOnTrackB: settings.tracks.find((t) => t.id === MockTrackB().id)!
        .onAirTalk as OnAirTalk | null,
      onAirTalkOnTrackC: settings.tracks.find((t) => t.id === MockTrackC().id)!
        .onAirTalk as OnAirTalk | null,
    }

    expect(got.talkPrevOnAirA!.onAir).toBeFalsy()
    expect(got.onAirTalkOnTrackA).toBeNull()
    expect(got.onAirTalkOnTrackB).toBeNull()
    expect(got.onAirTalkOnTrackC).toBeNull()
  })
})
