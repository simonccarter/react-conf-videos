import * as React from 'react'
import { shallow } from 'enzyme'
import toJSON from 'enzyme-to-json'

import { mockConference } from 'utils'

import List from './List'

describe('List', () => {
  describe('ListInner', () => {
    it('should render', () => {
      // arrange
      const conf = mockConference()
      const props = { conferences: {'yyy': conf}, displayConferenceDetails: true }

      // act
      const wrapper = shallow(<List {...props} />)

      // assert
      expect(toJSON(wrapper)).toMatchSnapshot()
    })
  })
})