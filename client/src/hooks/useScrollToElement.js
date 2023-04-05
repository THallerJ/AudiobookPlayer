import { useRef } from 'react';

const useScrollToElement = () => {
  const scrollRef = useRef(null);

  const scroll = () => {
    scrollRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return [scrollRef, scroll];
};

export default useScrollToElement;
