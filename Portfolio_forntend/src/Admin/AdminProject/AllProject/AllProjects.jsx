import React, { useEffect, useState } from "react";
import "./AllProjects.css";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppContext } from "../../../context/AppContext";
import TableOfProject from "../../../Components/Admin/TableOfProject/TableOfProject";

const AllProjects = () => {
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

  useEffect(() => {
    // In real implementation, fetch projects from API

    fetchProjects();
    //
  }, []);

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

  return (
    <section className="projectListWrapper">
      <div className="projectListContainer">
        <h2 className="projectListHeading">All Projects</h2>

        {/* Search + Filter UI
        <div className="filterBar">
          <input
            type="text"
            placeholder="Search by name..."
            className="searchInput"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filteredProjects().length === 0 ? (
          <p className="emptyMsg">No projects found.</p>
        ) : (
          <table className="projectTable">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Skills</th>
                <th>Tools</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProjects().map((p) => (
                <tr key={p._id}>
                  <td>
                    <img
                      src={`${VITE_BASE_URL}/uploads/gallery/${p.projectImage}`}
                      alt={p.projectTitle}
                      className="tableImg"
                    />
                  </td>

                  <td>{p.projectTitle}</td>

                  <td>
                    <div className="tagRow">
                      {p.projectSkills.map((s, i) => (
                        <span key={s._id} className="tag">
                          {s.skillName}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td>
                    <div className="tagRow">
                      {p.projectTools.split(",").map((tool, i) => (
                        <span key={i} className="tag tool">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="actionCell">
                    <button
                      onClick={() => navigate(`/admin/edit-project/${p._id}`)}
                      className="editBtn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="deleteBtn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )} */}

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

export default AllProjects;
