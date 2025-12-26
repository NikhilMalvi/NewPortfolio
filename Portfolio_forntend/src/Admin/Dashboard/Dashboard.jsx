import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/Sidebar/Sidebar";
import AdminSideBar from "../../Components/Admin/AdminSideBar/AdminSideBar";
import { useAppContext } from "../../context/AppContext";
import "./Dashboard.css";
import TableOfProject from "../../Components/Admin/TableOfProject/TableOfProject";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [countprojects, setCountprojects] = useState();
  const [contactcount, setContactcount] = useState();
  const { axios } = useAppContext();

  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

  const fetchProjects = async () => {
    try {
      const { data } = await axios.get("/api/project/all");

      if (data.success) {
        setProjects(data.project);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;

    try {
      const { data } = await axios.delete(`/api/project/delete-project/${id}`);

      if (data.success) {
        toast.success(data.message);
        setProjects((prev) => prev.filter((item) => item._id !== id));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredProjects = () => {
    if (searchQuery === "") {
      return projects;
    }

    return projects.filter(
      (project) =>
        project.projectTitle
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        project.projectSkills.some(
          (skill) =>
            skill.skillName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            skill.parentSkill.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        project.projectTools
          .split(",")
          .some((tool) =>
            tool.toLowerCase().includes(searchQuery.toLowerCase())
          )
    );
  };

  const fetchNumberOfProjects = async () => {
    try {
      const { data } = await axios.get("/api/project/count-projects/");
      setCountprojects(data.totalProjects);
    } catch (error) {
      console.error("Error fetching number of projects:", error);
    }
  };

  const fetchContact = async () => {
    try {
      const { data } = await axios.get("/api/contact/count-contacts/");
      setContactcount(data.count || 0);
    } catch (error) {
      console.error("Error fetching number of projects:", error);
    }
  };

  useEffect(() => {
    fetchNumberOfProjects();
    fetchContact();
    fetchProjects();
  }, []);

  const numberOfPage = 6;
  const numberOfProject = countprojects;
  const numberOfMessages = contactcount;

  return (
    <section className="dashboard">
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>{numberOfPage}</h3>
          <p>Number of Pages</p>
        </div>
        <div className="dashboard-card">
          <h3>{numberOfProject}</h3>
          <p>Number of Projects</p>
        </div>
        <div className="dashboard-card">
          <h3>{numberOfMessages}</h3>
          <p> Number of Messages</p>
        </div>
      </div>

      <div className="dashborad-project">
        <TableOfProject
          projects={projects}
          handleDelete={handleDelete}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredProjects={filteredProjects}
          navigate={navigate}
          VITE_BASE_URL={VITE_BASE_URL}
        />
      </div>
    </section>
  );
};

export default Dashboard;
