import React from "react";
import "./Container.css";
import TopContainer from "./TopContainer";
import MainContainer from "./MainContainer";
import { Route, Routes } from "react-router";
// import Layout from "../Admin/LayOut";
// import Home from "./Home/Home";

const Container = ({ open, close, openmenu }) => {
  const open_menu = open;
  const close_menu = close;
  const isOpen = openmenu;
  return (
    <div
      className="container"
      onClick={() => {
        if (!isOpen) close_menu();
      }}
    >
      <TopContainer
        open_menu={open_menu}
        close_menu={close_menu}
        isOpen={isOpen}
      />
      <MainContainer />
    </div>
  );
};

export default Container;
