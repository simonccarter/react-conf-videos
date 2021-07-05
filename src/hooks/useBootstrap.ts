import * as React from 'react';
import { useSetRecoilState } from 'recoil';
import { getList } from '../services/web';
import { listState } from '../state';

const useBootstrap = () => {
  const setList = useSetRecoilState(listState);
  React.useLayoutEffect(() => {
    const getData = async () => {
      const data = await getList({start: 0})
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
