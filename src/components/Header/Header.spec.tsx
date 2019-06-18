import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import * as React from 'react';

import { wrapWithMemoryRouter } from 'utils/test';
import { Header } from './Header';

describe('Header', () => {
  it('should render', () => {
    // arrange
    // act
    const comp = mount(
      wrapWithMemoryRouter(
        <Header title="A title" tagline="A tagline" titleLink="/a-link" />
      )
    );

    // assert
    expect(toJSON(comp)).toMatchSnapshot();
  });
});
