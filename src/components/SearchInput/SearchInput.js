import React from 'react'
import { connect } from 'react-redux'
import { compose, withHandlers, withStateHandlers, pure } from 'recompose'
import { frontPageActions } from 'redux/modules'

import styles from './SearchInput.scss'

const mapStateToProps = ({ frontPage }) => ({
  conferences: frontPage.filteredConferences,
  filterValue: frontPage.filterValue,
  isActive: frontPage.isActive
})

const mapDispatchToProps = {
  filter: frontPageActions.filter,
  setIsActive: frontPageActions.setIsActive,
}

export const SearchInput = compose(
  connect(mapStateToProps, mapDispatchToProps),
  pure,
  withStateHandlers(
    { ref: null },
    {
      setRef: () => ref => ({ ref }),
      blurRef: ({ ref }) => () => ref.blur()
    }
  ),
  withHandlers({
    onKeyUpHandlers: ({ blurRef }) => (e) => {
      if (e.keyCode === 13 || e.charCode === 13) {
        blurRef()
      }
    },
    onInputChange: ({ filter, setIsActive }) => (e) => {
      setIsActive(e.target.value !== '')
      filter(e.target.value)
    }
  })
)(
  ({
    filterValue, onInputChange, onKeyUpHandlers, setRef
  }) => (
    <input
      type="text"
      ref={setRef}
      value={filterValue}
      onChange={onInputChange}
      className={styles.root}
      placeholder="Search"
      onKeyUp={onKeyUpHandlers}
    />
  )
)
