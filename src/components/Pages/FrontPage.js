import React from 'react'
import { connect } from 'react-redux'
import { compose, pure, branch, renderComponent } from 'recompose'

import ReducerTest from 'components/ReducerTest'
import { List } from 'components/List'

import styles from './FrontPage.scss'

const FrontPageInner = () => (
  <main className={styles.FrontPage} >
    <h1> React conference videos13 </h1>
    <p> Search over most/all react conference videos that can be found online. </p>
    <List />
    <ReducerTest />
  </main>
)

const mapStateToProps = state => ({ finished: state.bootstrap.finished })

const FrontPage = compose(
  connect(mapStateToProps),
  pure,
  branch(
    ({ finished }) => !finished,
    renderComponent(() => (<div>loading in branch</div>))
  )
)(FrontPageInner)

export default FrontPage
