import { FiveHundredPage } from 'components/Pages';
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

    if (error.statusCode >= 400) {
      return <FiveHundredPage />;
    }

    return <Component {...props} />;
  };
