import * as cn from 'classnames';
import * as React from 'react';

import { Logo } from 'components';
import { Link } from 'react-router-dom';

import styles from './Header.scss';

export const Header: React.FunctionComponent<{}> = () => (
  <div className={styles.header}>
    <Logo />
    <div className={styles.text}>
      <h1 className={styles.headerTitle}>
        <Link to="/search" className={styles.link}>
          React.js Videos
        </Link>
      </h1>
      <p className={styles.headerText}> Search React.js conference videos. </p>
      <p className={cn(styles.headerText, styles.contribute)}>
        Contribute
        <a
          className={styles.contributeLink}
          href="https://github.com/simonccarter/react-conf-videos"
          aria-label="Contribute at our github repo"
        >
          at our github repo
        </a>
        .
      </p>
    </div>
  </div>
);
