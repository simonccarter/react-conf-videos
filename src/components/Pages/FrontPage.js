import React from 'react'
import { connect } from 'react-redux'
import { compose, pure, branch, renderComponent } from 'recompose'
import cn from 'classnames'
import ReducerTest from 'components/ReducerTest'
import { List } from 'components/List'

import styles from './FrontPage.scss'

const FrontPageInner = props => (
  <main className={cn(styles.FrontPage, { [`${styles.isActive}`]: props.isActive })} >
    <div className={styles.container} >
      <div className={cn(styles.text, { [`${styles.isActive}`]: props.isActive })} >
        <h1> React conference videos </h1>
        <p> Search over most/all react conference videos that can be found online. </p>
      </div>
      <List />
    </div>
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
