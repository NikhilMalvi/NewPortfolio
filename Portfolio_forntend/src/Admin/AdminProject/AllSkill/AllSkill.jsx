import React from "react";
import { useAppContext } from "../../../context/AppContext";
import { useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";

const AllSkill = () => {
  const [skill, setSkill] = useState([]);
  const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

  const { axios, navigate } = useAppContext();

  const fetchAllTech = async () => {
    try {
      const { data } = await axios.get("/api/project/skill/all");

      if (data.success) {
        setSkill(data.skill);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchAllTech();
  }, []);

  const deleteTech = async (id) => {
    if (!confirm("Are you sure you want to delete this technology?")) return;

    try {
      const { data } = await axios.delete(
        `/api/project/skill/delete-skill/${id}`
      );

      if (data.success) {
        toast.success(data.message);
        setSkill((prev) => prev.filter((item) => item._id !== id));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const [searchTerm, setSearchTerm] = useState("");

  const filteredTech = () => {
    if (searchTerm === "") {
      return skill;
    }

    return skill.filter(
      (skill) =>
        skill.skillName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.parentSkill.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <section className="techWrapper">
      <div className="techContainer">
        <h2 className="techHeading">All Technology</h2>
        <div className="techSearchBar">
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
        </div>
        {filteredTech().length === 0 ? (
          <p className="notechText">No Skill found.</p>
        ) : (
          <table className="techTable">
            <thead>
              <tr>
                <th>Skill Name</th>
                <th>Skill Slug</th>
                <th>Parent Skill</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredTech().map((skill, index) => (
                <tr key={index}>
                  <td>{skill.skillName}</td>
                  <td>{skill.skillSlug}</td>

                  <td>{skill.parentSkill}</td>

                  <td className="btnTechBox">
                    <button
                      className="editTech"
                      onClick={() => navigate(`/admin/edit-skill/${skill._id}`)}
                    >
                      Edit
                    </button>
                  </td>

                  <td className="btnTechBox">
                    <button
                      className="delettech"
                      onClick={() => deleteTech(skill._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};

export default AllSkill;
