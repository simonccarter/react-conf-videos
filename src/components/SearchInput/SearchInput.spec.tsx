import * as React from 'react'
import { shallow } from 'enzyme'
import { createMockStore } from 'redux-test-utils'
import toJSON from 'enzyme-to-json'

import { shallowWithStore, mountWithStore } from 'utils'
import SearchInput, { SearchInputInner, blurRef, onKeyUpHandlers } from './SearchInput'

import { FILTER, SET_IS_ACTIVE } from '../../redux/modules/search'

describe('SearchInput', () => {
  const mockFN = jest.fn()

  const shallowComp = () => {
    return shallow<any>(
      <SearchInputInner
        filterValue=''
        onChange={mockFN}
        onKeyUpHandlers={mockFN}
        setRef={mockFN}
        myRef={null}
        blurRef={mockFN}
      />
    )
  }

  it('should render', () => {
    const comp = shallowComp()
    expect(toJSON(comp)).toMatchSnapshot()
  })

  it('should call onKeyUpHandlers on onKeyUp with keyCode 13', () => {
    const comp = shallowComp()
    comp.find('.root').simulate('keyUp', {keyCode: 13})
    expect(mockFN).toHaveBeenCalled()
  })
})

describe('SearchInput', () => {

  const comp = () => 
    <SearchInput 
      onChange={jest.fn()}
      filterValue=''
    /> 
  
  it('should render and contain connected props', () => {
    // arrange
    const isActive = false
    const filterValue = ''
    const store = {frontPage: {isActive, filterValue}}

    // act
    const wrapper = shallowWithStore(store, comp())

    // assert
    expect(toJSON(wrapper)).toMatchSnapshot()
    expect(wrapper.props().isActive).toEqual(isActive)
    expect(wrapper.props().filterValue).toEqual(filterValue)
  })

  it('should dispatch correct actions on change handler call', () => {
    // arrange
    const store = createMockStore({frontPage: {isActive: false, filterValue: ''}})
    const value = 'a search query'

    // act
    const wrapper = mountWithStore(store, comp())
    wrapper.find('input').simulate('change', {target: { value}})

    // assert
    expect(toJSON(wrapper)).toMatchSnapshot()
    expect(store.isActionTypeDispatched(FILTER)).toBe(true)
    expect(store.isActionTypeDispatched(SET_IS_ACTIVE)).toBe(true)
  })
})

describe('blueRef', () => {
  it('should call the blurRef method of the element', () => {
    // arrange
    const mockBlur = jest.fn()
    const fakeElement = {myRef: {blur: mockBlur }}

    // act 
    blurRef(fakeElement)()

    // assert
    expect(mockBlur).toHaveBeenCalledTimes(1)
  })
})

describe('onKeyUpHandlers', () => {
  it('should call blurRef when keyCode is 13', () => {
    // arrange
    const blurRef = jest.fn()
    const input = {blurRef, setRef: jest.fn()}
    const mockEvent = {keyCode: 13}

    // act 
    onKeyUpHandlers(input)(mockEvent)

    // assert
    expect(blurRef).toHaveBeenCalledTimes(1)
  })

  it('should not call blurRef when keyCode is not 13', () => {
    // arrange
    const blurRef = jest.fn()
    const input = {blurRef, setRef: jest.fn()}
    const mockEvent = {keyCode: 14}

    // act 
    onKeyUpHandlers(input)(mockEvent)

    // assert
    expect(blurRef).toHaveBeenCalledTimes(0)
  })
})