import * as React from 'react';
import { fireEvent, render, screen } from 'utils/test';

import { SearchInput } from './SearchInput';

describe('SearchInput', () => {
  it('should render', () => {
    // arrange, act
    render(<SearchInput filterValue="" onChange={jest.fn()} />);

    // assert
    expect(screen.getByLabelText('Search videos'));
  });

  it('should set placeholder if passed', () => {
    // arrange
    const placeholder = 'test placeholder';

    // act
    render(
      <SearchInput
        filterValue=""
        onChange={jest.fn()}
        placeholder={placeholder}
      />
    );

    // assert
    expect(screen.getByLabelText(`${placeholder} videos`));
  });

  it('should dispatch correct actions on change handler call', () => {
    // arrange
    const mockFN = jest.fn();

    // act
    render(<SearchInput onChange={mockFN} filterValue="" />);

    fireEvent.change(screen.getByPlaceholderText('Search'), {
      target: { value: '$23.0' }
    });

    // assert
    expect(mockFN).toHaveBeenCalled();
  });
});
