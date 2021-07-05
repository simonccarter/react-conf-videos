import * as React from 'react';
import VirtualList from 'react-virtual-list';

import { Video } from 'components';
import {
  ConferenceTransformed,
  VideoTransformed
} from '../../domain/TransformedJSON';

import styles from './List.scss';

type Props = {
  conferences: ConferenceTransformed[];
};

export const List: React.FC<Props> = ({ conferences }) => {
  const videos = conferences.map(conference => conference.videos).flat();
  const videosToConferencesMap = new Map()

  for(const conference of conferences) {
    for(const video of videos) {
      videosToConferencesMap.set(video.id, conference)
    }
  }

  const VirtualisedList: React.FC<{
    virtual: { items: VideoTransformed[]; style: React.CSSProperties };
  }> = ({ virtual }) => (
    <ol className={styles.root} style={virtual.style} data-cy="results-list">
      {virtual.items.map((item: VideoTransformed, index: number) => (
        <Video video={{...item, conference: videosToConferencesMap.get(item.id) }} key={index} />
      ))}
    </ol>
  );
  
  const MyVirtualList = VirtualList({
    firstItemIndex: 0,
    lastItemIndex: 20,
    initialState: {
      firstItemIndex: 0,
      lastItemIndex: 20
    }
  })(VirtualisedList);

  return (
    <>
      {videos.length > 0 && (
        <MyVirtualList items={videos} itemHeight={60} itemBuffer={20} />
      )}
    </>
  );
};
