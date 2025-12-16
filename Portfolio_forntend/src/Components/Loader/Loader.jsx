import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Loader.css";

const Loader = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.backgroundColor = "white"; // White background during transition
  }, [pathname]);

  return null;
};

export default Loader;
