import * as React from 'react'
import { mapProps } from 'recompose'
import { compose as rcompose, flatten, map, pathOr, toPairs } from 'ramda'

import { Video } from 'components'
import { Conference, IndexedConferences } from '../../domain'

import styles from './List.scss'

type Props = { conferences: {[idx: string]: Conference} }
type MapProps = { videos: any[] }

const mapConferenceIdOntoVideos = ([conferenceId, conference]: [string, Conference]) =>
  map(
    (video => (<Video key={video} videoId={video} conferenceId={conferenceId} />)), 
    pathOr([], ['videos'], conference)
  )

const mapConferenceVideos = rcompose<IndexedConferences, any, any, any[]>(
  flatten,
  map(mapConferenceIdOntoVideos),
  toPairs
)

export const ListInner: React.SFC<MapProps> = ({ videos }) => {
  return (
    <section className={styles.root}> 
      { videos }
    </section>
  )
}

const List = mapProps<MapProps, Props>(({conferences}) => 
  ({ videos: mapConferenceVideos(conferences)})
)(ListInner)

export default List
