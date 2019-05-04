import * as React from 'react';

import { compose, flatten, pluck, values } from 'ramda';

import { IndexedConferences } from '../../domain';

import styles from './ResultDetails.scss';

type Props = { conferences: IndexedConferences };

const getAllVideos = compose<any, any, any, string[]>(
  flatten,
  values,
  pluck('videos')
);

export const computeResultDetails = (conferences: IndexedConferences) => {
  const confKeys = Object.keys(conferences);
  const videos = getAllVideos(conferences);
  return {
    countVids: videos.length,
    countVidsS: videos.length === 1 ? 'video' : 'videos',
    countConfs: confKeys.length,
    countConfsS: confKeys.length === 1 ? 'conference' : 'conferences'
  };
};

export const ResultDetails: React.FunctionComponent<Props> = ({
  conferences
}) => {
  const {
    countVids,
    countConfs,
    countVidsS,
    countConfsS
  } = computeResultDetails(conferences);
  return (
    <p className={styles.resultsCount}>
      <span className={styles.resultsNumber}> {countVids} </span> {countVidsS}
      <span className={styles.resultsNumber}> {countConfs} </span> {countConfsS}
    </p>
  );
};
