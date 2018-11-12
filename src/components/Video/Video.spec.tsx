import * as React from 'react'

import toJSON from 'enzyme-to-json'

import { mountWithStore, mockConference, mockVideo, wrapWithMemoryRouter } from 'utils'
import { VideoInner } from './Video'
import { Conference } from '../../domain'

describe('Video', () => {

  const getData = () => {
    const video = mockVideo()
    const conference: Conference = mockConference()
    const speaker = { name: 'Simon Carter' }
    const state = {
      data: {
        videos: {xxx: video},
        presenters: {aaa: speaker},
        conferences: {yyy : conference}
      }
    }
    const isOpen = false
    const props = { videoId: 'xxx', conferenceId: 'yyy', video, speaker, conference , isOpen, toggleIsOpen: jest.fn() }
    return { props, state }
  }

  it('should render and connect', () => {
    // arrange
    const { props, state } = getData()

    // act
    const wrapper = mountWithStore(state, wrapWithMemoryRouter(<VideoInner {...props} />))

    // assert
    expect(toJSON(wrapper)).toMatchSnapshot()
  })

  it('should toggle the isOpen state prop on click', () => {
    // arrange
    const { props, state } = getData()

    // act
    const wrapper = mountWithStore(state, wrapWithMemoryRouter(<VideoInner {...props} />))
    wrapper.find('.top').simulate('click')

    // assert
    expect(props.toggleIsOpen).toHaveBeenCalled()
  })

})
