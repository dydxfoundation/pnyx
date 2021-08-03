import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useScrollToTop = ({
  ref,
}: {
  ref: React.RefObject<HTMLDivElement & HTMLButtonElement>;
}): void => {
  const { pathname } = useLocation();

  useEffect(() => {
    ref.current?.scroll({
      top: 0,
    });
  }, [pathname]);
};

export default useScrollToTop;
