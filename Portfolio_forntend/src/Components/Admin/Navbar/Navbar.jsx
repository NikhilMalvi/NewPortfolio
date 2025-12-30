import React, { useEffect, useState } from "react";
import Light_logo from "../../../assets/Light_logo.png";
import Dark_logo from "../../../assets/Dark_logo.png";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../../context/AppContext";

const Navbar = () => {
  const [logo, setLogo] = useState(null);
  const { axios, navigate, setToken } = useAppContext();

  const [openmenu, setopenmenu] = useState(true);

  const open = () => {
    setopenmenu(!openmenu);
  };

  const close = () => {
    setopenmenu(!openmenu);
  };

  // useEffect(() => {
  //   const updateLogo = () => {
  //     setLogo(
  //       document.body.classList.contains("light-mode")
  //         ? `https://ik.imagekit.io/elnldr19u/uploads/gallery/Light_logo_eYX832kue.png`
  //         : `https://ik.imagekit.io/elnldr19u/uploads/gallery/Dark_logo_VpiM4MHQV.png`
  //     );
  //   };

  //   updateLogo();

  //   const checkbox = document.getElementById("theme-checkbox");
  //   checkbox?.addEventListener("change", updateLogo);

  //   return () => checkbox?.removeEventListener("change", updateLogo);
  // }, []);

  const logOut = () => {
    localStorage.removeItem("token");
    axios.defaults.headers.common["Authorization"] = null;
    setToken(null);
    navigate("/");
  };

  return (
    <div className="admin_navbar">
      <div className="admin_logo">
        <img
          src="https://ik.imagekit.io/elnldr19u/uploads/gallery/Light_logo_eYX832kue.png"
          alt="logo"
          onClick={() => navigate("/")}
        />
      </div>

      <div className="">
        <button className="btn" onClick={logOut}>
          LogOut
        </button>
      </div>
    </div>
  );
};

export default Navbar;
