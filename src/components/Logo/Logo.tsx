import * as React from 'react';

import { Link } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { errorState } from 'state';

import styles from './Logo.scss';

const Logo: React.FC = () => {
  const setErrorState = useSetRecoilState(errorState);

  return (
    <Link
      to="/search"
      className={styles.logoLink}
      aria-label="Reactjs Videos Homepage"
      onClick={() =>
        setErrorState({ isError: false, message: '', statusCode: 0 })
      }
    >
      <div className={styles.logo}>RV</div>
    </Link>
  );
};

export default Logo;
