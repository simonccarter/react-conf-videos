import * as React from 'react'

import styles from './ConferenceDetails.scss'

type Props = {
  title: string
  date: string
}

const ConferenceDetails: React.SFC<Props> = ({ title, date }) => (
  <section className={styles.root}>
    <h2 className={styles.details}> { title + ' ' + date } </h2>
  </section>
)

export default ConferenceDetails
