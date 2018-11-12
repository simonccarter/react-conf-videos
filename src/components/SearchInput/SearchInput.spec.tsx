import * as React from 'react'
import { shallow, mount } from 'enzyme'
import toJSON from 'enzyme-to-json'

import SearchInput, { SearchInputInner, blurRef, onKeyUpHandlers } from './SearchInput'

describe('SearchInputInner', () => {

  const shallowComp = (mockFN = jest.fn(), placeholder?: string) => {
    return shallow(
      <SearchInputInner
        filterValue=""
        onChange={jest.fn()}
        onKeyUpHandlers={mockFN}
        setRef={jest.fn()}
        myRef={null}
        blurRef={jest.fn()}
        placeholder={placeholder}
      />
    )
  }

  it('should render', () => {
    // arrange, act
    const comp = shallowComp()
    // assert
    expect(toJSON(comp)).toMatchSnapshot()
  })

  it('should call onKeyUpHandlers on onKeyUp with keyCode 13', () => {
    // arrange
    const mockFN = jest.fn()
    const comp = shallowComp(mockFN)

    // act
    comp.find('.root').simulate('keyUp', {keyCode: 13})

    // assert
    expect(mockFN).toHaveBeenCalled()
  })

  it('should set placeholder if passed', () => {
    // arrange
    const mockFN = jest.fn()
    const placeholder = 'test placeholder'

    // act
    const comp = shallowComp(mockFN, placeholder)

    // assert
    expect(toJSON(comp)).toMatchSnapshot()
  })
})

describe('SearchInput', () => {

  it('should render and contain connected props', () => {
    // arrange
    const mockFN = jest.fn()
    const comp = <SearchInput onChange={mockFN} filterValue="" />

    // act
    const wrapper = shallow(comp)

    // assert
    expect(toJSON(wrapper)).toMatchSnapshot()
    expect(wrapper.props().filterValue).toEqual('')
  })

  it('should dispatch correct actions on change handler call', () => {
    // arrange
    const mockFN = jest.fn()
    const value = 'search input'
    const comp = <SearchInput onChange={mockFN} filterValue="" />

    // act
    const wrapper = mount(comp)
    wrapper.find('input').simulate('change', {target: { value }})

    // assert
    expect(mockFN).toHaveBeenCalled()
  })
})

describe('blueRef', () => {
  it('should call the blurRef method of the element', () => {
    // arrange
    const mockBlur = jest.fn()
    const fakeElement = {myRef: {blur: mockBlur}}

    // act
    blurRef(fakeElement)()

    // assert
    expect(mockBlur).toHaveBeenCalledTimes(1)
  })
})

describe('onKeyUpHandlers', () => {
  it('should call blurRef when keyCode is 13', () => {
    // arrange
    // tslint:disable-next-line
    const blurRef = jest.fn()
    const input = {blurRef, setRef: jest.fn()}
    const mockEvent = {keyCode: 13} as React.KeyboardEvent<HTMLInputElement>

    // act
    onKeyUpHandlers(input)(mockEvent)

    // assert
    expect(blurRef).toHaveBeenCalledTimes(1)
  })

  it('should not call blurRef when keyCode is not 13', () => {
    // arrange
    // tslint:disable-next-line
    const blurRef = jest.fn()
    const input = {blurRef, setRef: jest.fn()}
    const mockEvent = {keyCode: 14} as React.KeyboardEvent<HTMLInputElement>

    // act
    onKeyUpHandlers(input)(mockEvent)

    // assert
    expect(blurRef).toHaveBeenCalledTimes(0)
  })
})
