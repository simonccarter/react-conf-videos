import { mount, shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import * as React from 'react';

import { SearchInput } from './SearchInput';

describe('SearchInput', () => {
  const shallowComp = (placeholder?: string) => {
    return shallow(
      <SearchInput
        filterValue=""
        onChange={jest.fn()}
        placeholder={placeholder}
      />
    );
  };

  it('should render', () => {
    // arrange, act
    const comp = shallowComp();
    // assert
    expect(toJSON(comp)).toMatchSnapshot();
  });

  it('should set placeholder if passed', () => {
    // arrange
    const placeholder = 'test placeholder';

    // act
    const comp = shallowComp(placeholder);

    // assert
    expect(toJSON(comp)).toMatchSnapshot();
  });

  it('should dispatch correct actions on change handler call', () => {
    // arrange
    const mockFN = jest.fn();
    const value = 'search input';
    const comp = <SearchInput onChange={mockFN} filterValue="" />;

    // act
    const wrapper = mount(comp);
    wrapper.find('input').simulate('change', { target: { value } });

    // assert
    expect(mockFN).toHaveBeenCalled();
  });
});
