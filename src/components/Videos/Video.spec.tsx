import * as React from 'react'
import { shallow } from 'enzyme'
import toJSON from 'enzyme-to-json'

import { shallowWithStore, mountWithStore } from 'utils'
import { Video, VideoInner } from './Video'
import { Video as VideoT, Conference } from '../../domain'

describe('Video', () => {
  describe('VideoInner', () => {
    const mockFN = jest.fn()

    const shallowVideo = () => {
      const video = {
        title: 'test title',
        length: '12:34',
        link: 'a link',
        embeddableLink: 'a link'
      }
      const conferenceId = 'conferenceId1234'
      const conference: Partial<Conference> = { title: 'A conference' }
      const videoId = 'videoId1234'
      const speaker = { name: 'Simon Carter' }
      const isOpen = false
      const toggleIsOpen = mockFN

      return shallow<any>(
        <VideoInner
          conferenceId={conferenceId}
          video={video as VideoT}
          videoId={videoId}
          speaker={speaker}
          isOpen={isOpen}
          toggleIsOpen={toggleIsOpen}
          conference={conference as Conference}
        />
      )
    }

    it('renders correctly', () => {
      // arrange
      const wrapper = shallowVideo()
      // act
      // assert
      expect(toJSON(wrapper)).toMatchSnapshot();
    });

    it('handles onClick', () => {
      // arrange
      const wrapper = shallowVideo()

      // act
      wrapper.find('.top').simulate('click')

      // assert
      expect(mockFN).toHaveBeenCalled()
    });
  })

  describe('Video', () => {

    const getData = () => {
      const props = { videoId: 'xxx', conferenceId: 'yyy'}
      const video = {
        title: 'test title',
        length: '12:34',
        link: 'a link',
        embeddableLink: 'a link',
        presenter: 'aaa'
      }
      const conference: Partial<Conference> = { title: 'A conference' }
      const speaker = { name: 'Simon Carter' }
      const state = {data:{
        videos: {'xxx': video},
        presenters: {'aaa': speaker},
        conferences: {'yyy' : conference}
      }}
      return { props, state, video, speaker, conference }
    }

    it('should render and connect', () => {
      // arrange
      const { props, state, video, speaker, conference } = getData()

      // act
      const wrapper = shallowWithStore(state, <Video {...props} />)

      // assert
      expect(toJSON(wrapper)).toMatchSnapshot()
      expect(wrapper.props().video).toEqual(video)
      expect(wrapper.props().conference).toEqual(conference)
      expect(wrapper.props().speaker).toEqual(speaker)
    })

    it('should toggle the isOpen state prop on click', () => {
      // arrange
      const { props, state } = getData()

      // act
      const wrapper = mountWithStore(state, <Video {...props} />)
      wrapper.find('.top').simulate('click')

      // assert
      expect(wrapper.find('.root').parent().props().isOpen).toEqual(true)
    })

  })
})


