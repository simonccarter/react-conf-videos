import { createMockStore } from 'redux-test-utils'
import { MiddlewareAPI } from 'redux'
import { mount, shallow } from 'enzyme'
import { ReactElement } from 'react'

/** epics **/

// fails test of error cb of subcribe is called
export const onError = (done:(idx: any) => any) => (error: Error) => done(false)

// mock empty store object
export const mockStore = () => { return <MiddlewareAPI<void>>{} }

/** Components **/

// shallow mount component with props
// export const shallowWithProps = <P>(Component: ReactElement<any>, props: P) => shallow(<Component {...props} />)

// shallow mount component with a store in context
export const shallowWithStore = <T>(storeP: T, component: ReactElement<any>) => {
  const store = storeP.hasOwnProperty('isActionTypeDispatched') ? storeP : createMockStore(storeP)
  return shallow<any, any>(component, { context: { store } })
}

export const mountWithStore = <T>(storeP: T, component: ReactElement<any>) => {
  const store = storeP.hasOwnProperty('isActionTypeDispatched') ? storeP : createMockStore(storeP)
  return mount<any, any>(component, { context: { store } })
}


