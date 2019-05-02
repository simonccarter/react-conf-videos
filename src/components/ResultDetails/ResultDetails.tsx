import * as React from 'react';

import { compose, flatten, pluck, values } from 'ramda';
import { mapProps } from 'recompose';

import { IndexedConferences } from '../../domain';

import styles from './ResultDetails.scss';

type Props = { conferences: IndexedConferences };
type MappedProps = {
  countVids: number;
  countConfs: number;
  countVidsS: string;
  countConfsS: string;
};

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

const ResultDetailsInner: React.FunctionComponent<MappedProps> = ({
  countVids,
  countConfs,
  countVidsS,
  countConfsS
}) => (
  <p className={styles.resultsCount}>
    <span className={styles.resultsNumber}> {countVids} </span> {countVidsS}
    <span className={styles.resultsNumber}> {countConfs} </span> {countConfsS}
  </p>
);

export const ResultDetails = mapProps<MappedProps, Props>(({ conferences }) => {
  return {
    ...computeResultDetails(conferences)
  };
})(ResultDetailsInner);
