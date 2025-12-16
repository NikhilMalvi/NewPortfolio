import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaLayerGroup } from "react-icons/fa";
import { IoIosArrowRoundForward } from "react-icons/io";
import { Link } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { motion } from "motion/react";

const Tab = ({ project_data }) => {
  const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
  const [projectData, setProjectData] = useState([]);
  const [menu, setMenu] = useState("All");
  const [skill, setSkill] = useState([]);
  const { axios } = useAppContext();

  const fetchProjectData = async () => {
    // Fetch or update project data here if needed
    try {
      const { data } = await axios.get("/api/project/all");
      if (data.success) {
        setProjectData(data.project);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchSkills = async () => {
    try {
      const { data } = await axios.get("/api/project/skill/all");
      if (data.success) {
        const skills = data.skill;
        setSkill(skills);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchProjectData();
    fetchSkills();
  }, []);

  return (
    <div className="tabes">
      <motion.div
        className="block_tabes max_container"
        layoutId="underline"
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <div
          className={menu === "All" ? "tab tab_active" : "tab"}
          key="All"
          onClick={() => setMenu("All")}
        >
          <h1>All</h1>
        </div>

        {skill.map((data) => {
          return (
            <div
              className={menu === data._id ? "tab tab_active" : "tab"}
              key={data._id}
              onClick={() => setMenu(data._id)}
            >
              <h1>{data.skillName}</h1>
            </div>
          );
        })}
      </motion.div>

      <div className="contant_tab max_container">
        {projectData
          .filter((mainData) =>
            menu === "All"
              ? true
              : mainData.projectSkills.some((skill) => skill._id === menu)
          )
          .map((mainData) => {
            return (
              <div
                className={
                  menu === "All"
                    ? "card card_active"
                    : mainData.projectSkills.some((s) => s._id === menu)
                    ? "card card_active"
                    : "card"
                }
                key={mainData._id}
              >
                <img
                  src={`${VITE_BASE_URL}/uploads/gallery/${mainData.projectImage}`}
                  alt=""
                />
                <div className="card_data">
                  <h1>{mainData.projectTitle}</h1>
                  <div className="list_icon">
                    <FaLayerGroup size={15} color="var(--text-color)" />
                    <span>
                      {mainData.projectSkills
                        .map((skill) => skill.skillName)
                        .join(", ")}
                    </span>
                  </div>
                  <div className="read_more">
                    <Link to={`/project/${mainData._id}`}>Read more</Link>
                    <IoIosArrowRoundForward size={20} />
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Tab;
