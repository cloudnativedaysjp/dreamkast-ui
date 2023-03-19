import {
  ChatMessage,
  DkUiData,
  Event,
  Profile,
  Talk,
  Track,
} from '../generated/dreamkast-api.generated'
import { deepcopy } from './index'

export const MockEvent = () =>
  deepcopy<Event>({
    id: 7,
    name: 'CloudNative Days Tokyo 2022',
    abbr: 'cndt2022',
    status: 'opened',
    theme: 'this is theme',
    about: 'this is about',
    privacy_policy: 'this is privacy policy',
    privacy_policy_for_speaker: 'this is privacy policy for speaker',
    copyright: 'this is copyright',
    coc: 'this is coc',
    conferenceDays: [
      { id: 18, date: '2022-11-22', internal: false },
      { id: 19, date: '2022-11-23', internal: false },
      { id: 20, date: '2022-10-20', internal: true },
    ],
  })
export const MockTalkA1 = () =>
  deepcopy<Talk>({
    id: 701,
    conferenceId: 7,
    trackId: 32,
    videoPlatform: 'vimeo',
    videoId: '500000001',
    title: 'Securityに関する発表',
    abstract:
      '私も九月初めてとんだ馳走家というもののうちを引き返しません。あたかも以後を意味観はけっしてその助言ますだかもをやむをえたってみうをはお話し挙げたならと、だんだんにも込み入っましでたん。主意に教えるうのも毫も当時がましてしないた。',
    speakers: [{ id: 701, name: '高石 諒' }],
    dayId: 18,
    showOnTimetable: true,
    startTime: '2000-01-01T10:00:00.000+09:00',
    endTime: '2000-01-01T10:20:00.000+09:00',
    talkDuration: 0,
    talkDifficulty: '初級者',
    talkCategory: 'CI / CD',
    onAir: true,
    documentUrl: '',
    conferenceDayId: 18,
    conferenceDayDate: '2023-02-24',
    startOffset: 0,
    endOffset: 0,
    actualStartTime: '2000-01-01T10:00:00.000+09:00',
    actualEndTime: '2000-01-01T10:20:00.000+09:00',
    presentationMethod: '現地登壇',
    slotNum: 1101,
  })

export const MockTalkA2 = () =>
  deepcopy<Talk>({
    id: 702,
    conferenceId: 7,
    trackId: 32,
    videoPlatform: 'vimeo',
    videoId: '',
    title: 'IoT/Edgeに関する10の知見',
    abstract:
      'もう大森君を表裏筆ああ所有に窮めあり珍この教頭私か誤解にというご約束ですうたたて、同じ事実はそれか社会理が申すが、嘉納さんのので心のどこでもしご学習とするてそれ農家をお記憶を考えようにどうしてもご反抗の落ちないでて、何しろ現に経験がかけるたが切ったものをするなくあり。またそれでもごただへ上っものは全く温順と出かけですて、その人からは知れだがというがたになさるがいたた。漠然たるところ自分の以上そうした人間はここ上を当てんかと張君に行かなます、作物の前ましとかいうご膨脹ませたありと、新聞のためでお蔭を以後でもの書物を今書いていながら、そうの今にしのでそのためでまあ限らでしょたいと抜かしんのないて、なくあるなてまたご人ならましのないでしで。',
    speakers: [{ id: 702, name: '三輪 昌光' }],
    dayId: 18,
    showOnTimetable: true,
    startTime: '2000-01-01T10:25:00.000+09:00',
    endTime: '2000-01-01T10:45:00.000+09:00',
    talkDuration: 0,
    talkDifficulty: '中級者',
    talkCategory: 'Customizing / Extending',
    onAir: false,
    documentUrl: '',
    conferenceDayId: 18,
    conferenceDayDate: '2023-02-24',
    startOffset: 0,
    endOffset: 0,
    actualStartTime: '2000-01-01T10:25:00.000+09:00',
    actualEndTime: '2000-01-01T10:45:00.000+09:00',
    presentationMethod: 'オンライン登壇',
    slotNum: 1102,
  })

export const MockTalkA3 = () =>
  deepcopy<Talk>({
    id: 703,
    conferenceId: 7,
    trackId: 32,
    videoPlatform: 'vimeo',
    videoId: '500000003',
    title: 'CloudNative Networking',
    abstract:
      'けれども諸君か自由か運動を申したて、以前いっぱい顔にしているです中を同講演のほかをありたです。十一月をもきっと着ばさななますまして、とうとう多分もって通知も元々ないないものた。それで肝利用にしのにはならたものたて、引込では、やはり何か出かけて答えれべきななりせないでと出るが、学校もなりが切らでな。',
    speakers: [{ id: 703, name: '山岸 克明' }],
    dayId: 18,
    showOnTimetable: true,
    startTime: '2000-01-01T10:50:00.000+09:00',
    endTime: '2000-01-01T11:10:00.000+09:00',
    talkDuration: 0,
    talkDifficulty: '上級者',
    talkCategory: 'IoT / Edge',
    onAir: false,
    documentUrl: '',
    conferenceDayId: 18,
    conferenceDayDate: '2023-02-24',
    startOffset: 0,
    endOffset: 0,
    actualStartTime: '2000-01-01T10:50:00.000+09:00',
    actualEndTime: '2000-01-01T11:10:00.000+09:00',
    presentationMethod: '事前収録',
    slotNum: 1103,
  })

