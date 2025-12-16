import React from "react";
import "./MainContainer.css";
import CardMain from "./CardMain";
import Card1 from "../img/card1.jpg";
import Card2 from "../img/card2.jpg";
import Card3 from "../img/card3.jpg";
import Card4 from "../img/card4.jpg";
import Card5 from "../img/card5.jpg";
import Card6 from "../img/card6.jpg";
import MainRightTop from "./MainRightTop";
import MainRightBotton from "./MainRightBotton";
import Home from "./Home/Home";
import Sidebar from "./Sidebar/Sidebar";
import About from "./About/About";
import Contact from "./Contact/Contact";
import Project from "./Projects/Project";
import Singal_post from "./Projects/Project_templeted/Singal_post";
import { Outlet, Route, Routes } from "react-router";
import Loader from "./Loader/Loader";

const MainContainer = () => {
  return (
    <>
      <div className="mainContainer">
        <div className="left">
          <Loader />
          <Outlet />
        </div>
        <div className="right">
          <Sidebar />
        </div>
      </div>
    </>
  );
};

export default MainContainer;
