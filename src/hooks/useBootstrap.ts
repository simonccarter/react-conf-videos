import * as React from 'react';
import { useSetRecoilState } from 'recoil';
import { loadData } from 'state/transformers';
import { listState } from '../state';

const useBootstrap = () => {
  const setList = useSetRecoilState(listState);
  React.useLayoutEffect(() => {
    const getData = async () => {
      const data = await loadData();
      setList(data);

      // remove loader from dom
      const element = document.getElementById('loader') as HTMLElement;
      element.classList.remove('fullscreen');
      setTimeout(() => {
        element.remove();
      }, 300);
    };

    getData();
  }, []);
};

export default useBootstrap;
