import * as React from 'react'
import toJSON from 'enzyme-to-json'
import { mount } from 'enzyme'

import { ResultDetails } from './ResultDetails'
import { mockIndexedConferences } from 'utils'

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
