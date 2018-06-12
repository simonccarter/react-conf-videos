import React from 'react'
import { connect } from 'react-redux'
import { compose, pure } from 'recompose'
import cn from 'classnames'
import { List } from 'components/List'

import styles from './FrontPage.scss'

const FrontPageInner = props => (
  <main className={cn(styles.FrontPage, { [`${styles.isActive}`]: props.isActive })} >
    <div className={styles.header} >
      <div className={cn(styles.text, { [`${styles.isActive}`]: props.isActive })} >
        <h1> React.js Videos CircleCi Test</h1>
        <p> Search React.js conference videos. </p>
        <p className={styles.contribute}> Contribute <a href="https://github.com/simonccarter/react-conf-videos">here</a>.</p>
      </div>
    </div>
    <List />
  </main>
)

const mapStateToProps = state => ({
  isActive: state.frontPage.isActive
})

const FrontPage = compose(
  connect(mapStateToProps),
  pure
)(FrontPageInner)

export default FrontPage
