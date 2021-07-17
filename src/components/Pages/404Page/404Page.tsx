import React from 'react';
import { Header, InnerLayoutContainer, Meta } from 'components';
import useRemoveLoader from 'hooks/useRemoveLoader';

export const FourOFourPage: React.FC = () => {
  useRemoveLoader();

  return (
    <div>
      <Meta title="Page not found" />
      <Header
        title="Page not found"
        titleLink=""
        tagline="We could't find the page you were looking for"
      />
      <InnerLayoutContainer />
    </div>
  );
};
