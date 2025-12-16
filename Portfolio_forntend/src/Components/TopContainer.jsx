import React, { useEffect } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { FaBell, FaChevronDown } from "react-icons/fa";
import Women from "../img/women.jpg";
import Dark_mode from "./Dark_mode";
import Header_slider from "./Header_Slider/Header_slider";
import { RiMenuLine, RiCloseLine } from "react-icons/ri";

const TopContainer = ({ open_menu, close_menu, isOpen }) => {
  // useEffect(() => {
  //   const menuTarget = document.getElementById("menuChevron");
  //   const menuContainer = document.getElementById("menuContainer");

  //   menuTarget.addEventListener("mouseenter", () => {
  //     menuContainer.style.transform = "translateX(0px)";
  //     menuTarget.style.transform = "rotate(180deg)";
  //   });
  //   menuContainer.addEventListener("mouseleave", () => {
  //     menuContainer.style.transform = "translateX(300px)";
  //     menuTarget.style.transform = "rotate(0deg)";
  //   });
  // }, []);
  return (
    <div className="topContainer">
      <div className="inputBox">
        {/* <input type="text" placeholder="Search item, collections" />
        <i>
          <BiSearchAlt />
        </i> */}
        <Header_slider />
      </div>

      <div className="profileContainer">
        <Dark_mode />
        {/* 
        <div className="profileImage">
          <img src={Women} alt="" />
        </div> */}
        {/* <p className="profileName">Nikhil Malviya</p> */}

        {/* <i className="menuChevron" id="menuChevron">
          <FaChevronDown />
        </i>
        <div className="menuContainer" id="menuContainer">
          <ul>
            <li>Web Design</li>
            <li>UI / UX</li>
            <li>Form Design</li>
            <li>UI Design</li>
          </ul>
        </div> */}
        {isOpen ? (
          <div className="menuIcon" onClick={open_menu}>
            <RiMenuLine size={30} color="var(--prime-color)" />
          </div>
        ) : (
          <div className="closeIcon" onClick={close_menu}>
            <RiCloseLine size={30} color="var(--prime-color)" />
          </div>
        )}
      </div>
    </div>
  );
};

export default TopContainer;
