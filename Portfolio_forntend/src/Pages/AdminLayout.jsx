import React from "react";
import { Outlet } from "react-router";
import AdminSideBar from "../Components/Admin/AdminSideBar/AdminSideBar";
import Navbar from "../Components/Admin/Navbar/Navbar";

const AdminLayout = () => {
  return (
    <div style={{ width: "100%" }}>
      <Navbar />
      <div className="adminLayout">
        <AdminSideBar />
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
