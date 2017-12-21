import React from 'react'
import { connect } from 'react-redux'
import { compose, pure, branch, renderComponent } from 'recompose'
import cn from 'classnames'
import ReducerTest from 'components/ReducerTest'
import { List } from 'components/List'

import styles from './FrontPage.scss'

const FrontPageInner = props => (
  <main className={cn(styles.FrontPage, { [`${styles.isActive}`]: props.isActive })} >
    <div className={styles.header} >
      <div className={cn(styles.text, { [`${styles.isActive}`]: props.isActive })} >
        <h1> React Videos </h1>
        <p> Search React.js conference videos. </p>
      </div>
    </div>
    <List />
  </main>
)

const mapStateToProps = state => ({
  finished: state.bootstrap.finished,
  isActive: state.frontPage.isActive
})

const FrontPage = compose(
  connect(mapStateToProps),
  pure,
  branch(
    ({ finished }) => !finished,
    renderComponent(() => (<div>loading in branch</div>))
  ),
)(FrontPageInner)

export default FrontPage
