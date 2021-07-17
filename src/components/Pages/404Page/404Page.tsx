import * as React from 'react';
import { Header, InnerLayoutContainer, Meta } from 'components';

const FourOFourPage: React.FC = () => (
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

export default FourOFourPage;
