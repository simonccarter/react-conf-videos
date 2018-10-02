import * as React from 'react'
import * as cn from 'classnames'
import styles from './Header.scss'

import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose, withHandlers, pure } from 'recompose'
import { Logo } from 'components'
import { frontPageActions } from 'redux/modules'

type DispatchProps = {
  filter: typeof frontPageActions.filter
}

type WithHandlers = {
  onClick: (e: any) => void
}

// type CombinedProps = DispatchProps & WithHandlers

const HeaderInner: React.SFC<WithHandlers> = ({onClick}) => (
  <div className={styles.header}>
    <Logo />
    <div className={styles.text}>
      <h1 className={styles.headerTitle}>
        <Link to='/' onClick={onClick} className={styles.link}>React.js Videos</Link>
      </h1>
      <p className={styles.headerText}> Search React.js conference videos. </p>
      <p className={cn(styles.headerText, styles.contribute)}> Contribute <a className={styles.contributeLink} href="https://github.com/simonccarter/react-conf-videos">here</a>.</p>
    </div>
  </div >
)

const mapDispatchToProps = {
  filter: frontPageActions.filter,
}

const Header = compose<WithHandlers, {}>(
  connect(null, mapDispatchToProps),
  pure,
  withHandlers<DispatchProps, WithHandlers>({
    onClick: ({ filter }) => (e: any) => {
      e.preventDefault()
      filter('')
    }
  })
)(HeaderInner)

export default Header