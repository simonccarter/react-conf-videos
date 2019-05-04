import { compose as rcompose, flatten, map, pathOr, toPairs } from 'ramda';
import * as React from 'react';
import VirtualList from 'react-virtual-list';

import { Video } from 'components';
import { Conference, IndexedConferences } from '../../domain';

import styles from './List.scss';

type MappedVideo = {
  key: string;
  videoId: string;
  conferenceId: string;
};
type Props = { conferences: { [idx: string]: Conference } };

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

const VirtualisedList: React.FunctionComponent<{ virtual: any }> = ({
  virtual
}) => {
  const [open, toggleIsOpen] = React.useState<string | null>(null);
  return (
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
};

const MyVirtualList = VirtualList({
  firstItemIndex: 0,
  lastItemIndex: 20,
  initialState: {
    firstItemIndex: 0,
    lastItemIndex: 20
  }
})(VirtualisedList);

export const List: React.FunctionComponent<Props> = ({ conferences }) => {
  const videos = mapConferenceVideos(conferences);

  return (
    <section className={styles.root}>
      {videos.length > 0 && (
        <MyVirtualList items={videos} itemHeight={60} itemBuffer={20} />
      )}
    </section>
  );
};
