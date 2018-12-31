export type Video = {
  link: string
  title: string
  split: string
  length: string
  lightning?: boolean
  presenter: string // id
  embeddableLink: string
}

export type IndexedVideos = {
  [idx: string]: Video
}
