import React from 'react';

import { render, waitFor, screen } from '../../utils/test';

import { Header } from './Header';

describe('Header', () => {
  it('should render props', async () => {
    // arrange
    const props = {
      title: 'A title',
      tagline: 'A tagline',
      titleLink: '/a-link',
    };

    // act
    render(<Header {...props} />);

    await waitFor(() => {
      expect(screen.getByText(props.title)).toBeInTheDocument();
      expect(screen.getByText(props.tagline)).toBeInTheDocument();
      expect(screen.getByText(props.title)).toHaveAttribute(
        'href',
        props.titleLink
      );
    });
  });
});
