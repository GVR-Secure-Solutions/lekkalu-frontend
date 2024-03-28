export type ComparisonsType = {
  name: string
  uid: number
  access: 'private' | 'public'
  scenarios: number[]
  created_at: string
}

export type ScenarioType = {
  name: string
  userName: string
  id: number
  password: string
  created_at?: string
}

export const comparisons: Array<ComparisonsType> = [
  {
    name: 'Comparison 1',
    uid: 5,
    access: 'private',
    scenarios: [1, 3, 4],
    created_at: '2024-01-12T17:14:29.959667+05:30',
  },
  {
    name: 'This is another comparison',
    uid: 12,
    access: 'public',
    scenarios: [1],
    created_at: '2024-02-08T17:14:29.959667+05:30',
  },
  {
    name: 'World is under fire, run bro run.',
    uid: 51,
    access: 'private',
    scenarios: [1, 2, 3, 4],
    created_at: '2023-02-12T17:14:29.959667+05:30',
  },
  {
    name: 'Jcole is better than kendrick and drake combined, come at me.',
    uid: 55,
    access: 'public',
    scenarios: [1, 2],
    created_at: '2022-09-12T17:14:29.959667+05:30',
  },
]
export const scenarios: Array<ScenarioType> = [
  {
    id: 1,
    name: 'Want to invest with current salary',
    userName: 'Reacter',
    password: 'whyshouldbepasswordsent',
  },
  {
    id: 2,
    name: 'I have mortgage, should i invest?',
    userName: 'Reacter',
    password: 'whyshouldbepasswordsent',
  },
  {
    id: 3,
    name: 'Important investment, could lose everything i ever owned.',
    userName: 'Reacter',
    password: 'whyshouldbepasswordsent',
  },
  {
    id: 4,
    name: 'Nothing to lose, suggest how should i invest my money.',
    userName: 'Reacter',
    password: 'whyshouldbepasswordsent',
  },
  {
    id: 198,
    name: 'Echoes of the Forgotten in mist',
    userName: 'Reacter',
    password: 'whyshouldbepasswordsent',
  },
  {
    id: 221,
    name: 'Whispers in the Mist and was forgotten and should go in other lines',
    userName: 'Reacter',
    password: 'whyshouldbepasswordsent',
  },
  {
    id: 33,
    name: 'The Shadow of Tomorrow and Yesterday.',
    userName: 'Reacter',
    password: 'whyshouldbepasswordsent',
  },
  {
    id: 44,
    name: 'Nobody escapes beyond the Horizon',
    userName: 'Reacter',
    password: 'whyshouldbepasswordsent',
  },
  {
    id: 1335,
    name: 'Chronicles of the Unknown.',
    userName: 'Reacter',
    password: 'whyshouldbepasswordsent',
  },
  {
    id: 6522,
    name: 'Lost in Translation, so learn the language.',
    userName: 'Reacter',
    password: 'whyshouldbepasswordsent',
  },
  {
    id: 4324323,
    name: 'Eternal Twilight and a Delightful Morning',
    userName: 'Reacter',
    password: 'whyshouldbepasswordsent',
  },
  {
    id: 3244,
    name: 'Sands of Time, Lapsed to a new chapter',
    userName: 'Reacter',
    password: 'whyshouldbepasswordsent',
  },
  {
    id: 193328,
    name: 'The Last Voyage into the city of unknown.',
    userName: 'Reacter',
    password: 'whyshouldbepasswordsent',
  },
  {
    id: 22871,
    name: 'Threads of Fate, will the impossible happen?',
    userName: 'Reacter',
    password: 'whyshouldbepasswordsent',
  },
  {
    id: 3323,
    name: 'Whirlwind of Destiny, dont underestimate the probability.',
    userName: 'Reacter',
    password: 'whyshouldbepasswordsent',
  },
  {
    id: 444,
    name: 'Journey to the Abyss, when the capital fell, it took the king.',
    userName: 'Reacter',
    password: 'whyshouldbepasswordsent',
  },
]
