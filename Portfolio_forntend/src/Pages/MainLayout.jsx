import React, { useState } from "react";
import Menu from "../Components/Menu";
import Container from "../Components/Container";
import { Outlet } from "react-router";

const MainLayout = () => {
  const [openmenu, setopenmenu] = useState(true);

  const open = () => {
    setopenmenu(!openmenu);
  };

  const close = () => {
    setopenmenu(!openmenu);
  };
  return (
    <>
      <Menu open={open} close={close} openmenu={openmenu} />
      <Container open={open} close={close} openmenu={openmenu} />
    </>
  );
};

export default MainLayout;
