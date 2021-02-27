import { Talk, Track } from '../client-axios'

export const Talks: Talk[] = [
  {
    id: 1,
    trackId: 1,
    videoId: '453942665',
    title: 'ほげふが',
    abstract: 'ぴよぴよ',
    speakers: [
      { id: 1, name: 'alice' },
      { id: 2, name: 'bob' },
    ],
    dayId: 1,
    showOnTimetable: true,
    startTime: '2021-02-15 14:00:00',
    endTime: '2021-02-15 15:00:00',
    talkDuration: 1,
    talkDifficulty: 'hoge',
    talkCategory: 'fuga',
  },
  {
    id: 2,
    trackId: 1,
    videoId: '450845161',
    title: 'ふー',
    abstract: 'ばー',
    speakers: [
      { id: 3, name: 'taro' },
      { id: 4, name: 'jiro' },
    ],
    dayId: 1,
    showOnTimetable: true,
    startTime: '2021-02-15 14:00:00',
    endTime: '2021-02-15 15:00:00',
    talkDuration: 1,
    talkDifficulty: 'hoge',
    talkCategory: 'fuga',
    onAir: true,
  },
  {
    id: 3,
    trackId: 1,
    videoId: '453963160',
    title: 'ほげほげほげ',
    abstract: 'ぴよぴよぴよ',
    speakers: [
      { id: 5, name: 'foo' },
      { id: 6, name: 'bar' },
    ],
    dayId: 1,
    showOnTimetable: true,
    startTime: '2021-02-15 14:00:00',
    endTime: '2021-02-15 15:00:00',
    talkDuration: 1,
    talkDifficulty: 'hoge',
    talkCategory: 'fuga',
  },
]

export const Tracks: Track[] = [
  {
    id: 10,
    name: 'A',
    videoId: '453942665',
    videoPlatform: 'vimeo',
  },
  {
    id: 11,
    name: 'B',
    videoId: '450845161',
    videoPlatform: 'vimeo',
  },
  {
    id: 12,
    name: 'C',
    videoId: '453963160',
    videoPlatform: 'vimeo',
  },
]
