import React from 'react'
import styles from './VideoTitle.scss'

const VideoTitle = ({ title, query }) => {
  if (!query)
    return <span className={styles.root}>{title}</span>
  const regex = new RegExp(query, 'gi')
  const split = title.split(regex)
  const match = title.match(regex) // required to display correct casing
  return (
    <span className={styles.root}>{split[0]} <i className={styles.match}>{match}</i> {split[1] && split[1]}</span>
  )
}

export { VideoTitle }
