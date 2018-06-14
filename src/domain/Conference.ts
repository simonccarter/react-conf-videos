import { Video } from './Video'

export type Conference = {
  date: string
  title: string
  website: string
  playlist: string
  videos: Video[]
}