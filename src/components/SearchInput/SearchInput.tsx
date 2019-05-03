/* tslint:disable:no-shadowed-variable */
import * as React from 'react';
import { compose, pure, withHandlers, withStateHandlers } from 'recompose';

import styles from './SearchInput.scss';

type Props = {
  filterValue: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

type WithState = { myRef: any };

type WithStateHandlers = {
  blurRef: () => WithState;
};

type WithHandlers = {
  onKeyUpHandlers: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

type CombinedProps = Props & WithState & WithStateHandlers & WithHandlers;

export const SearchInputInner: React.FunctionComponent<CombinedProps> = ({
  filterValue,
  onChange,
  onKeyUpHandlers,
  myRef,
  placeholder = 'Search'
}) => (
  <input
    type="text"
    ref={myRef}
    value={filterValue}
    onChange={onChange}
    className={styles.root}
    placeholder={placeholder}
    onKeyUp={onKeyUpHandlers}
  />
);

// for testing
export const blurRef = ({ myRef }: WithState) => () => myRef.blur();
export const onKeyUpHandlers = ({ blurRef }: WithStateHandlers) => (
  e: React.KeyboardEvent<HTMLElement>
) => {
  if (e.keyCode === 13) {
    blurRef();
  }
};

export const SearchInput = compose<CombinedProps, Props>(
  pure,
  withStateHandlers<WithState, WithStateHandlers, Props>(
    { myRef: React.createRef() },
    {
      blurRef
    }
  ),
  withHandlers<WithState & WithStateHandlers, WithHandlers>({
    onKeyUpHandlers
  })
)(SearchInputInner);
