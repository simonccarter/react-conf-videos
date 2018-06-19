import * as React from 'react'

const styles = require('./VideoTitle.scss')

type Props = {
  title: string
  query: string
}

const VideoTitle: React.StatelessComponent<Props> = ({ title, query }) => {
  if (!query) {  
    return (
      <span className={styles.root}>{title}</span>
    )
  }
  const regex = new RegExp(query, 'gi')
  const split = title.split(regex)
  const match = title.match(regex) // required to display correct casing
  return (
    <span className={styles.root}>
      {split[0]} 
      <i className={styles.match}>{match}</i> 
      {split[1] && split[1]}
    </span>
  )
}

export { VideoTitle }
