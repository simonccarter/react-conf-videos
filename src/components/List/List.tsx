import * as React from 'react'
import { connect } from 'react-redux'
import { compose, pure } from 'recompose'
import { flatten, map, pathOr } from 'ramda'

import { Conference } from '../../domain'

const { SearchInput } = require('../SearchInput')
const { Video } = require('../Videos')

import styles from './List.scss'

type WithHandlers = {
  onInputChange: (e: any) => void
}

type State = {
  conferences: {[idx: string]: Conference}
}

type CombinedProps = WithHandlers & State

const ListInner: React.SFC<CombinedProps> = ({ conferences }) => {
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
      <SearchInput x={1} />
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
