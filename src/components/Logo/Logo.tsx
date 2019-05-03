import * as React from 'react';

import { Link } from 'react-router-dom';

import styles from './Logo.scss';

export const Logo: React.FunctionComponent<{}> = ({}) => (
  <Link
    to="/search"
    className={styles.logoLink}
    aria-label="Reactjs Videos Homepage"
  >
    <div className={styles.logo}>RV</div>
  </Link>
);
