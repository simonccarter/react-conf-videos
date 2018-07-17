import * as React from 'react'
import { connect } from 'react-redux'
import { compose, pure } from 'recompose'
import { flatten, map, pathOr } from 'ramda'

import { SearchInput } from 'components/SearchInput'
import { Video } from 'components/Videos'

import styles from './List.scss'

import { Conference } from '../../domain'

type State = {
  conferences: {[idx: string]: Conference}
}

type CombinedProps = State

export const ListInner: React.SFC<State> = ({ conferences }) => {
  const children = flatten(Object.keys(conferences).map((conferenceId) => {
    const conferenceProps = conferences[conferenceId]
    return map(
      (video: any) => {return (<Video key={video} videoId={video} conferenceId={conferenceId} />)}, 
      pathOr([], ['videos'], conferenceProps)
    )
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

const mapStateToProps = ({ frontPage }: any) => ({
  conferences: frontPage.filteredConferences,
})

const List = compose<CombinedProps, {}>(
  connect(mapStateToProps),
  pure
)(ListInner)

export default List
