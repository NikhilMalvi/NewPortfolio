import React, { useEffect, useState } from "react";
import About_dark_img from "../../img/About_dark_img.png";
import About_light_img from "../../img/About_light_img.png";
import Education_dark from "../../img/Education_dark.png";
import Education_light from "../../img/Education_light.png";
import "./About.css";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import DOMPurify from "dompurify";

const About = () => {
  const [isLightMode, setIsLightMode] = useState(true);
  const { axios } = useAppContext();
  const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
  const [about, setAbout] = useState({});

  const fetchAboutData = async () => {
    try {
      const { data } = await axios.get("/api/about/all");
      if (data.success) {
        setAbout(data.about);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchAboutData();
  }, []);

  useEffect(() => {
    const checkTheme = () => {
      setIsLightMode(document.body.classList.contains("light-mode"));
    };

    checkTheme();

    const checkbox = document.getElementById("theme-checkbox");
    checkbox?.addEventListener("change", checkTheme);

    return () => checkbox?.removeEventListener("change", checkTheme);
  }, [about]);

  return (
    <>
      <title>About | Nikhil Malviya - Front-End Developer</title>
      <meta
        name="description"
        content="Learn more about Nikhil Malviya, a skilled Front-End and WordPress developer based in Ahmedabad, India."
      />
      <div className="About">
        <div className="section_container About_me">
          <div className="max_container">
            <div className="col1">
              <img
                src={
                  isLightMode
                    ? about.lightImage
                      ? `${VITE_BASE_URL}/uploads/gallery/${about.lightImage}`
                      : About_light_img
                    : about.darkImage
                    ? `${VITE_BASE_URL}/uploads/gallery/${about.darkImage}`
                    : About_dark_img
                }
                alt="About"
              />
            </div>
            <div className="col2">
              <h1>{about.aboutHeading}</h1>
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(about.aboutDescription),
                }}
              ></div>
            </div>
          </div>
        </div>
        <div className="section_container My_workdata">
          <div className="container_data">
            {about.counters?.map((item, index) => (
              <div key={index} className="box_heding">
                <h1>
                  {item.value}
                  {item.symbol}
                </h1>
                <p>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="section_container MyEducation">
          <div className="max_container">
            <div className="col1">
              <h1>{about.section3Title}</h1>
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(about.section3Content),
                }}
              ></div>
            </div>
            <div className="col2">
              <img
                src={
                  isLightMode
                    ? about.section3LightImg
                      ? `${VITE_BASE_URL}/uploads/gallery/${about.section3LightImg}`
                      : Education_light
                    : about.section3DarkImg
                    ? `${VITE_BASE_URL}/uploads/gallery/${about.section3DarkImg}`
                    : Education_dark
                }
                alt="Education"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
