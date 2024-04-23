import { useEffect } from 'react';

export const useFetch = () => {
  useEffect(() => {
    console.debug('\nuseFetch test!');
  }, []);
};
