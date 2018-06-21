import * as React from 'react'
import { VideoInner } from './Video'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import { Video, Conference } from '../../domain'

describe('Video', () => {
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
    const speaker = { name: 'Simon Carter'}
    const isOpen = false
    const toggleIsOpen = mockFN

    return shallow<any>(
      <VideoInner 
        conferenceId={conferenceId}
        video={video as Video}
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
    expect(toJson(wrapper)).toMatchSnapshot();
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

