import * as React from 'react'
import VirtualList from 'react-virtual-list'
import { mapProps } from 'recompose'
import { compose as rcompose, flatten, map, pathOr, toPairs } from 'ramda'

import { Video } from 'components'
import { Conference, IndexedConferences } from '../../domain'

import styles from './List.scss'

type Props = { conferences: {[idx: string]: Conference} }
type MapProps = { videos: any[] }

const mapConferenceIdOntoVideos = ([conferenceId, conference]: [string, Conference]) =>
  map(
    video => ({ key: video, videoId: video, conferenceId }),
    pathOr([], ['videos'], conference)
  )

const mapConferenceVideos = rcompose<IndexedConferences, any, any, any[]>(
  flatten,
  map(mapConferenceIdOntoVideos),
  toPairs
)

const VirtualisedList = ({ virtual }: {virtual: any}): any => (
  <div style={virtual.style}>
    {virtual.items && virtual.items.map((item: any) => (
      <Video {...item} />
    ))}
  </div>
)

const MyVirtualList = VirtualList({
  firstItemIndex: 0, 
  lastItemIndex: 20,
  initialState: {
    firstItemIndex: 0, 
    lastItemIndex: 20,
  }
})(VirtualisedList);

export const ListInner: React.SFC<MapProps> = ({ videos }) => {
  return (
    <section className={styles.root}> 
      {videos.length > 0 && <MyVirtualList
        items={videos}
        itemHeight={60}
        itemBuffer={20}
      /> }
    </section>
  )
}

const List = mapProps<MapProps, Props>(({conferences}) => 
  ({ videos: mapConferenceVideos(conferences)})
)(ListInner)

export default List
