import * as React from 'react'
import { shallow } from 'enzyme'
import toJSON from 'enzyme-to-json'

import ConferenceDetails from './ConferenceDetails'

describe('ConferenceDetails', () => {
  it('should render and display the title and date', () => {
    // arrange 
    const props = {title: 'Fake Conf Title', date: 'XX/XX/XXXX'}
    const expectedRenderString = `${props.title} ${props.date}`
    // act
    const wrapper = shallow(<ConferenceDetails {...props} />)

    // assert
    expect(toJSON(wrapper)).toMatchSnapshot()
    expect(wrapper.find('h1').text().trim()).toEqual(expectedRenderString)
  })
})