import * as React from 'react';
import { withRouter } from 'react-router';

// https://reacttraining.com/react-router/web/guides/scroll-restoration
class ScrollToTopInner extends React.Component<{ location: Location }> {
  public componentDidUpdate(prevProps: { location: Location }) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  public render() {
    return this.props.children;
  }
}

export const ScrollToTop = withRouter<any>(ScrollToTopInner);
