import React, { useEffect } from 'react';

const useOnClickOutside = ({
  onClickOutside,
  ref,
  dependencies = [],
}: {
  onClickOutside: (event: MouseEvent) => void;
  ref: React.RefObject<HTMLDivElement & HTMLButtonElement>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dependencies?: any[];
}) => {
  useEffect(() => {
    const handleClickOutside: (event: MouseEvent) => void = (e) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClickOutside(e);
      }
    };

    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, dependencies);
};

export default useOnClickOutside;
