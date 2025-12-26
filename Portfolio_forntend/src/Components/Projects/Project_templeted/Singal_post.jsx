import React from "react";
import { useParams } from "react-router-dom";
import "./Singal_post.css";
import { projectDataWithAll } from "../item";
import { MdDateRange, MdOutlinePlace } from "react-icons/md";
import { FaLink, FaLayerGroup } from "react-icons/fa";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { useAppContext } from "../../../context/AppContext";
import { useState } from "react";
import Project from "../Project";
import DOMPurify from "dompurify";

const Singal_post = () => {
  const { projectId } = useParams();
  const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
  const { axios } = useAppContext();
  const [projectData, setProjectData] = useState([]);

  const fetchProjectData = async () => {
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

  useEffect(() => {
    fetchProjectData();
  }, []);

  const post_data = projectData.find(
    (project) => project._id.toString() === projectId
  );

  if (!post_data) {
    return <div>Project not found</div>;
  }

  const formatted = new Date(post_data.createdAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <>
      <title>{post_data.projectTitle} | Nikhil Malviya Project Showcase</title>

      <meta
        name="description"
        content="A modern and responsive real estate landing page built using React and Tailwind CSS. Designed and developed by Nikhil Malviya."
      />
      <div className="singal_post section_container">
        <div className="title">
          <h1>{post_data.projectTitle}</h1>
          <p>Here Some details About {post_data.projectTitle}</p>
        </div>
        <div className="max_container singal_container">
          <div className="col1">
            <img src={post_data.projectImageUrl} alt="" />
            <div className="list_post_data">
              <div className="post_icons">
                <MdDateRange size={20} color="#0068ff" />
                {formatted}
              </div>
              <div className="post_icons">
                <FaLink size={20} color="#0068ff" />
                <a href={post_data.projectWebsite} target="_blank">
                  Website
                </a>
              </div>
              <div className="post_icons">
                <FaLayerGroup size={20} color="#0068ff" />
                {post_data.projectSkills.map((skill, index) => (
                  <span key={index}>
                    {skill.skillName}
                    {index < post_data.projectSkills.length - 1 ? ", " : ""}
                  </span>
                ))}
              </div>
              <div className="post_icons">
                <MdOutlinePlace size={20} color="#0068ff" />
                {post_data.projectLocation}
              </div>
            </div>
          </div>
          <div className="col2">
            <h1 className="primery_heading">
              Name : <span>{post_data.projectTitle}</span>
            </h1>
            <h1 className="primery_heading">
              Tools: <span>{post_data.projectTools}</span>
            </h1>
            <h1 className="primery_heading">
              About:
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(post_data.projectDescription),
                }}
                className="post_description"
              ></div>
            </h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default Singal_post;
