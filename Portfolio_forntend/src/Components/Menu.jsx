import React, { useEffect, useState } from "react";
import { IoMdHome } from "react-icons/io";
import { MdGroups2, MdContactPage } from "react-icons/md";
import { FaLaptopCode } from "react-icons/fa";
import Icon from "./Icon";
import Light_logo from "../assets/Light_logo.png";
import Dark_logo from "../assets/Dark_logo.png";
import "./Menu.css";

const Menu = ({ openmenu, close }) => {
  const [logo, setLogo] = useState(null);
  const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const updateLogo = () => {
      setLogo(
        document.body.classList.contains("light-mode")
          ? `https://ik.imagekit.io/elnldr19u/uploads/gallery/Light_logo_eYX832kue.png`
          : `https://ik.imagekit.io/elnldr19u/uploads/gallery/Dark_logo_VpiM4MHQV.png`
      );
    };

    updateLogo();

    const checkbox = document.getElementById("theme-checkbox");
    checkbox?.addEventListener("change", updateLogo);

    return () => checkbox?.removeEventListener("change", updateLogo);
  }, []);

  return (
    <>
      <div
        className={
          openmenu ? "th-menu-wrapper" : "th-menu-wrapper th-menu-active"
        }
        onClick={() => {
          if (!openmenu) close();
        }}
      ></div>
      <div className={openmenu ? "header openMenu" : "header closeMenu"}>
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>

        <nav>
          <ul className="mainmenu">
            <Icon Icon={<IoMdHome />} icon_name="" Icon_title="home" />
            <Icon Icon={<MdGroups2 />} icon_name="about" Icon_title="about" />
            <Icon
              Icon={<FaLaptopCode />}
              icon_name="project"
              Icon_title="project"
            />
            <Icon
              Icon={<MdContactPage />}
              icon_name="contact"
              Icon_title="contact"
            />
          </ul>
          <div className="border-span"></div>
        </nav>
      </div>
    </>
  );
};

export default Menu;
