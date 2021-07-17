import * as React from 'react';
import { useRecoilState } from 'recoil';
import { queryState } from 'state';
import useDebounce from './useDebounce';

type Props = {
  setIsLoading: (idx: boolean) => void;
};

export default ({ setIsLoading }: Props) => {
  const [query, setQuery] = useRecoilState(queryState);
  const [localQuery, setLocalQuery] = React.useState(query);
  const debouncedQuery = useDebounce(localQuery);

  // debounce query input
  React.useEffect(() => {
    if (debouncedQuery || debouncedQuery === '') {
      setQuery(debouncedQuery);
    }
  }, [debouncedQuery, setQuery]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    setLocalQuery(e.target.value);
  };

  return {
    onInputChange,
  };
};
