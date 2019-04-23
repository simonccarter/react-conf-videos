import { mount } from 'enzyme'
import toJSON from 'enzyme-to-json'
import * as React from 'react'

import { mockIndexedConferences } from 'utils/test'
import { ResultDetails } from './ResultDetails'

describe('ResultDetails', () => {
  it('should render', () => {
    // arrange
    const props = {
      conferences: mockIndexedConferences()
    }

    // act
    const comp = mount(<ResultDetails {...props} />)

    // assert
    expect(toJSON(comp)).toMatchSnapshot()
  })
})
