import React from "react";
import { useEffect, useRef, useState } from "react";
import data from "../Data/data";
import img_1 from "../../img/img_1.jpg";
import img_2 from "../../img/img_2.jpg";
import img_3 from "../../img/img_3.jpg";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Imge_slider = () => {
  const [currnt_index, setcurrnt_index] = useState(0);
  const [AutoPlay, setAutoPlay] = useState(true);

  const [tech, setTech] = useState([]);
  const { axios, navigate } = useAppContext();
  const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

  const fetchAllTech = async () => {
    try {
      const { data } = await axios.get("/api/technology/all");

      if (data.success) {
        setTech(data.technology);
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

  let Timeout = null;

  useEffect(() => {
    Timeout =
      AutoPlay &&
      setTimeout(() => {
        slide_right();
      }, 2500);
  });
  // const image_slider = [
  //   {
  //     img_slide: img_1,
  //     tech_name: "Html",
  //   },
  //   {
  //     img_slide: img_2,
  //     tech_name: "Css",
  //   },
  //   {
  //     img_slide: img_3,
  //     tech_name: "Tailwind Css",
  //   },
  // ];

  const slide_right = () => {
    setcurrnt_index(currnt_index === tech.length - 1 ? 0 : currnt_index + 1);
  };
  const slide_left = () => {
    setcurrnt_index(currnt_index === 0 ? tech.length - 1 : currnt_index - 1);
  };

  return (
    <div
      className="imgeslider"
      onMouseEnter={() => {
        setAutoPlay(false);
        clearTimeout(Timeout);
      }}
      onMouseLeave={() => setAutoPlay(true)}
    >
      <div className="slider_wrapper">
        {tech.map((techStack, index) => (
          <div
            className={
              index == currnt_index
                ? "carousel_card carousel_card_active"
                : "carousel_card"
            }
            key={techStack._id}
          >
            <img
              src={`${VITE_BASE_URL}/uploads/gallery/${techStack.techImg}`}
              alt=""
              className="carousel_img"
            />
            <h2>{techStack.techName}</h2>
          </div>
        ))}{" "}
        <div className="slider_arrow_left" onClick={slide_left}>
          <MdKeyboardArrowLeft />
        </div>
        <div className="slider_arrow_right" onClick={slide_right}>
          <MdKeyboardArrowRight />
        </div>
        <div className="slider_pagination">
          {tech.map((_, index) => (
            <div
              className={
                index == currnt_index
                  ? "pagination_dot pagination_dot_active"
                  : "pagination_dot"
              }
              key={index}
              onClick={() => setcurrnt_index(index)}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Imge_slider;
