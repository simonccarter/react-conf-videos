import * as cn from 'classnames';
import * as React from 'react';

import { Logo } from 'components';

import styles from './ConfPageHeader.scss';

type Props = {
  title: string;
  titleLink: string;
  tagline: string;
};

export const ConfPageHeader: React.FunctionComponent<Props> = ({
  title,
  titleLink,
  tagline
}) => (
  <div className={styles.header}>
    <Logo />
    <div className={styles.text}>
      <h1 className={styles.headerTitle}>
        <a href={titleLink} className={styles.link}>
          {title}
        </a>
      </h1>
      <p className={styles.headerText}> {tagline} </p>
      <p className={cn(styles.headerText, styles.contribute)}>
        Contribute
        <a
          className={styles.contributeLink}
          href="https://github.com/simonccarter/react-conf-videos"
        >
          here
        </a>
        .
      </p>
    </div>
  </div>
);
