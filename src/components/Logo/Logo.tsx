import * as React from 'react'
import { Link } from 'react-router-dom'

import styles from './Logo.scss'

const Logo: React.SFC<{}> = ({}) => (
  <div className={styles.logo}>
    <Link to="/search" className={styles.logoLink}>RV</Link>
  </div>
)

export default Logo
