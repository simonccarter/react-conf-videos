import * as React from 'react'

import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose, withHandlers, pure } from 'recompose'

import { frontPageActions } from 'redux/modules'

import styles from './Logo.scss'

type DispatchProps = {
  filter: typeof frontPageActions.filter
}

type WithHandlers = {
  onClick: (e: any) => void
}

type CombinedProps = DispatchProps & WithHandlers

const LogoInner: React.SFC<CombinedProps> = ({onClick}) => (
  <div className={styles.logo}>
    <Link to="/" onClick={onClick} className={styles.logoLink}>RV</Link>
  </div>
)

const mapDispatchToProps = {
  filter: frontPageActions.filter
}

const Logo = compose<CombinedProps, {}>(
  connect(null, mapDispatchToProps),
  pure,
  withHandlers<DispatchProps, WithHandlers>({
    onClick: ({ filter }) => (e: any) => {
      e.preventDefault()
      filter('')
    }
  })
)(LogoInner)

export default Logo