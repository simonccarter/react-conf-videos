import * as React from 'react'
import * as cn from 'classnames'
import styles from './Header.scss'

import { Link } from 'react-router-dom'
import { Logo } from 'components'

export const Header: React.SFC<{}> = () => (
  <div className={styles.header}>
    <Logo />
    <div className={styles.text}>
      <h1 className={styles.headerTitle}>
        <Link to="/search" className={styles.link}>React.js Videos</Link>
      </h1>
      <p className={styles.headerText}> Search React.js conference videos. </p>
      <p className={cn(styles.headerText, styles.contribute)}>
        Contribute
        <a className={styles.contributeLink} href="https://github.com/simonccarter/react-conf-videos">here</a>
      .</p>
    </div>
  </div >
)
