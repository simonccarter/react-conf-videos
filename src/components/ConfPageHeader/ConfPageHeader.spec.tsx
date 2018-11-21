import * as React from 'react'

import { shallow } from 'enzyme'
import toJSON from 'enzyme-to-json'

import { ConfPageHeader } from './ConfPageHeader'

describe('ConfPageHeader', () => {
  it('should render', () => {
    // arrange
    const props = {
      title: 'React Conf 2018',
      titleLink: 'www.alink.com',
      tagline: 'a tagline'
    }
    // act
    const comp = shallow(<ConfPageHeader {...props} />)

    // assert
    expect(toJSON(comp)).toMatchSnapshot()
  })
})
