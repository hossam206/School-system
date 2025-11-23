import { useEffect, useState } from "react";

const useMobileScreenWidth = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, [breakpoint]);
  return isMobile;
};
export default useMobileScreenWidth;
