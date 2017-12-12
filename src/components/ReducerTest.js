import React from 'react'

import { connect } from 'react-redux'
import { compose, pure } from 'recompose'
import { ping } from 'redux/modules/ping'

const ReducerTestInner = ({ ping, isPinging }) => (
  <section>
    <button onClick={ping}> ping </button>
    <p>{`${isPinging}`}</p>
  </section>
)

const mapStateToProps = ({ ping: { isPinging } }) => ({ isPinging })
const mapDispatchToProps = ({ ping })

const ReducerTest = compose(
  connect(mapStateToProps, mapDispatchToProps),
  pure
)(ReducerTestInner)

export default ReducerTest
