import React, { useEffect, useState } from "react";
import "./Home.css";
import Home_light_img from "../../img/Home_light_img.png";
import Home_dark_img from "../../img/Home_dark_img.png";
import react_img from "../../img/React_js.webp";
import css_img from "../../img/CSS.webp";
import javascript_img from "../../img/js.png";
import tailwind_css from "../../img/tailwind_css.png";
import wordpress_img from "../../img/wordpress.webp";
import { FiArrowRight } from "react-icons/fi";

import html_img from "../../img/html.png";
import { Link } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Home = () => {
  const [techStack, setTechStack] = useState([]);

  const [home, setHome] = useState({});
  const { axios } = useAppContext();
  const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

  const fetchTech = async () => {
    try {
      const { data } = await axios.get(`${VITE_BASE_URL}/api/technology/all`);
      if (data.success) {
        setTechStack(data.technology);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchHomeData = async () => {
    try {
      const { data } = await axios.get("/api/home/all");

      if (data.success) {
        setHome(data.home);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchHomeData();
    fetchTech();
  }, []);

  const [logo, setLogo] = useState(null);

  useEffect(() => {
    const updateLogo = () => {
      setLogo(
        document.body.classList.contains("light-mode")
          ? home.lightImage
          : home.darkImage
      );
    };

    if (home.lightImage || home.darkImage) {
      updateLogo();
    }

    const checkbox = document.getElementById("theme-checkbox");
    checkbox?.addEventListener("change", updateLogo);

    return () => checkbox?.removeEventListener("change", updateLogo);
  }, [home]);

  return (
    <>
      <title>Nikhil Malviya | Front-End & WordPress Developer Portfolio</title>

      <meta
        name="description"
        content="Hi, I'm Nikhil Malviya — a Front-End Developer and WordPress expert based in India. I build clean, responsive websites that deliver seamless user experiences."
      />

      <div className="home">
        <section className="section_container row1">
          <div className="max_container">
            <div className="col1">
              <h1>{home.homeHeading}</h1>
              <h2>{home.homeDescription}</h2>
              <Link className="btn" to={`/${home.homeCTALink}`}>
                {home.homeCTA}
                <FiArrowRight />
              </Link>
            </div>
            <div className="col2">
              <img src={`${VITE_BASE_URL}/uploads/gallery/${logo}`} alt="" />
            </div>
          </div>
        </section>
        <section className="section_container row2">
          <h1 className="tech_heading">Tech Stack</h1>
          <div className="tech_stack">
            {techStack.map((tech) => (
              <div className="image_boxes" key={tech._id}>
                <div className="box">
                  <img
                    src={`${VITE_BASE_URL}/uploads/gallery/${tech.techImg}`}
                    alt=""
                  />
                  <h1 className="tech_name">{tech.techName}</h1>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
