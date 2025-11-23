import { useEffect } from "react";

type UseClickOutsideProps = {
  ref: React.RefObject<HTMLElement>;
  setTarget: (value: boolean) => void;
};

const useClickOutside = ({ ref, setTarget }: UseClickOutsideProps) => {
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setTarget(false);
      }
    };
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [ref, setTarget]);
};

export default useClickOutside;

//usage is :-  useClickOutside({ ref: outNavRef, setTarget: setMobileScreen });
