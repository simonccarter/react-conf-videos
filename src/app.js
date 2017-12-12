import 'rxjs'
import React from 'react'
import { Provider } from 'react-redux'
import ReducerTest from 'components/ReducerTest'
// import configureStore from 'redux/configureStore'
import FrontPage from 'components/Pages/FrontPage'
import styles from './app.scss'

// const store = configureStore()

const App = () => (
  <FrontPage />
)

// export { store }
export default App
