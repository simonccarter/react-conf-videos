import React from 'react';

import { Link } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { errorState } from 'state';

import styles from './Logo.scss';

export const Logo: React.FC = () => {
  const setErrorState = useSetRecoilState(errorState);

  return (
    <Link
      to="/search"
      className={styles.logoLink}
      aria-label="Reactjs Videos Homepage"
      onClick={() => setErrorState({ isError: false, message: '' })}
    >
      <div className={styles.logo}>RV</div>
    </Link>
  );
};
