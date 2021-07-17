import React from 'react';
import VirtualList from 'react-virtual-list';
import { useInView } from 'react-intersection-observer';

import { Video } from 'components';
import {
  ConferenceTransformed,
  VideoTransformed,
} from '../../domain/TransformedJSON';

import styles from './List.scss';

type Props = {
  conferences: ConferenceTransformed[];
  infiniteLoader?: () => void;
};

type VideoInnerProps = {
  item: VideoTransformed;
  isLast?: boolean;
  infiniteLoader?: () => void;
};

const VideoWrapper: React.FC<VideoInnerProps> = ({
  item,
  isLast,
  infiniteLoader,
}) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
  });

  if (isLast && inView) {
    infiniteLoader?.();
  }

  return <Video ref={ref} video={item} />;
};

export const List: React.FC<Props> = ({ conferences, infiniteLoader }) => {
  const videos = conferences.map((conference) => conference.videos).flat();
  const videosToConferencesMap = new Map();

  for (const conference of conferences) {
    for (const video of conference.videos) {
      videosToConferencesMap.set(video.id, conference);
    }
  }

  const VirtualisedList: React.FC<{
    virtual: { items: VideoTransformed[]; style: React.CSSProperties };
  }> = ({ virtual }) => (
    <ol className={styles.root} style={virtual.style} data-cy="results-list">
      {virtual.items.map((item: VideoTransformed, index: number) => (
        <VideoWrapper
          key={item.link}
          item={{ ...item, conference: videosToConferencesMap.get(item.id) }}
          isLast={index === virtual.items.length - 1}
          infiniteLoader={infiniteLoader}
        />
      ))}
    </ol>
  );

  const MyVirtualList = VirtualList({
    firstItemIndex: 0,
    lastItemIndex: 20,
    initialState: {
      firstItemIndex: 0,
      lastItemIndex: 20,
    },
  })(VirtualisedList);

  return (
    <>
      {videos.length > 0 && (
        <MyVirtualList items={videos} itemHeight={60} itemBuffer={20} />
      )}
    </>
  );
};