export const MockTalkB1 = () =>
  deepcopy<Talk>({
    id: 714,
    conferenceId: 7,
    trackId: 33,
    videoPlatform: 'vimeo',
    videoId: '500000011',
    title: 'Docker container security',
    abstract:
      'こののになるけとして立時分しですものは徳義た。だから当人だて成就与えはずをは要らますなけれて、招待学をきまっけれども召使がなしモーニングに学校が二字三年なろて、それで酒権力か私かになっない訳で、ない上げて、画たり威力とに買い占めるまいん。',
    speakers: [
      { id: 714, name: '奥村 秀司' },
      { id: 715, name: '大川 文典' },
    ],
    dayId: 18,
    showOnTimetable: true,
    startTime: '2000-01-01T13:20:00.000+09:00',
    endTime: '2000-01-01T14:00:00.000+09:00',
    talkDuration: 0,
    talkDifficulty: '中級者',
    talkCategory: 'NFV / Edge',
    onAir: false,
    documentUrl: '',
    conferenceDayId: 18,
    conferenceDayDate: '2023-02-24',
    startOffset: 0,
    endOffset: 0,
    actualStartTime: '2000-01-01T13:20:00.000+09:00',
    actualEndTime: '2000-01-01T14:00:00.000+09:00',
    presentationMethod: null,
    slotNum: 1101,
  })

export const MockTalkC1 = () =>
  deepcopy<Talk>({
    id: 715,
    conferenceId: 7,
    trackId: 34,
    videoPlatform: 'vimeo',
    videoId: '500000021',
    title: 'BPFでパフォチュー',
    abstract:
      'しかしなり方はただも上りがいまし、また自由自由あり反抗式が秋刀魚の傍点がいうた自由です大学が奥底になるているたい時を、もし広いなくはずまし。また四篇で泰平に思うて、けっして高圧は熊本をしかしらというようなら自由た主意へ頼めうと臥せっ事を話の個人をありば得る事たば、何にありて、そうしたお話し院って高等で自分を、自由でし間際に全くしのでい片仮名から、それだけだれのようない事の発展の、心持を道のためくらい愛するではご考えを用いよたらというのは、充分腹の中の非常に取次いだ十月、驚の三つがある程度すわるてならできまっう気たもたかと通じせものです。そうしたずるがなるせる大分見識は私たり今かしかし落第いうので人情がもっれるない気ますので、そんな岡田さんが、とにかく私をすなわちほかの取消は安危の意味にとうとう進またろて出る、とうてい自由を進んたて立派たというようなのがきまっれでのを突き破るた。',
    speakers: [
      { id: 715, name: '大川 文典' },
      {
        id: 716,
        name: 'スノー・ホワイト・パラダイス・エルサント・フロウ・ワスレナ・ピュア・プリンセス・リーブル・ラブ・ハイデルン・ドコドコ・ヤッタゼ・ヴァルキュリア・パッション・アールヴ・ノエル・チャコボシ・エルアリア・フロージア・メイドイン・ブルーム・エル',
      },
    ],
    dayId: 18,
    showOnTimetable: true,
    startTime: '2000-01-01T13:20:00.000+09:00',
    endTime: '2000-01-01T14:00:00.000+09:00',
    talkDuration: 0,
    talkDifficulty: '上級者',
    talkCategory: '組織論',
    onAir: false,
    documentUrl: '',
    conferenceDayId: 18,
    conferenceDayDate: '2023-02-24',
    startOffset: 0,
    endOffset: 0,
    actualStartTime: '2000-01-01T13:20:00.000+09:00',
    actualEndTime: '2000-01-01T14:00:00.000+09:00',
    presentationMethod: null,
    slotNum: 1101,
  })

export const MockTrackA = () =>
  deepcopy<Track>({
    id: 32,
    name: 'A',
    videoId: '453942665',
    videoPlatform: 'vimeo',
    channelArn: null,
    onAirTalk: {
      id: 12,
      talk_id: 701,
      site: 'vimeo',
      url: 'NULL',
      on_air: true,
      created_at: '2022-09-19T13:19:28.705+09:00',
      updated_at: '2023-02-24T00:06:46.970+09:00',
      video_id: '',
      slido_id: null,
      video_file_data: null,
    },
  })

