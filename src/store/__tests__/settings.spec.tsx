import React from 'react'
import { renderWithProviders, setupStore } from '../../testhelper/store'
import {
  liveTalkUpdate,
  setInitialViewTalk,
  setIsLiveMode,
  setTalks,
  setTracks,
  setViewTalkId,
  setViewTrackId,
  useSelectedTalk,
  useSelectedTrack,
  useTracks,
  videoIdSelector,
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

describe('selector:videoIdSelector', () => {
  it('should provide the videoId of the track when selected talk is live', () => {
    let got = ''
    const want = MockTrackA().videoId

    const Test = () => {
      got = useSelector(videoIdSelector)
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
    let got = ''
    const want = MockTalkA3().videoId

    const Test = () => {
      got = useSelector(videoIdSelector)
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
    let got = ''
    const want = ''

    const Test = () => {
      got = useSelector(videoIdSelector)
      return <div />
    }

    const store = setupStore()
    store.dispatch(setTracks(MockTracks()))
    store.dispatch(setViewTrackId(MockTrackA().id))
    renderWithProviders(<Test />, { store })

    expect(got).toStrictEqual(want)
  })

  it('should provide empty string when no tracks', () => {
    let got = ''
    const want = ''

    const Test = () => {
      got = useSelector(videoIdSelector)
      return <div />
    }

    const store = setupStore()
    store.dispatch(setTalks(MockTalks()))
    store.dispatch(setViewTalkId(MockTalkA1().id))
    renderWithProviders(<Test />, { store })

    expect(got).toStrictEqual(want)
  })

  it('should provide empty string when no track selected', () => {
    let got = ''
    const want = ''

    const Test = () => {
      got = useSelector(videoIdSelector)
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
    let got = ''
    const want = ''

    const Test = () => {
      got = useSelector(videoIdSelector)
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
  const archive = (t: Talk) => {
    t.onAir = false
    return t
  }

  const onAir = (t: Talk) => {
    t.onAir = true
    return t
  }

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

describe('action:liveTalkUpdate', () => {
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
    store.dispatch(liveTalkUpdate(nextTalks))

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
    store.dispatch(liveTalkUpdate(nextTalks))

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
    store.dispatch(liveTalkUpdate(nextTalks))

    const got = {
      viewTalkId: store.getState().settings.viewTalkId,
    }
    const want = {
      viewTalkId: 0,
    }
    expect(got).toStrictEqual(want)
  })
})
