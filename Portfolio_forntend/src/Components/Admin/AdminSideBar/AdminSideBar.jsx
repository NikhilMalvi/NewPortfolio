import React, { useState } from "react";
import "./AdminSideBar.css";
import { NavLink } from "react-router-dom";
import { IoChevronDown, IoChevronForward } from "react-icons/io5";

const AdminSideBar = () => {
  const [projectMenu, setProjectMenu] = useState(false);
  const [techStackMenu, settechStack] = useState(false);

  return (
    <aside className="AdminSideBar">
      <div className="Navigation">
        <NavLink
          to="/admin/"
          className={({ isActive }) =>
            `admin_nav ${isActive ? "active_nav" : ""}`
          }
        >
          Dashboard
        </NavLink>

        {/* HOME */}
        <NavLink
          to="/admin/home"
          className={({ isActive }) =>
            `admin_nav ${isActive ? "active_nav" : ""}`
          }
        >
          Home
        </NavLink>

        {/* ABOUT */}
        <NavLink
          to="/admin/about"
          className={({ isActive }) =>
            `admin_nav ${isActive ? "active_nav" : ""}`
          }
        >
          About
        </NavLink>

        {/* PROJECT DROPDOWN */}
        <div
          className={`admin_nav dropdown_header`}
          onClick={() => setProjectMenu(!projectMenu)}
        >
          <span>Projects</span>
          {projectMenu ? (
            <IoChevronDown size={18} />
          ) : (
            <IoChevronForward size={18} />
          )}
        </div>

        <div className={`dropdown ${projectMenu ? "open" : ""}`}>
          <NavLink to="/admin/add-project" className="projectMenu">
            Add Project
          </NavLink>
          <NavLink to="/admin/all-project" className="projectMenu">
            All Projects
          </NavLink>
          <NavLink to="/admin/add-skill" className="projectMenu">
            Add New Skill
          </NavLink>
          <NavLink to="/admin/all-skill" className="projectMenu">
            All Skill
          </NavLink>
        </div>

        {/* PROJECT DROPDOWN */}
        <div
          className={`admin_nav dropdown_header`}
          onClick={() => settechStack(!techStackMenu)}
        >
          <span>Technology</span>
          {projectMenu ? (
            <IoChevronDown size={18} />
          ) : (
            <IoChevronForward size={18} />
          )}
        </div>

        <div className={`dropdown ${techStackMenu ? "open" : ""}`}>
          <NavLink to="/admin/add-technology" className="projectMenu">
            Add Technology
          </NavLink>
          <NavLink to="/admin/all-technologys" className="projectMenu">
            All Technology
          </NavLink>
        </div>

        {/* CONTACT */}
        <NavLink
          to="/admin/contact-messages"
          className={({ isActive }) =>
            `admin_nav ${isActive ? "active_nav" : ""}`
          }
        >
          Contact
        </NavLink>
        <NavLink
          to="/admin/profile"
          className={({ isActive }) =>
            `admin_nav ${isActive ? "active_nav" : ""}`
          }
        >
          Profile
        </NavLink>

        <NavLink
          to="/admin/gallery"
          className={({ isActive }) =>
            `admin_nav ${isActive ? "active_nav" : ""}`
          }
        >
          Gallery
        </NavLink>
      </div>
    </aside>
  );
};

export default AdminSideBar;