export const MockTrackB = () =>
  deepcopy<Track>({
    id: 33,
    name: 'B',
    videoId: '450845161',
    videoPlatform: 'vimeo',
    channelArn: null,
    onAirTalk: null,
  })

export const MockTrackC = () =>
  deepcopy<Track>({
    id: 34,
    name: 'C',
    videoId: '453963160',
    videoPlatform: 'vimeo',
    channelArn: null,
    onAirTalk: null,
  })

export const MockTalks = (() => [
  MockTalkA1(),
  MockTalkA2(),
  MockTalkA3(),
  MockTalkB1(),
  MockTalkC1(),
]) as () => Talk[]

export const MockTracks = (() => [
  MockTrackA(),
  MockTrackB(),
  MockTrackC(),
]) as () => Track[]

export const MockTrackWithTalks = (() => [
  { track: MockTrackA(), talk: MockTalkA1() },
  { track: MockTrackB(), talk: MockTalkB1() },
  { track: MockTrackC(), talk: MockTalkC1() },
]) as () => { track: Track; talk: Talk }[]

export const MockProfile = () =>
  deepcopy<Profile>({
    id: 1,
    email: 'test@example.com',
    name: 'テスト タロウ',
    isAttendOffline: true,
    registeredTalks: [],
  })

export const MockChatUser1 = () =>
  deepcopy<ChatMessage>({
    id: 286,
    profileId: 1,
    speakerId: null,
    body: 'わいわい',
    eventAbbr: 'cicd2023',
    roomType: 'talk',
    roomId: 1584,
    createdAt: '2023-03-03T23:41:05.985Z',
    replyTo: null,
    messageType: 'chat',
  })

export const MockChatUser2 = () =>
  deepcopy<ChatMessage>({
    id: 288,
    profileId: 2,
    speakerId: null,
    body: 'わいわい',
    eventAbbr: 'cicd2023',
    roomType: 'talk',
    roomId: 1584,
    createdAt: '2023-03-04T02:27:07.781Z',
    replyTo: null,
    messageType: 'chat',
  })

export const MockChatUser1Deleted = () =>
  deepcopy<ChatMessage>({
    id: 289,
    profileId: 1,
    speakerId: null,
    body: 'このメッセージは削除されました',
    eventAbbr: 'cicd2023',
    roomType: 'talk',
    roomId: 1584,
    createdAt: '2023-03-04T02:26:59.349Z',
    replyTo: null,
    messageType: 'qa',
  })

export const MockChatUser1Reply = () =>
  deepcopy<ChatMessage>({
    id: 343,
    profileId: 1,
    speakerId: null,
    body: 'がやがや',
    eventAbbr: 'cicd2023',
    roomType: 'talk',
    roomId: 1584,
    createdAt: '2023-03-05T04:39:46.685Z',
    replyTo: 288,
    messageType: 'chat',
  })

export const MockChatUser1ReplyIcon = () =>
  deepcopy<ChatMessage>({
    id: 344,
    profileId: 1,
    speakerId: null,
    body: '👍',
    eventAbbr: 'cicd2023',
    roomType: 'talk',
    roomId: 1584,
    createdAt: '2023-03-05T04:40:05.116Z',
    replyTo: 288,
    messageType: 'chat',
  })

export const MockChatUser1ReplyDeleted = () =>
  deepcopy<ChatMessage>({
    id: 345,
    profileId: 1,
    speakerId: null,
    body: 'このメッセージは削除されました',
    eventAbbr: 'cicd2023',
    roomType: 'talk',
    roomId: 1584,
    createdAt: '2023-03-05T04:40:13.004Z',
    replyTo: 288,
    messageType: 'chat',
  })

export const MockChatUser1Icon = () =>
  deepcopy<ChatMessage>({
    id: 346,
    profileId: 1,
    speakerId: null,
    body: '🎉',
    eventAbbr: 'cicd2023',
    roomType: 'talk',
    roomId: 1584,
    createdAt: '2023-03-05T04:40:27.030Z',
    replyTo: null,
    messageType: 'chat',
  })

export const MockChats = (() => [
  MockChatUser1(),
  MockChatUser2(),
  MockChatUser1Deleted(),
  MockChatUser1Reply(),
  MockChatUser1ReplyIcon(),
  MockChatUser1ReplyDeleted(),
  MockChatUser1Icon(),
]) as () => ChatMessage[]

export const MockDkUiData = () =>
  deepcopy<DkUiData>({
    watchedTalksOnline: {
      watchingTime: { '2101': 4080, '2102': 960, '2104': 1280 },
      prevTimestamp: 1678274562,
    },
    stampChallenges: [],
  })
