import React from 'react';

import styles from './ResultDetails.scss';

type Props = { numberOfVideos: number; numberOfConferences: number };

export const ResultDetails: React.FunctionComponent<Props> = ({
  numberOfVideos,
  numberOfConferences,
}) => (
  <p className={styles.resultsCount}>
    <strong> {numberOfVideos} </strong>{' '}
    {numberOfVideos === 1 ? 'video' : 'videos'}
    <strong> {numberOfConferences} </strong>{' '}
    {numberOfConferences === 1 ? 'conference' : 'conferences'}
  </p>
);
