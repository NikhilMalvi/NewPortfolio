import React, { useState } from "react";
import html_img from "../../../img/html.png";
import react_img from "../../../img/React_js.webp";
import css_img from "../../../img/CSS.webp";
import javascript_img from "../../../img/js.png";
import tailwind_css from "../../../img/tailwind_css.png";
import wordpress_img from "../../../img/wordpress.webp";
import "./GetTechStack.css";
import toast from "react-hot-toast";
import { useAppContext } from "../../../context/AppContext";
import { useEffect } from "react";
import { useParams } from "react-router";

const GetTechStack = () => {
  const [technology, setTechnology] = useState([]);
  const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

  const { axios, navigate } = useAppContext();

  const fetchAllTech = async () => {
    try {
      const { data } = await axios.get("/api/technology/all");

      if (data.success) {
        setTechnology(data.technology);
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
      const { data } = await axios.delete(`/api/technology/delete-tech/${id}`);

      if (data.success) {
        toast.success(data.message);
        setTechnology((prev) => prev.filter((item) => item._id !== id));
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
      return technology;
    }

    return technology.filter((tech) =>
      tech.techName.toLowerCase().includes(searchTerm.toLowerCase())
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
          <p className="notechText">No tech found.</p>
        ) : (
          <table className="techTable">
            <thead>
              <tr>
                <th>Tech image</th>
                <th>Tech Name</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredTech().map((tech, index) => (
                <tr key={index}>
                  <td className="techImageBox">
                    <img
                      src={`${VITE_BASE_URL}/uploads/gallery/${tech.techImg}`}
                      alt=""
                      className="techImg"
                    />
                  </td>
                  <td>{tech.techName}</td>
                  <td className="btnTechBox">
                    <button
                      className="editTech"
                      onClick={() => navigate(`/admin/edit-tech/${tech._id}`)}
                    >
                      Edit
                    </button>
                  </td>

                  <td className="btnTechBox">
                    <button
                      className="delettech"
                      onClick={() => deleteTech(tech._id)}
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

export default GetTechStack;
