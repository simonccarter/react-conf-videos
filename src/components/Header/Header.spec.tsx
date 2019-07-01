import { mount } from 'enzyme';
import * as React from 'react';

import { wrapWithMemoryRouter } from 'utils/test';
import { Header } from './Header';

describe('Header', () => {
  it('should render', () => {
    // arrange
    // act
    mount(
      wrapWithMemoryRouter(
        <Header title="A title" tagline="A tagline" titleLink="/a-link" />
      )
    );
  });
});
