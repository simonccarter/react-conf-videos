import * as React from 'react'
import * as Immutable from 'seamless-immutable'
import { Subject } from 'rxjs'
import { ReactElement } from 'react'
import { MemoryRouter } from 'react-router'
import { mount, shallow } from 'enzyme'
import { createMockStore } from 'redux-test-utils'
import { StateObservable } from 'redux-observable'

import { Conference, IndexedConferences, Video, IndexedPresenters, IndexedVideos, Presenter } from '../domain'
import { ApplicationState } from 'redux/modules';

// cast to ApplicationState so TS doesn't complain when sending in partials to Epics for testing
export const mockStore = (state = {}) => new StateObservable<ApplicationState>(new Subject(), state as ApplicationState)

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
export const mockVideo = (title = 'test title'): Video => ({
  link: 'a link',
  split: '',
  title: title || 'test title',
  length: '12:34',
  presenter: 'siomn carter',
  embeddableLink: 'a link',
})

export const mockVideos = (): IndexedVideos => ({
  aaa: mockVideo('aaa'),
  bbb: mockVideo('bbb'),
  ccc: mockVideo('ccc')
})

export const mockPresenter = (name = 'simon carter'): Presenter => ({
  name
})

export const mockPresenters = (): IndexedPresenters => ({
  xxx: mockPresenter(),
  zzz: mockPresenter('zzz')
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

export const mockRouterState = (pathname = '/conference/8424e37df85b9eccbe48e9a55d93845e/react-conf-2018') => ({
  router: {
    location: {
      pathname: '/conference/8424e37df85b9eccbe48e9a55d93845e/react-conf-2018',
      search: '',
      hash: ''
    }
  }
})

export const mockConferencePageSlice = () => ({
  conferencePage: {
    selectedConferenceId: 'XXXX',
    conference: mockConference()
  }
})

export const mockDataState = () => Immutable({
  data: {
    conferences: mockIndexedConferences(),
    presenters: mockPresenters(),
    videos: mockVideos()
  }
})
