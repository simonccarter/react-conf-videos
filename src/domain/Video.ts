export type Video = {
  link: string
  title: string
  split: string
  length: string
  presenter: string // id
  embeddableLink: string
}

export type IndexedVideos = {
  [idx: string]: Video 
}

