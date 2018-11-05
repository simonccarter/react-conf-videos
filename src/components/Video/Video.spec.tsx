import * as React from 'react'

import { mountWithStore } from 'utils'
import { Video } from './Video'
import { Conference } from '../../domain'

import { MemoryRouter } from 'react-router'

describe.skip('Video', () => {

  const getData = () => {
    const props = { videoId: 'xxx', conferenceId: 'yyy'}
    const video = {
      link: 'a link',
      title: 'test title',
      length: '12:34',
      presenter: 'aaa',
      embeddableLink: 'a link',
    }
    const conference: Partial<Conference> = { title: 'A conference' }
    const speaker = { name: 'Simon Carter' }
    const state = {data: {
      videos: {xxx: video},
      presenters: {aaa: speaker},
      conferences: {yyy : conference}
    }}
    return { props, state, video, speaker, conference }
  }

  it('should render and connect', () => {
    // arrange
    const { props, state, video, speaker, conference } = getData()

    // act
    const wrapper = mountWithStore(state, <MemoryRouter><Video {...props} /></MemoryRouter>)

    // assert
    // expect(toJSON(wrapper)).toMatchSnapshot()
    expect(wrapper.props().video).toEqual(video)
    expect(wrapper.props().conference).toEqual(conference)
    expect(wrapper.props().speaker).toEqual(speaker)
  })

  it('should toggle the isOpen state prop on click', () => {
    // arrange
    const { props, state } = getData()

    // act
    const wrapper = mountWithStore(state, <MemoryRouter><Video {...props} /></MemoryRouter>)
    wrapper.find('.top').simulate('click')

    // assert
    expect(wrapper.find('.root').parent().props().isOpen).toEqual(true)
  })

})
