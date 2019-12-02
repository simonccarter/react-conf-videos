import * as React from 'react';

import styles from './SearchInput.scss';

type Props = {
  filterValue: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const SearchInput: React.FunctionComponent<Props> = React.memo(
  ({ filterValue, onChange, placeholder = 'Search' }) => (
    <input
      type="text"
      value={filterValue}
      onChange={onChange}
      className={styles.root}
      placeholder={placeholder}
      aria-label={placeholder + ` videos`}
      data-cy="search-input"
    />
  )
);
