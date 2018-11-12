import * as React from 'react'
import { createMockStore } from 'redux-test-utils'
import { MiddlewareAPI } from 'redux'
import { mount, shallow } from 'enzyme'
import { ReactElement } from 'react'
import { MemoryRouter } from 'react-router'

import { Conference, IndexedConferences, Video } from '../domain'

// fails test of error cb of subcribe is called
export const onError = (done: any) => (error: Error) => done(false)

// mock empty store object
export const mockStore = (): MiddlewareAPI<any> => createMockStore({})

const isStore = (store: any) => store.hasOwnProperty('isActionTypeDispatched')

// shallow mount component with a store in context
export const shallowWithStore = (storeP: any, component: ReactElement<{}>) => {
  const store = isStore(storeP) ? storeP : createMockStore(storeP)
  return shallow<any, any>(component, { context: { store } })
}

export const mountWithStore = (storeP: any, component: ReactElement<{}>) => {
  const store = isStore(storeP) ? storeP : createMockStore(storeP)
  return mount<any, any>(component, { context: { store } })
}

export const wrapWithMemoryRouter = (Component: React.ReactElement<any>) => (
  // key within location prop keeps changing, so manually set
  // so snapshorts are consistent
  <MemoryRouter initialEntries={[{key: 'xxxx'}]} >
    {Component}
  </MemoryRouter>
)

/** Mock data */
export const mockVideo = (): Video => ({
  link: 'a link',
  split: '',
  title: 'test title',
  length: '12:34',
  presenter: 'aaa',
  embeddableLink: 'a link',
})

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
