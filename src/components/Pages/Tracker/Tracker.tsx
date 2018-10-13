import * as React from 'react'
import * as ReactGA from 'react-ga'
import * as H from 'history'

export default function withTracker(WrappedComponent: React.ComponentClass<any>, options = {}) {
  const trackPage = (page: string) => {
    // exit early if not live
    if(window.location.hostname !== 'www.reactjsvideos.com')
      return
    ReactGA.set({
      page,
      ...options
    });
    ReactGA.pageview(page);
  };

  const HOC = class extends React.Component<any> {
    componentDidMount() {
      const page = this.props.location.pathname;
      const search = this.props.location.search;
      trackPage(`${page}${search}`);
    }

    componentDidUpdate(prevProps: {location: H.Location}) {
      const prevPage = prevProps.location.pathname;
      const currentPage = this.props.location.pathname;

      const prevSearch = prevProps.location.search;
      const currentSearch = this.props.location.search;

      if (prevPage !== currentPage || prevSearch !== currentSearch) {
        trackPage(`${currentPage}${currentSearch}`);
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };

  return HOC;
}