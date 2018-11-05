import { createMockStore } from 'redux-test-utils'
import { MiddlewareAPI } from 'redux'
import { mount, shallow } from 'enzyme'
import { ReactElement } from 'react'

import { Conference, IndexedConferences } from '../domain'

// fails test of error cb of subcribe is called
export const onError = (done: any) => (error: Error) => done(false)

// mock empty store object
export const mockStore = (): MiddlewareAPI<any> => createMockStore({})

const isStore = (store: any) => store.hasOwnProperty('isActionTypeDispatched')

// shallow mount component with a store in context
export const shallowWithStore = <T>(storeP: T, component: ReactElement<any>) => {
  const store = isStore(storeP) ? storeP : createMockStore(storeP)
  return shallow<any, any>(component, { context: { store } })
}

export const mountWithStore = <T>(storeP: T, component: ReactElement<any>) => {
  const store = isStore(storeP) ? storeP : createMockStore(storeP)
  return mount<any, any>(component, { context: { store } })
}

/** Mock data */
export const mockConference = (): Conference => ({
  date: 'XX/YY/ZZZ',
  title: 'fake conf title',
  website: 'fake url',
  playlist: 'day 1',
  videos: ['aaa', 'bbb', 'ccc']
})

export const mockIndexedConferences = (): IndexedConferences => ({
  ['XXXX']: mockConference()
})
