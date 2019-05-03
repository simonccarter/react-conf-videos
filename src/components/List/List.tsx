import { compose as rcompose, flatten, map, pathOr, toPairs } from 'ramda';
import * as React from 'react';
import VirtualList from 'react-virtual-list';
import { compose, mapProps, withStateHandlers } from 'recompose';

import { Video } from 'components';
import { Conference, IndexedConferences } from '../../domain';

import styles from './List.scss';

type MappedVideo = {
  key: string;
  videoId: string;
  conferenceId: string;
};

type Props = { conferences: { [idx: string]: Conference } };
type MapProps = { videos: MappedVideo[] };
type State = { open: string | null };
type StateHandlers = {
  toggleIsOpen: (open: string | null) => State;
};

type CombinedProps = MapProps & State & StateHandlers;

const mapConferenceIdOntoVideos = ([conferenceId, conference]: [
  string,
  Conference
]) =>
  map(
    video => ({ key: video, videoId: video, conferenceId }),
    pathOr([], ['videos'], conference)
  );

const mapConferenceVideos = rcompose<
  IndexedConferences,
  any,
  any[],
  MappedVideo[]
>(flatten, map(mapConferenceIdOntoVideos), toPairs);

const VirtualisedList: React.FunctionComponent<
  { virtual: any } & CombinedProps
> = ({ virtual, open, toggleIsOpen }) => (
  <div style={virtual.style}>
    {virtual.items &&
      virtual.items.map((item: MappedVideo, index: number) => (
        <Video
          key={index}
          {...item}
          isOpen={item.videoId === open}
          toggleIsOpen={toggleIsOpen}
        />
      ))}
  </div>
);

const MyVirtualList = VirtualList({
  firstItemIndex: 0,
  lastItemIndex: 20,
  initialState: {
    firstItemIndex: 0,
    lastItemIndex: 20
  }
})(VirtualisedList);

export const ListInner: React.FunctionComponent<CombinedProps> = ({
  videos,
  open,
  toggleIsOpen
}) => {
  return (
    <section className={styles.root}>
      {videos.length > 0 && (
        <MyVirtualList
          items={videos}
          itemHeight={60}
          itemBuffer={20}
          open={open}
          toggleIsOpen={toggleIsOpen}
        />
      )}
    </section>
  );
};

export const List = compose<CombinedProps, Props>(
  mapProps<MapProps, Props>(({ conferences }) => ({
    videos: mapConferenceVideos(conferences)
  })),
  withStateHandlers<State, StateHandlers>(
    { open: null },
    {
      toggleIsOpen: () => videoId => {
        return { open: videoId };
      }
    }
  )
)(ListInner);
