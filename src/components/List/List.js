import * as React from 'react'
import { connect } from 'react-redux'
import { flatten, map, pathOr } from 'ramda'
import { compose, pure, withHandlers } from 'recompose'

import { Conference } from '../../domain'
import { SearchInput } from '../SearchInput'
import { Video } from '../Videos/Video.tsx'

import styles from './List.scss'

// type Props = {
//   filter: any
//   setIsActive: any
// }

// type WithHandlers = {
//   onInputChange: (e: any) => void
// }

// type State = {
//   conferences: {[idx: string]: Conference}
// }

// type CombinedProps = Props & WithHandlers & State

const ListInner = ({ conferences }) => {
  const children = flatten(Object.keys(conferences).map((conferenceId) => {
    const conferenceProps = conferences[conferenceId]
    return map(video => <Video key={video} videoId={video} conferenceId={conferenceId} />, pathOr([], ['videos'], conferenceProps))
  }))
  const countVids = children.length
  const countVidsS = countVids === 1 ? 'video' : 'videos'
  const countConfs = Object.keys(conferences).length
  const countConfsS = countConfs === 1 ? 'conference' : 'conferences'

  return  (
    <div className={styles.root}>
      <SearchInput />
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
})

const List = compose(
  connect(mapStateToProps),
  pure,
  withHandlers({
    onInputChange: ({ filter, setIsActive }) => (e) => {
      setIsActive(e.target.value !== '')
      filter(e.target.value)
    }
  })
)(ListInner)

export default List
