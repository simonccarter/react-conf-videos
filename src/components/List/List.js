import React from 'react'
import { connect } from 'react-redux'
import { compose, pure, withHandlers } from 'recompose'
import { frontPageActions } from 'redux/modules'
import LazyLoad from 'react-lazy-load'

import Videos from '../Videos'
import ConferenceDetails from '../ConferenceDetails'

import styles from './List.scss'

const ListInner = ({ conferences, onInputChange, filterValue }) => (
  <div className={styles.root}>
    <input type="text" value={filterValue} onChange={onInputChange} className={styles.input} />
    <p> 124 </p>
    {
      Object.keys(conferences).map((conference) => {
        const conferenceProps = conferences[conference]
        return (
          <React.Fragment key={conference}>
            <ConferenceDetails {...conferenceProps} />
            <Videos videos={conferenceProps.videos} />
          </React.Fragment>
        )
      })
    }
  </div>
)

const mapStateToProps = ({ frontPage }) => ({
  conferences: frontPage.filteredConferences,
  filterValue: frontPage.filterValue
})
const mapDispatchToProps = { filter: frontPageActions.filter }

const List = compose(
  connect(mapStateToProps, mapDispatchToProps),
  pure,
  withHandlers({
    onInputChange: ({ filter }) => e => filter(e.target.value)
  })
)(ListInner)

export default List
