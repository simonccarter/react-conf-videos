import { FourOFourPage, FiveHundredPage } from 'components/Pages';
import React, { ComponentType } from 'react';
import { useRecoilValue } from 'recoil';
import { errorState } from 'state';

export default <P extends Record<string, unknown>>(
    Component: ComponentType<P>
  ): React.FC<P> =>
  (props) => {
    const error = useRecoilValue(errorState);

    if (!error.isError) {
      return <Component {...props} />;
    }

    if (error.statusCode >= 500 || error.statusCode === 400) {
      return <FiveHundredPage />;
    }

    if (error.statusCode >= 400 && error.statusCode < 500) {
      return <FourOFourPage />;
    }

    return <Component {...props} />;
  };
