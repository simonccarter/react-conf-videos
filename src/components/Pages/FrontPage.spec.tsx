import * as React from 'react'
import { shallow } from 'enzyme'
import { shallowWithStore } from 'utils'
import FrontPage, { FrontPageInner } from './FrontPage'
import toJson from 'enzyme-to-json'

describe('FrontPage', () => {
  describe('FrontPageInner', () => {

    const shallowComp = (isActive: boolean) => shallow<any>(<FrontPageInner isActive={isActive} />)

    it('should render', () => {
      // arrange
      // act
      const wrapper = shallowComp(true)

      // expect
      expect(toJson(wrapper)).toMatchSnapshot()
    })

    it('should add the correct classes if isActive is true', () => {
      // arrange
      // act
      const wrapper = shallowComp(true)

      expect(wrapper.find('.frontPage.isActive').length).toBe(1)
      expect(wrapper.find('.text.isActive').length).toBe(1)
    })

    it('should not have the isActive classes if isActive is false', () => {
      // arrange
      // act
      const wrapper = shallowComp(false)

      // assert
      expect(wrapper.find('.frontPage.isActive').length).toBe(0)
      expect(wrapper.find('.text.isActive').length).toBe(0)
    })
  })

  describe('FrontPage', () => {
    it('should render', () => {
      // arrange
      const store = {frontPage: {isActive: false}}

      // act
      const wrapper = shallowWithStore(store, <FrontPage />)

      // assert
      expect(toJson(wrapper)).toMatchSnapshot()
    })

    it('should connect to the store and get the isActive prop', () => {
      // arrange
      const isActive = false
      const store = {frontPage: {isActive}}

      // act
      const wrapper = shallowWithStore(store, <FrontPage />)

      // assert
      expect(wrapper.props().isActive).toBe(false)
      expect(wrapper.props().isActive).toEqual(isActive)
    })
  })
})