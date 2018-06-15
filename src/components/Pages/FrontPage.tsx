import * as React from 'react'
import { connect } from 'react-redux'
import { compose, pure } from 'recompose'
import * as cn from 'classnames'

const List = require('../List').List

import styles from './FrontPage.scss'

type Props = { isActive: boolean }

const FrontPageInner: React.SFC<Props> = props => (
  <main className={cn(styles.FrontPage, { [`${styles.isActive}`]: props.isActive })} >
    <div className={styles.header} >
      <div className={cn(styles.text, { [`${styles.isActive}`]: props.isActive })} >
        <h1> React.js Videos</h1>
        <p> Search React.js conference videos. </p>
        <p className={styles.contribute}> Contribute <a href="https://github.com/simonccarter/react-conf-videos">here</a>.</p>
      </div>
    </div>
    <List a={1} asdasd={1}/>
  </main>
)

const mapStateToProps = (state: any) => ({
  isActive: state.frontPage.isActive
})

const FrontPage = compose<Props, void>(
  connect(mapStateToProps),
  pure
)(FrontPageInner)

export default FrontPage
