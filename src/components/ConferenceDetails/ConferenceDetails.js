import React from 'react'
import styles from './ConferenceDetails.scss'

const ConferenceDetails = ({ title, date }) => (
  <section className={styles.root}>
    <h1> { title + ' ' + date } </h1>
  </section>
)

export default ConferenceDetails
