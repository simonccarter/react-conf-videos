/* tslint:disable:no-shadowed-variable */
import * as React from 'react'
import { compose, pure, withHandlers, withStateHandlers } from 'recompose'

import styles from './SearchInput.scss'

type Props = {
  filterValue: string,
  placeholder?: string,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

type WithState = { myRef: any }

type WithStateHandlers = {
  setRef: () => WithState
  blurRef: () => WithState
}

type WithHandlers = {
  onKeyUpHandlers: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

type CombinedProps = Props & WithState & WithStateHandlers & WithHandlers

export const SearchInputInner: React.SFC<CombinedProps> = ({
  filterValue, onChange, onKeyUpHandlers, setRef, placeholder = 'Search'
}) => (
  <input
    type="text"
    ref={setRef}
    value={filterValue}
    onChange={onChange}
    className={styles.root}
    placeholder={placeholder}
    onKeyUp={onKeyUpHandlers}
  />
)

// for testing
export const blurRef = ({myRef}: WithState) => () => myRef.blur()
export const onKeyUpHandlers = ({blurRef}: WithStateHandlers) => (e: React.KeyboardEvent<HTMLElement>) => {
  if (e.keyCode === 13) {
    blurRef()
  }
}

export const SearchInput = compose<CombinedProps, Props>(
  pure,
  withStateHandlers<WithState, WithStateHandlers, Props>(
    { myRef: null },
    {
      setRef: () => (ref) => ({ myRef: ref }),
      blurRef
    }
  ),
  withHandlers<WithState & WithStateHandlers, WithHandlers>({
    onKeyUpHandlers
  })
)(SearchInputInner)
