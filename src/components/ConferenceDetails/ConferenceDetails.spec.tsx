import * as React from 'react'
import toJSON from 'enzyme-to-json'

import { shallow } from 'enzyme'

import { mockConference } from 'utils/test'
import { ConferenceDetails } from './ConferenceDetails'

describe('ConferenceDetails', () => {
  it('should render', () => {
    // arrange
    const props = { conference: mockConference() }

    // act
    const comp = shallow(<ConferenceDetails {...props} />)

    // assert
    expect(toJSON(comp)).toMatchSnapshot()
  })

  it('should display correct text of videos when n > 1', () => {
    // arrange
    const props = { conference: mockConference() }
    const expectedText = '3 videos'

    // act
    const comp = shallow(<ConferenceDetails {...props} />)

    // assert
    expect(comp.find('.details').childAt(1).text()).toEqual(expectedText)
  })

  it('should display correct text of videos when n = 1', () => {
    // arrange
    const props = { conference: mockConference() }
    props.conference.videos = ['aaa']
    const expectedText = '1 video'

    // act
    const comp = shallow(<ConferenceDetails {...props} />)

    // assert
    expect(comp.find('.details').childAt(1).text()).toEqual(expectedText)
  })
})
