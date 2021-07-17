import React from 'react';

export default () => {
  // remove page loader
  React.useEffect(() => {
    // remove loader from dom
    const element = document.getElementById('loader') as HTMLElement;
    if (element) {
      element.classList.remove('fullscreen');
      setTimeout(() => {
        element.remove();
      }, 300);
    }
  }, []);
};
