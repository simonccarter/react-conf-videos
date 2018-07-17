import * as React from 'react'
import { shallow } from 'enzyme'
import toJSON from 'enzyme-to-json'

import { mockConference, shallowWithStore } from 'utils'
import List, { ListInner } from './List'

describe('List', () => {
  describe('ListInner', () => {
    it('should render', () => {
      // arrange
      const conf = mockConference()
      const props = { conferences: {'yyy': conf} }

      // act
      const wrapper = shallow(<ListInner {...props} />)

      // assert
      expect(toJSON(wrapper)).toMatchSnapshot()
    })
  })

  describe('List', () => {
    it('should render and connect', () => {
      // arrange
      const conf = mockConference();
      const conferences = {'yyy': conf}
      const state = { frontPage: { filteredConferences: conferences }}

      // act
      const wrapper = shallowWithStore(state, <List />)

      // assert
      expect(toJSON(wrapper)).toMatchSnapshot()
      expect(wrapper.props().conferences).toEqual(conferences)
    })
  })
})