import React from 'react'
import { connect } from 'react-redux'
import { compose, pure, withHandlers } from 'recompose'
import { frontPageActions } from 'redux/modules'
import Video from 'components/Videos/Video'
import { flatten, map, pathOr } from 'ramda'
import cn from 'classnames'

import styles from './List.scss'

const ListInner = ({
  conferences, onInputChange, filterValue, isActive
}) => {
  const children = flatten(Object.keys(conferences).map((conference) => {
    const conferenceProps = conferences[conference]
    return map(video => <Video key={video} videoId={video} conferenceId={conference} />, pathOr([], ['videos'], conferenceProps))
  }))
  const countVids = children.length
  const countVidsS = countVids === 1 ? 'video' : 'videos'
  const countConfs = Object.keys(conferences).length
  const countConfsS = countConfs === 1 ? 'conferences' : 'conferences'

  return  (
    <div className={cn(styles.root, { [`${styles.isActive}`]: isActive })}>
      <input
        type="text"
        value={filterValue}
        onChange={onInputChange}
        className={styles.input}
        placeholder="query"
        autoFocus="autofocus"
      />
      <p className={styles.resultsCount}>
        <span className={styles.resultsNumber}> {countVids} </span> {countVidsS}
        <span className={styles.resultsNumber}> {countConfs} </span> {countConfsS}
      </p>
      <section className={styles.results}>
        { true && children }
      </section>
    </div>
  )
}

const mapStateToProps = ({ frontPage }) => ({
  conferences: frontPage.filteredConferences,
  filterValue: frontPage.filterValue,
  isActive: frontPage.isActive
})

const mapDispatchToProps = {
  filter: frontPageActions.filter,
  setIsActive: frontPageActions.setIsActive,
}

const List = compose(
  connect(mapStateToProps, mapDispatchToProps),
  pure,
  withHandlers({
    onInputChange: ({ filter, setIsActive }) => (e) => {
      setIsActive(e.target.value !== '')
      filter(e.target.value)
    }
  })
)(ListInner)

export default List
