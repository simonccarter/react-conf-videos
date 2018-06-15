import * as React from 'react'

const styles = require('./ConferenceDetails.scss')

type Props = {
  title: string
  date: string
}

const ConferenceDetails: React.SFC<Props> = ({ title, date }) => (
  <section className={styles.root}>
    <h1> { title + ' ' + date } </h1>
  </section>
)

export default ConferenceDetails
