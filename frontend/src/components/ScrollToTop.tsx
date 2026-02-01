import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", // or "smooth" if you prefer
    });
    }

  }, [pathname]);

  return null;
}
